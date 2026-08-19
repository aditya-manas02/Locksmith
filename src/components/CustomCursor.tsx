import React from 'react';
import { Shield, Terminal, ArrowUp } from 'lucide-react';

interface FooterProps {
  onOpenEasterEgg: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenEasterEgg }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] py-12 text-xs font-mono text-[var(--text-secondary)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[var(--border-subtle)]">
          
          {/* Logo & Pitch */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--accent-emerald)]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-[var(--text-primary)]">Locksmith</span>
              <span className="text-[var(--text-muted)] ml-2">— Zero-Lock Postgres DDL Engine</span>
            </div>
          </div>

          {/* Quick Nav Anchors */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-[11px]">
            <a href="#workbench" className="hover:text-[var(--text-primary)] transition-colors">
              Workbench
            </a>
            <a href="#lock-matrix" className="hover:text-[var(--text-primary)] transition-colors">
              Lock Hierarchy
            </a>
            <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
              CI Workflow
            </a>
            <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">
              Architecture FAQ
            </a>
            <button
              onClick={onOpenEasterEgg}
              className="hover:text-[var(--accent-emerald)] transition-colors flex items-center gap-1"
            >
              <Terminal className="w-3 h-3" />
              <span>CLI Inspector (⌘K)</span>
            </button>
          </div>

          {/* Scroll to Top */}
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="p-2 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

        {/* Bottom copyright & honest engineering note */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[var(--text-muted)]">
          <div>
            Built with craft for the <span className="text-[var(--text-primary)] font-semibold">Acdyon Frontend Challenge</span>.
          </div>
          <div>
            PostgreSQL is a registered trademark of the PostgreSQL Community Association.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

