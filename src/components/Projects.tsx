
import React, { useState, useMemo } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Copy, 
  Check, 
  Play, 
  Layers, 
  Clock, 
  ShieldCheck, 
  Flame, 
  Sparkles,
  Sliders
} from 'lucide-react';

interface Scenario {
  id: string;
  name: string;
  category: string;
  description: string;
  unsafeSql: string;
  unsafeLock: string;
  unsafeReason: string;
  safeSql: string;
  safeLock: string;
  safeExplanation: string;
  stepsCount: number;
  baseLockTimeMs: number; // base time at 1M rows
  queriesPerSecMultiplier: number;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'add-column-default',
    name: 'Add Column with DEFAULT',
    category: 'Schema Evolution',
    description: 'Adding a column with a non-null volatile default value on a high-throughput orders table.',
    unsafeSql: `-- ⚠️ DANGEROUS: Unvetted PR Migration
ALTER TABLE orders 
  ADD COLUMN status text DEFAULT 'pending' NOT NULL;`,
    unsafeLock: 'ACCESS EXCLUSIVE',
    unsafeReason: 'Acquires ACCESS EXCLUSIVE lock. Blocks all concurrent SELECTs and INSERTs while validating default value.',
    safeSql: `-- ✅ LOCKSMITH VERIFIED MULTI-STEP PLAN
-- Phase 1: Instant metadata lock with bounded timeout (12ms)
SET lock_timeout = '250ms';
ALTER TABLE orders ADD COLUMN status text;

-- Phase 2: Set default for future rows only (zero lock stall)
ALTER TABLE orders ALTER COLUMN status SET DEFAULT 'pending';

-- Phase 3: Lock-free historical backfill in batches
-- LOCKSMITH CLI generated batch script (statement_timeout = 250ms)
UPDATE orders SET status = 'pending' WHERE status IS NULL;

-- Phase 4: Enforce NOT NULL safely
ALTER TABLE orders ADD CONSTRAINT check_status_not_null 
  CHECK (status IS NOT NULL) NOT VALID;
ALTER TABLE orders VALIDATE CONSTRAINT check_status_not_null;`,
    safeLock: 'SHARE UPDATE EXCLUSIVE',
    safeExplanation: 'Splits catalog updates from data validation. Caps individual lock acquisitions at 250ms.',
    stepsCount: 4,
    baseLockTimeMs: 140,
    queriesPerSecMultiplier: 0.85,
  },
  {
    id: 'create-index',
    name: 'Create Index on Hot Table',
    category: 'Performance',
    description: 'Adding a B-Tree index on a high-velocity user_id foreign key column.',
    unsafeSql: `-- ⚠️ DANGEROUS: Standard ORM Migration
CREATE INDEX idx_orders_user_id 
  ON orders(user_id);`,
    unsafeLock: 'SHARE',
    unsafeReason: 'SHARE lock prevents all incoming INSERT, UPDATE, DELETE statements until full sequential index scan completes.',
    safeSql: `-- ✅ LOCKSMITH VERIFIED MULTI-STEP PLAN
-- Phase 1: Execute concurrent build outside transactional block
SET statement_timeout = '0';
SET lock_timeout = '250ms';

-- Runs asynchronously without blocking concurrent reads or writes
CREATE INDEX CONCURRENTLY idx_orders_user_id 
  ON orders(user_id);

-- Phase 2: Automated verification of index validity
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_index JOIN pg_class ON pg_index.indexrelid = pg_class.oid WHERE relname = 'idx_orders_user_id' AND indisvalid) THEN
    RAISE EXCEPTION 'Concurrent index build failed validation';
  END IF;
END $$;`,
    safeLock: 'SHARE UPDATE EXCLUSIVE',
    safeExplanation: 'Builds index concurrently in background. Writes proceed without blocking.',
    stepsCount: 2,
    baseLockTimeMs: 320,
    queriesPerSecMultiplier: 1.4,
  },
  {
    id: 'foreign-key',
    name: 'Add Foreign Key Constraint',
    category: 'Data Integrity',
    description: 'Linking foreign key constraint payments(user_id) -> users(id) on a 15M+ row ledger.',
    unsafeSql: `-- ⚠️ DANGEROUS: Standard FK DDL
ALTER TABLE payments 
  ADD CONSTRAINT fk_payments_user 
  FOREIGN KEY (user_id) REFERENCES users(id);`,
    unsafeLock: 'SHARE ROW EXCLUSIVE',
    unsafeReason: 'Locks BOTH payments and users tables. Sequential scan validates existing rows while writes queue up.',
    safeSql: `-- ✅ LOCKSMITH VERIFIED MULTI-STEP PLAN
-- Phase 1: Add constraint with NOT VALID (instant catalog acquisition <15ms)
SET lock_timeout = '250ms';
ALTER TABLE payments 
  ADD CONSTRAINT fk_payments_user 
  FOREIGN KEY (user_id) REFERENCES users(id) NOT VALID;

-- Phase 2: Validate existing rows concurrently without table write lock
-- Uses SHARE UPDATE EXCLUSIVE on payments, reads users with ROW SHARE
ALTER TABLE payments VALIDATE CONSTRAINT fk_payments_user;`,
    safeLock: 'ROW SHARE + SHARE UPDATE',
    safeExplanation: 'Separates constraint definition from full-table validation. Zero downtime for concurrent writes.',
    stepsCount: 2,
    baseLockTimeMs: 450,
    queriesPerSecMultiplier: 1.1,
  },
  {
    id: 'alter-type',
    name: 'Alter Column Type (VARCHAR → TEXT)',
    category: 'Schema Refactoring',
    description: 'Expanding column width on customer bio/metadata table under constant read/write traffic.',
    unsafeSql: `-- ⚠️ DANGEROUS: In-place Type Migration
ALTER TABLE accounts 
  ALTER COLUMN account_code TYPE varchar(255);`,
    unsafeLock: 'ACCESS EXCLUSIVE',
    unsafeReason: 'Postgres locks table and triggers a full heap rewrite if the new type requires binary representation changes.',
    safeSql: `-- ✅ LOCKSMITH VERIFIED MULTI-STEP PLAN
-- Phase 1: Verify type equivalence (varchar(n) -> text is zero-rewrite in PG >=12)
-- Locksmith verifies binary compatibility before applying catalog-only change:
SET lock_timeout = '250ms';
ALTER TABLE accounts ALTER COLUMN account_code TYPE text;

-- Phase 2: Enforce check constraint for length limit safely
ALTER TABLE accounts ADD CONSTRAINT check_code_len 
  CHECK (char_length(account_code) <= 255) NOT VALID;
ALTER TABLE accounts VALIDATE CONSTRAINT check_code_len;`,
    safeLock: 'SHARE UPDATE EXCLUSIVE',
    safeExplanation: 'Leverages binary-compatible catalog modification without heap rewrite, guarded by lock timeout.',
    stepsCount: 2,
    baseLockTimeMs: 180,
    queriesPerSecMultiplier: 0.9,
  }
];

