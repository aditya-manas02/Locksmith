import React, { useState } from 'react';
import { ArrowRight, Check, Copy, ShieldAlert, Zap, Database, GitPullRequest } from 'lucide-react';

interface HeroProps {
  onOpenEasterEgg: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenEasterEgg: _onOpenEasterEgg }) => {
  const [copied, setCopied] = useState(false);
  const commandText = 'npx locksmith-ci verify ./migrations';

  const handleCopy = () => {
    navigator.clipboard.writeText(commandText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background radial highlight & subtle grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          
          {/* Status / Category Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] text-[var(--text-secondary)] mb-6 shadow-xs">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Continuous Postgres DDL Safety · Zero Table Locks</span>
          </div>

          {/* Value Prop Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[var(--text-primary)] leading-[1.1] mb-6">
            Ship Postgres migrations{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-500">
              without locking your database.
            </span>
          </h1>

          {/* One-Sentence Subhead */}
          <p className="text-base sm:text-xl text-[var(--text-secondary)] leading-relaxed max-w-2xl mb-8">
            Locksmith simulates DDL in CI against your schema catalog, flags <code className="px-1.5 py-0.5 rounded text-xs sm:text-sm font-mono bg-rose-500/10 text-rose-500 border border-rose-500/20">ACCESS EXCLUSIVE</code> lock stalls before code merges, and generates verified zero-downtime multi-step SQL.
          </p>

          {/* CTA & CLI Command Group */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-12">
            <a
              href="#workbench"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg text-sm font-semibold bg-[var(--accent-emerald)] text-black hover:opacity-90 transition-all shadow-md group"
            >
              <span>Inspect Live DDL Workbench</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>

            {/* Quickstart Command Widget */}
            <div className="w-full sm:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-[var(--code-bg)] border border-[var(--code-border)] text-xs font-mono text-[var(--text-secondary)] shadow-inner">
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 select-none">$</span>
                <span className="text-[var(--text-primary)]">{commandText}</span>
              </div>
              <button
                onClick={handleCopy}
                aria-label="Copy CLI Command"
                className="p-1 rounded hover:bg-[var(--bg-surface-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Engineering Guarantees Banner (Honest, Technical Facts) */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl text-left">
            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-1">
                <ShieldAlert className="w-3.5 h-3.5 text-emerald-500" />
                <span>LOCK BOUND</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Max 250ms</div>
              <div className="text-[11px] text-[var(--text-secondary)]">Strict lock_timeout enforcement</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span>CI VELOCITY</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">&lt; 1.2s Analysis</div>
              <div className="text-[11px] text-[var(--text-secondary)]">AST & metadata shadow parse</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-1">
                <Database className="w-3.5 h-3.5 text-blue-500" />
                <span>PG COMPATIBILITY</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Postgres 14 - 17</div>
              <div className="text-[11px] text-[var(--text-secondary)]">Full DDL catalog ruleset</div>
            </div>

            <div className="p-3.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] mb-1">
                <GitPullRequest className="w-3.5 h-3.5 text-emerald-400" />
                <span>SAFETY PR BOT</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-[var(--text-primary)]">Automated DDL Diffs</div>
              <div className="text-[11px] text-[var(--text-secondary)]">In-line review comments with safe SQL</div>
            </div>
          </div>

          {/* Supported Ecosystem Badges (Framed honestly as parser engines) */}
          <div className="mt-12 pt-8 border-t border-[var(--border-subtle)] w-full flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--text-muted)]">
            <span className="uppercase tracking-wider">Supported ORMs & Migration Frameworks:</span>
            <div className="flex flex-wrap items-center justify-center gap-4 text-[var(--text-secondary)] font-medium text-xs">
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Prisma</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Drizzle ORM</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">ActiveRecord</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Django ORM</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Flyway</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Alembic</span>
              <span className="px-2 py-1 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">Raw SQL</span>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;

