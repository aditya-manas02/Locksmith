import React, { useState, useEffect } from 'react';
import { Shield, Terminal, Sun, Moon, ArrowUpRight, Menu, X } from 'lucide-react';

interface NavbarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenEasterEgg: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ darkMode, setDarkMode, onOpenEasterEgg }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[var(--bg-base)]/90 backdrop-blur-md border-b border-[var(--border-subtle)] shadow-xs'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--border-strong)] flex items-center justify-center text-[var(--accent-emerald)] group-hover:border-[var(--accent-emerald)] transition-colors shadow-xs">
            <Shield className="w-4.5 h-4.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-[var(--text-primary)]">Locksmith</span>
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                v1.4
              </span>
            </div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] -mt-1 hidden sm:inline">Postgres DDL Safety</span>
          </div>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--text-secondary)]">
          <a href="#workbench" className="hover:text-[var(--text-primary)] transition-colors">
            Interactive Workbench
          </a>
          <a href="#lock-matrix" className="hover:text-[var(--text-primary)] transition-colors">
            Lock Hierarchy
          </a>
          <a href="#how-it-works" className="hover:text-[var(--text-primary)] transition-colors">
            How It Works
          </a>
          <a href="#ci-config" className="hover:text-[var(--text-primary)] transition-colors">
            CI Integration
          </a>
          <a href="#faq" className="hover:text-[var(--text-primary)] transition-colors">
            Architecture FAQ
          </a>
        </nav>

        {/* Action Buttons & Theme Toggle */}
        <div className="flex items-center gap-2">
          {/* CLI Easter Egg trigger */}
          <button
            onClick={onOpenEasterEgg}
            title="Open Interactive CLI (Press ⌘K or ?)"
            aria-label="Open CLI terminal inspector"
            className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-mono bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>⌘K</span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
            className="w-8 h-8 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-strong)] transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action */}
          <a
            href="#workbench"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-semibold bg-[var(--accent-emerald)] text-black hover:opacity-90 transition-all shadow-xs"
          >
            <span>Simulate DDL</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden w-8 h-8 rounded-md bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)]"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 pt-3 pb-5 space-y-3">
          <a
            href="#workbench"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-primary)] py-1.5"
          >
            Interactive Workbench
          </a>
          <a
            href="#lock-matrix"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] py-1.5"
          >
            Lock Hierarchy
          </a>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] py-1.5"
          >
            How It Works
          </a>
          <a
            href="#ci-config"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] py-1.5"
          >
            CI Integration
          </a>
          <a
            href="#faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[var(--text-secondary)] py-1.5"
          >
            Architecture FAQ
          </a>
          <div className="pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)] font-mono">Postgres 14 - 17 DDL Safe</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEasterEgg();
              }}
              className="inline-flex items-center gap-1 text-xs font-mono text-[var(--accent-emerald)]"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Launch CLI Terminal</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;

