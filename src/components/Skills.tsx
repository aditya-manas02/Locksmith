import React, { useState } from 'react';
import { Shield, Lock, Unlock, AlertCircle, Server } from 'lucide-react';

interface LockLevel {
  name: string;
  level: number; // 1 to 8
  commonCommands: string[];
  blocksReads: boolean;
  blocksWrites: boolean;
  blocksConcurrentDDL: boolean;
  dangerDescription: string;
  locksmithStrategy: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const LOCK_LEVELS: LockLevel[] = [
  {
    name: 'ACCESS SHARE',
    level: 1,
    commonCommands: ['SELECT'],
    blocksReads: false,
    blocksWrites: false,
    blocksConcurrentDDL: false,
    dangerDescription: 'Conflicts only with ACCESS EXCLUSIVE. Safe for all queries.',
    locksmithStrategy: 'Allows full parallelism. Monitored for long-running open transactions.',
    severity: 'low',
  },
  {
    name: 'ROW SHARE',
    level: 2,
    commonCommands: ['SELECT FOR UPDATE', 'SELECT FOR SHARE'],
    blocksReads: false,
    blocksWrites: false,
    blocksConcurrentDDL: true,
    dangerDescription: 'Acquired when rows are explicitly locked for modification.',
    locksmithStrategy: 'Ensures foreign key validation reads use ROW SHARE instead of table locks.',
    severity: 'low',
  },
  {
    name: 'ROW EXCLUSIVE',
    level: 3,
    commonCommands: ['INSERT', 'UPDATE', 'DELETE'],
    blocksReads: false,
    blocksWrites: false,
    blocksConcurrentDDL: true,
    dangerDescription: 'Standard data modification lock. Conflicts with SHARE and above.',
    locksmithStrategy: 'Batches backfills in small chunks to prevent ROW EXCLUSIVE lock pileups.',
    severity: 'medium',
  },
  {
    name: 'SHARE UPDATE EXCLUSIVE',
    level: 4,
    commonCommands: ['VACUUM', 'ANALYZE', 'CREATE INDEX CONCURRENTLY', 'VALIDATE CONSTRAINT'],
    blocksReads: false,
    blocksWrites: false,
    blocksConcurrentDDL: true,
    dangerDescription: 'Protects table schema against concurrent schema changes while permitting full concurrent reads and writes.',
    locksmithStrategy: 'Locksmith maps all DDL operations to this level whenever possible.',
    severity: 'medium',
  },
  {
    name: 'SHARE',
    level: 5,
    commonCommands: ['CREATE INDEX (non-concurrent)'],
    blocksReads: false,
    blocksWrites: true,
    blocksConcurrentDDL: true,
    dangerDescription: 'Blocks all INSERT, UPDATE, DELETE until complete table scan finishes.',
    locksmithStrategy: 'Rewrites to CREATE INDEX CONCURRENTLY with automated failure recovery.',
    severity: 'high',
  },
  {
    name: 'SHARE ROW EXCLUSIVE',
    level: 6,
    commonCommands: ['CREATE TRIGGER', 'ALTER TABLE ADD FOREIGN KEY (without NOT VALID)'],
    blocksReads: false,
    blocksWrites: true,
    blocksConcurrentDDL: true,
    dangerDescription: 'Blocks concurrent write operations and other SHARE locks.',
    locksmithStrategy: 'Decomposes into two-step NOT VALID + VALIDATE CONSTRAINT.',
    severity: 'high',
  },
  {
    name: 'EXCLUSIVE',
    level: 7,
    commonCommands: ['REFRESH MATERIALIZED VIEW (non-concurrent)'],
    blocksReads: false,
    blocksWrites: true,
    blocksConcurrentDDL: true,
    dangerDescription: 'Blocks ROW SHARE and all higher lock modes.',
    locksmithStrategy: 'Enforces REFRESH MATERIALIZED VIEW CONCURRENTLY with unique index verification.',
    severity: 'high',
  },
  {
    name: 'ACCESS EXCLUSIVE',
    level: 8,
    commonCommands: ['ALTER TABLE ...', 'DROP TABLE', 'TRUNCATE', 'REINDEX', 'VACUUM FULL'],
    blocksReads: true,
    blocksWrites: true,
    blocksConcurrentDDL: true,
    dangerDescription: 'The #1 cause of Postgres outages. Blocks EVERYTHING including SELECTs. All incoming queries wait behind it in the lock queue until connection pool dies.',
    locksmithStrategy: 'Strictly bounded to < 250ms via lock_timeout, or replaced with lock-free shadow patterns.',
    severity: 'critical',
  },
];

export const LockMatrix: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<LockLevel>(LOCK_LEVELS[7]); // Default to ACCESS EXCLUSIVE

