import React, { useState } from 'react';
import { Copy, Check, Github, CheckCircle2 } from 'lucide-react';

export const IntegrationSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'github' | 'gitlab' | 'cli'>('github');
  const [copied, setCopied] = useState(false);

  const configs = {
    github: `name: Postgres DDL Safety Gate
on:
  pull_request:
    paths:
      - 'prisma/migrations/**'
      - 'db/migrate/**'
      - 'migrations/**'

jobs:
  locksmith-verify:
    name: Lock Contention Analyzer
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run Locksmith DDL Inspection
        uses: locksmith-dev/locksmith-action@v1
        with:
          pg_version: '16.4'
          max_lock_timeout_ms: 250
          fail_on_access_exclusive: true
          comment_on_pr: true
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}`,
    gitlab: `stages:
  - test

locksmith_schema_guard:
  stage: test
  image: locksmith/ci:latest
  script:
    - locksmith inspect --path="./migrations" --max-lock-timeout=250ms --pg-version=16
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      changes:
        - migrations/**/*`,
    cli: `# 1. Install Locksmith CLI globally or run with npx
npm install -g @locksmith/cli

# 2. Run static analysis against your migration folder
locksmith verify ./prisma/migrations --pg-version=16

# 3. Simulate high-traffic production lock contention
locksmith simulate ./migrations/20260819_add_status.sql \\
  --table=orders \\
  --rows=20000000 \\
  --tps=1200`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(configs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="ci-config" className="py-16 md:py-24 bg-[var(--bg-surface-subtle)]/30 border-y border-[var(--border-subtle)] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] uppercase tracking-wider mb-2">
            <Github className="w-3.5 h-3.5" />
            <span>Zero-Config CI Integration</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Drop into your CI pipeline in 60 seconds
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2 leading-relaxed">
            Locksmith runs in standard GitHub Actions runners and GitLab pipelines without requiring direct network access to your production database.
          </p>
        </div>

        {/* Integration Grid: Code Card + PR Preview Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: YAML Config Editor */}
          <div className="lg:col-span-7 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl overflow-hidden shadow-sm">
            {/* Tab Bar */}
            <div className="px-4 py-3 bg-[var(--bg-surface-elevated)] border-b border-[var(--border-subtle)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('github')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeTab === 'github'
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  .github/workflows/locksmith.yml
                </button>
                <button
                  onClick={() => setActiveTab('gitlab')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeTab === 'gitlab'
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  .gitlab-ci.yml
                </button>
                <button
                  onClick={() => setActiveTab('cli')}
                  className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                    activeTab === 'cli'
                      ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  CLI / Local
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-mono bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {/* Code Body */}
            <div className="p-4 sm:p-5 bg-[var(--code-bg)] overflow-x-auto text-xs font-mono text-[var(--text-secondary)] leading-relaxed">
              <pre>
                <code>{configs[activeTab]}</code>
              </pre>
            </div>
          </div>

          {/* Right: Mock PR Bot Review Comment (Showing realism) */}
          <div className="lg:col-span-5 bg-[var(--bg-surface)] border border-[var(--border-strong)] rounded-xl p-5 shadow-sm space-y-4">
            
            {/* PR Bot Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-mono text-[10px] font-bold">
                  LS
                </div>
                <span className="text-xs font-bold text-[var(--text-primary)]">locksmith-bot</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono">commented 2m ago</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                PASSED (0 LOCKS)
              </span>
            </div>

            {/* PR Summary Table */}
            <div className="space-y-3 font-mono text-xs">
              <div className="text-[var(--text-primary)] font-bold">
                🛡️ Postgres Schema Safety Audit
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-muted)]">Max Lock Hold</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">14ms (&lt;250ms)</div>
                </div>
                <div className="p-2 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)]">
                  <div className="text-[var(--text-muted)]">Blocking Locks</div>
                  <div className="text-emerald-400 font-bold text-sm mt-0.5">0 Detected</div>
                </div>
              </div>

              <div className="p-3 rounded bg-[var(--code-bg)] border border-[var(--code-border)] text-[11px] text-[var(--text-secondary)] space-y-1.5">
                <div className="text-[var(--text-primary)] font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Validated DDL Changes:</span>
                </div>
                <div className="pl-4 space-y-1">
                  <div>• `orders.status` (text) added with lock-free backfill hook</div>
                  <div>• Statement timeout locked to `250ms`</div>
                  <div>• Backward-compatible rollback migration verified</div>
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[var(--text-muted)] font-mono pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <span>Runner: Locksmith Engine v1.4.2</span>
              <span>Execution time: 0.84s</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default IntegrationSection;

