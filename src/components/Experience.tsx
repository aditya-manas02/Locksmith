import React from 'react';
import { ArrowRight, CheckCircle2, GitPullRequest } from 'lucide-react';

export const WorkflowSection: React.FC = () => {
  const steps = [
    {
      stepNumber: '01',
      title: 'Static AST & Metadata Extraction',
      description:
        'Locksmith parses incoming SQL and ORM migration files (Prisma, Drizzle, Rails, Django, Flyway, Alembic) into an abstract syntax tree. It inspects existing schema metadata, foreign key topologies, and live table row counts.',
      badge: 'Sub-Second AST Parse',
      codeSnippet: `// Analyzes migration AST against pg_catalog
const ddlAst = parsePostgresDDL(migrationSql);
const catalog = await inspectCatalogMetadata('orders');
// Output: Table 'orders' has 18.4M tuples, 4 FK references`,
    },
    {
      stepNumber: '02',
      title: 'Lock Contention & Stall Simulation',
      description:
        'Computes the exact lock level required by every statement in the transaction. Simulates worst-case lock queue delays under active read/write TPS and calculates connection pool exhaustion risks.',
      badge: 'Queue Physics Engine',
      codeSnippet: `// Evaluates lock level & transaction timeout
const lockLevel = evaluateLockLevel(ddlAst.operation);
// ACCESS_EXCLUSIVE detected on orders!
// Estimated hold time: 4.8s (exceeds 250ms threshold)
// Action: Trigger CI FAIL with automated remediation`,
    },
    {
      stepNumber: '03',
      title: 'Zero-Downtime Multi-Phase Plan',
      description:
        'Decomposes hazardous monolithic migrations into safe, multi-step DDL scripts with statement timeouts, concurrent index validation, and background backfill hooks.',
      badge: 'Automated PR Remediation',
      codeSnippet: `// Generates safe multi-phase plan
const safePlan = decomposeToSafePlan(ddlAst, {
  lockTimeoutMs: 250,
  backfillBatchSize: 5000,
});
// Posts formatted PR comment with copyable safe SQL`,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 md:py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] uppercase tracking-wider mb-2">
            <GitPullRequest className="w-3.5 h-3.5" />
            <span>Under The Hood</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            How Locksmith Enforces Zero-Lock Safety in CI
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 leading-relaxed">
            Every PR containing schema migrations runs through Locksmith's 3-stage validation pipeline before code reaches your staging or production environments.
          </p>
        </div>

        {/* 3-Step Architecture Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {steps.map((step) => (
            <div
              key={step.stepNumber}
              className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-all rounded-xl p-6 flex flex-col justify-between shadow-xs relative group"
            >
              <div>
                {/* Step Pill & Header */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-[var(--text-muted)] group-hover:text-[var(--accent-emerald)] transition-colors">
                    {step.stepNumber}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)]">
                    {step.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
                  {step.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed mb-6">
                  {step.description}
                </p>
              </div>

              {/* Code Snippet */}
              <div className="bg-[var(--code-bg)] border border-[var(--code-border)] rounded-lg p-3 font-mono text-[11px] text-[var(--text-muted)] overflow-x-auto">
                <pre className="text-[var(--text-secondary)]">
                  <code>{step.codeSnippet}</code>
                </pre>
              </div>
            </div>
          ))}
        </div>

        {/* Pipeline Guarantee Callout */}
        <div className="mt-12 p-6 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[var(--text-primary)]">
                Deterministic CI Safety Gate
              </div>
              <div className="text-xs text-[var(--text-secondary)]">
                If a migration holds a blocking lock for &gt; 250ms, CI exits with code 1 and posts the safe multi-step diff directly to the PR.
              </div>
            </div>
          </div>

          <a
            href="#ci-config"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-mono font-semibold bg-[var(--bg-surface)] border border-[var(--border-strong)] text-[var(--text-primary)] hover:border-[var(--accent-emerald)] transition-colors shrink-0"
          >
            <span>View CI Workflow YAML</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

      </div>
    </section>
  );
};

export default WorkflowSection;