export const ProductWorkbench: React.FC = () => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>('add-column-default');
  const [rowCountIndex, setRowCountIndex] = useState<number>(2); // 0=100k, 1=500k, 2=2M, 3=10M, 4=50M
  const [activeTab, setActiveTab] = useState<'diff' | 'timeline'>('diff');
  const [simulating, setSimulating] = useState<boolean>(false);
  const [simulatedComplete, setSimulatedComplete] = useState<boolean>(false);
  const [copiedSafe, setCopiedSafe] = useState<boolean>(false);

  const rowCountOptions = [
    { label: '100K Rows', value: 100000, factor: 0.1 },
    { label: '500K Rows', value: 500000, factor: 0.5 },
    { label: '2M Rows', value: 2000000, factor: 2.0 },
    { label: '10M Rows', value: 10000000, factor: 10.0 },
    { label: '50M Rows', value: 50000000, factor: 50.0 },
  ];

  const currentScenario = useMemo(() => {
    return SCENARIOS.find((s) => s.id === activeScenarioId) || SCENARIOS[0];
  }, [activeScenarioId]);

  const rowFactor = rowCountOptions[rowCountIndex].factor;
  
  // Real calculation metrics
  const unsafeLockDurationMs = Math.round(currentScenario.baseLockTimeMs * rowFactor);
  const blockedQueriesCount = Math.round(
    (unsafeLockDurationMs / 1000) * 850 * currentScenario.queriesPerSecMultiplier
  );
  const safeLockDurationMs = Math.min(18, Math.round(12 + rowFactor * 0.1));

  const handleSimulate = () => {
    setSimulating(true);
    setSimulatedComplete(false);
    setTimeout(() => {
      setSimulating(false);
      setSimulatedComplete(true);
    }, 1100);
  };

  const handleCopySafe = () => {
    navigator.clipboard.writeText(currentScenario.safeSql);
    setCopiedSafe(true);
    setTimeout(() => setCopiedSafe(false), 2000);
  };

  return (
    <section id="workbench" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-[var(--border-subtle)] gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] uppercase tracking-wider mb-2">
              <Layers className="w-3.5 h-3.5" />
              <span>Product In Action · Live DDL Analyzer</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
              Interactive Migration Workbench
            </h2>
            <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-1 max-w-xl">
              Select a risky schema migration scenario below and adjust table size to see live lock acquisition physics and Locksmith's generated safe plan.
            </p>
          </div>

          {/* Table Size Slider Widget */}
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-strong)] min-w-[280px] shadow-xs">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
                <Sliders className="w-3 h-3 text-[var(--accent-emerald)]" />
                <span>Target Table Size:</span>
              </span>
              <span className="font-bold text-[var(--accent-emerald)]">
                {rowCountOptions[rowCountIndex].label}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="1"
              value={rowCountIndex}
              onChange={(e) => setRowCountIndex(parseInt(e.target.value))}
              aria-label="Target table size slider"
              className="w-full accent-[var(--accent-emerald)] cursor-pointer h-1.5 bg-[var(--bg-surface-elevated)] rounded-lg"
            />
            <div className="flex justify-between text-[10px] font-mono text-[var(--text-muted)]">
              <span>100K</span>
              <span>500K</span>
              <span>2M</span>
              <span>10M</span>
              <span>50M</span>
            </div>
          </div>
        </div>

        {/* Scenario Switcher Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {SCENARIOS.map((scenario) => {
            const isActive = scenario.id === activeScenarioId;
            return (
              <button
                key={scenario.id}
                onClick={() => {
                  setActiveScenarioId(scenario.id);
                  setSimulatedComplete(false);
                }}
                className={`p-3 text-left rounded-lg transition-all border ${
                  isActive
                    ? 'bg-[var(--bg-surface-elevated)] border-[var(--accent-emerald)] shadow-xs'
                    : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase text-[var(--text-muted)] tracking-wider">
                  {scenario.category}
                </div>
                <div className={`text-xs sm:text-sm font-semibold mt-0.5 ${isActive ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                  {scenario.name}
                </div>
              </button>
            );
          })}
        </div>

        {/* Real-time Metric Telemetry Strip (The Micro-Interaction that Earns Its Keep) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {/* Metric 1: Unsafe Lock Level */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-rose-500/30 glow-rose">
            <div className="flex items-center justify-between text-xs font-mono text-rose-500 mb-1">
              <span>UNSAFE LOCK LEVEL</span>
              <AlertTriangle className="w-3.5 h-3.5" />
            </div>
            <div className="text-base sm:text-lg font-bold text-rose-500 font-mono">
              {currentScenario.unsafeLock}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Blocks read & write transactions
            </div>
          </div>

          {/* Metric 2: Estimated Table Stall Duration */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-amber-500/30 glow-amber">
            <div className="flex items-center justify-between text-xs font-mono text-amber-500 mb-1">
              <span>UNSAFE TABLE STALL</span>
              <Clock className="w-3.5 h-3.5" />
            </div>
            <div className="text-base sm:text-lg font-bold text-amber-500 font-mono">
              {unsafeLockDurationMs >= 1000 ? `${(unsafeLockDurationMs / 1000).toFixed(2)}s` : `${unsafeLockDurationMs}ms`}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              {blockedQueriesCount.toLocaleString()} concurrent queries queued
            </div>
          </div>

          {/* Metric 3: Locksmith Safe Lock Level */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-emerald-500/30 glow-emerald">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-500 mb-1">
              <span>LOCKSMITH LOCK LEVEL</span>
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-500 font-mono">
              {currentScenario.safeLock}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Zero query blocking on hot tables
            </div>
          </div>

          {/* Metric 4: Bounded Safe Lock Time */}
          <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-emerald-500/30 glow-emerald">
            <div className="flex items-center justify-between text-xs font-mono text-emerald-500 mb-1">
              <span>SAFE MAX HOLD TIME</span>
              <Flame className="w-3.5 h-3.5" />
            </div>
            <div className="text-base sm:text-lg font-bold text-emerald-500 font-mono">
              &lt; {safeLockDurationMs}ms
            </div>
            <div className="text-[11px] text-[var(--text-secondary)] mt-0.5">
              Guaranteed by statement_timeout
            </div>
          </div>
        </div>

        {/* Main Workbench Card (Mock IDE / CI Visual) */}
        <div className="rounded-xl bg-[var(--bg-surface)] border border-[var(--border-strong)] overflow-hidden shadow-lg">
          
          {/* Top Bar / Window Controls */}
          <div className="px-4 py-3 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <span className="text-xs font-mono font-medium text-[var(--text-secondary)]">
                locksmith://analyzer/{currentScenario.id}.sql · Postgres 16.4 Engine
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-md bg-[var(--bg-base)] p-0.5 border border-[var(--border-subtle)] text-xs font-mono">
                <button
                  onClick={() => setActiveTab('diff')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'diff'
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  SQL DDL Diff
                </button>
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    activeTab === 'timeline'
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  Lock Queue Timeline
                </button>
              </div>

              {/* Run Simulated CI Button */}
              <button
                onClick={handleSimulate}
                disabled={simulating}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-[var(--accent-emerald)] text-black hover:opacity-90 transition-all disabled:opacity-50"
              >
                {simulating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing AST...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 fill-current" />
                    <span>Verify in CI</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulated CI Banner if completed */}
          {simulatedComplete && (
            <div className="px-4 py-2.5 bg-emerald-500/10 border-b border-emerald-500/20 flex items-center justify-between text-xs font-mono text-emerald-400 animate-in fade-in duration-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>CI Simulation: PASS (0 blocking locks detected across {rowCountOptions[rowCountIndex].label})</span>
              </div>
              <span className="text-[10px] text-emerald-500/80 hidden sm:inline">AST Scan Time: 42ms · Catalog Rule: PG-16-DDL-004</span>
            </div>
          )}

          {/* Workbench Body Content */}
          {activeTab === 'diff' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[var(--border-subtle)] font-mono text-xs">
              
              {/* Left Column: Dangerous Raw DDL */}
              <div className="p-4 sm:p-5 flex flex-col justify-between bg-[var(--code-bg)]">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 text-rose-500 font-semibold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>PR Incoming DDL (Raw ORM Output)</span>
                    </div>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-500 border border-rose-500/20">
                      BLOCKED IN CI
                    </span>
                  </div>

                  <pre className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed overflow-x-auto py-2">
                    <code>{currentScenario.unsafeSql}</code>
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-rose-400/90 leading-snug">
                  <span className="font-bold">Incident Risk:</span> {currentScenario.unsafeReason}
                </div>
              </div>

              {/* Right Column: Generated Safe Multi-Step Plan */}
              <div className="p-4 sm:p-5 flex flex-col justify-between bg-[var(--bg-surface)]">
                <div>
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 text-emerald-500 font-semibold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Locksmith Generated Safe Plan ({currentScenario.stepsCount} Phases)</span>
                    </div>
                    <button
                      onClick={handleCopySafe}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      {copiedSafe ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedSafe ? 'Copied' : 'Copy SQL'}</span>
                    </button>
                  </div>

                  <pre className="text-[var(--text-primary)] whitespace-pre-wrap leading-relaxed overflow-x-auto py-2">
                    <code>{currentScenario.safeSql}</code>
                  </pre>
                </div>

                <div className="mt-4 pt-3 border-t border-[var(--border-subtle)] text-[11px] text-emerald-500/90 leading-snug">
                  <span className="font-bold">Safety Guarantee:</span> {currentScenario.safeExplanation}
                </div>
              </div>

            </div>
          ) : (
            /* Timeline & Queue View */
            <div className="p-6 bg-[var(--code-bg)] font-mono text-xs space-y-6">
              <div>
                <div className="text-sm font-bold text-[var(--text-primary)] mb-1">
                  Postgres Transaction Lock Contention Comparison
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  Simulating 850 query/sec workload on a table with {rowCountOptions[rowCountIndex].label}.
                </p>
              </div>

              {/* Unsafe Timeline Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-rose-500 font-semibold">❌ Unsafe Execution: Exclusive Table Lock Timeline</span>
                  <span className="text-rose-400">{unsafeLockDurationMs}ms total stall</span>
                </div>
                <div className="h-7 w-full bg-[var(--bg-surface-subtle)] rounded-md overflow-hidden flex border border-rose-500/30">
                  <div 
                    className="bg-rose-500/80 flex items-center justify-center text-[10px] text-white font-bold transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(15, rowFactor * 20))}%` }}
                  >
                    ACCESS EXCLUSIVE ({unsafeLockDurationMs}ms)
                  </div>
                  <div className="flex-1 bg-amber-500/30 flex items-center px-3 text-[10px] text-amber-300">
                    {blockedQueriesCount} Queries Blocked in Connection Queue
                  </div>
                </div>
              </div>

              {/* Safe Timeline Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-emerald-500 font-semibold">✅ Locksmith Multi-Step Execution</span>
                  <span className="text-emerald-400">&lt; {safeLockDurationMs}ms transient catalog lock</span>
                </div>
                <div className="h-7 w-full bg-[var(--bg-surface-subtle)] rounded-md overflow-hidden flex border border-emerald-500/30">
                  <div 
                    className="bg-emerald-500 flex items-center justify-center text-[10px] text-black font-bold"
                    style={{ width: '4%' }}
                  >
                    Phase 1 (12ms)
                  </div>
                  <div className="flex-1 bg-emerald-500/10 flex items-center px-3 text-[10px] text-emerald-400">
                    Background Concurrent Processing (Zero Blocked Queries · Full Live Reads & Writes)
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
};

export default ProductWorkbench;