  const getSeverityBadge = (severity: LockLevel['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20 animate-pulse';
    }
  };

  return (
    <section id="lock-matrix" className="py-16 md:py-24 bg-[var(--bg-surface-subtle)]/40 border-y border-[var(--border-subtle)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] uppercase tracking-wider mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Postgres Internal Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            The Postgres Lock Hierarchy
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 leading-relaxed">
            Understanding why naive ORM migrations knock down production. In PostgreSQL, lock requests form a strict FIFO queue. When a migration requests an <code className="font-mono text-rose-400">ACCESS EXCLUSIVE</code> lock, all subsequent queries stall behind it until it finishes.
          </p>
        </div>

        {/* Lock Hierarchy Grid & Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Lock Level Selector List (8 levels) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-2 px-1">
              Select Lock Mode to Inspect Contention:
            </div>

            {LOCK_LEVELS.map((lock) => {
              const isSelected = lock.name === selectedLevel.name;
              return (
                <button
                  key={lock.name}
                  onClick={() => setSelectedLevel(lock)}
                  className={`w-full p-3 rounded-lg text-left transition-all border flex items-center justify-between font-mono text-xs ${
                    isSelected
                      ? 'bg-[var(--bg-surface-elevated)] border-[var(--border-strong)] shadow-xs ring-1 ring-[var(--accent-emerald)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-subtle)] hover:border-[var(--border-strong)]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded flex items-center justify-center bg-[var(--bg-base)] text-[10px] font-bold text-[var(--text-secondary)]">
                      L{lock.level}
                    </span>
                    <span className={`font-semibold ${isSelected ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                      {lock.name}
                    </span>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getSeverityBadge(lock.severity)}`}>
                    {lock.severity.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right: Detailed Lock Behavior Card */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-6 shadow-sm space-y-6">
            
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold font-mono text-[var(--text-primary)]">
                    {selectedLevel.name}
                  </h3>
                  <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold border ${getSeverityBadge(selectedLevel.severity)}`}>
                    Level {selectedLevel.level} Lock
                  </span>
                </div>
                <div className="text-xs text-[var(--text-muted)] mt-1 font-mono">
                  Common: {selectedLevel.commonCommands.join(', ')}
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs font-mono">
                <div className={`flex items-center gap-1 ${selectedLevel.blocksReads ? 'text-rose-500 font-bold' : 'text-emerald-500'}`}>
                  {selectedLevel.blocksReads ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Reads {selectedLevel.blocksReads ? 'BLOCKED' : 'Allowed'}</span>
                </div>
                <div className={`flex items-center gap-1 ${selectedLevel.blocksWrites ? 'text-rose-500 font-bold' : 'text-emerald-500'}`}>
                  {selectedLevel.blocksWrites ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                  <span>Writes {selectedLevel.blocksWrites ? 'BLOCKED' : 'Allowed'}</span>
                </div>
              </div>
            </div>

            {/* Incident Risk Breakdown */}
            <div>
              <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                <span>Production Failure Mode</span>
              </h4>
              <p className="text-xs sm:text-sm text-[var(--text-secondary)] bg-[var(--bg-surface-elevated)] p-3.5 rounded-lg border border-[var(--border-subtle)] leading-relaxed">
                {selectedLevel.dangerDescription}
              </p>
            </div>

            {/* Locksmith Safety Mitigation Strategy */}
            <div>
              <h4 className="text-xs font-mono text-[var(--text-muted)] uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                <span>Locksmith Automated Mitigation</span>
              </h4>
              <div className="text-xs sm:text-sm text-[var(--text-primary)] bg-emerald-500/5 border border-emerald-500/20 p-3.5 rounded-lg leading-relaxed">
                {selectedLevel.locksmithStrategy}
              </div>
            </div>

            {/* Lock Queue Cascade Explainer */}
            <div className="p-4 rounded-lg bg-[var(--code-bg)] border border-[var(--border-subtle)] text-xs font-mono space-y-2">
              <div className="flex items-center justify-between text-[var(--text-primary)] font-semibold">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  <span>The Postgres Lock Queue Trap (Why max_connections Fails)</span>
                </span>
              </div>
              <p className="text-[var(--text-muted)] leading-relaxed">
                Postgres processes locks strictly in order. If an <span className="text-rose-400">ACCESS EXCLUSIVE</span> lock is waiting for a 10-second background report to finish, all subsequent fast 1ms <span className="text-emerald-400">SELECT</span> queries are blocked in line behind it. In 3 seconds, your pool of 100 connections exhausts completely.
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default LockMatrix;

