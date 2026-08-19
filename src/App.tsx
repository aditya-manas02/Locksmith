import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ProductWorkbench from './components/Projects'; // ProductWorkbench component
import LockMatrix from './components/Skills'; // LockMatrix component
import WorkflowSection from './components/Experience'; // WorkflowSection component
import IntegrationSection from './components/Education'; // IntegrationSection component
import FAQSection from './components/Contact'; // FAQSection component
import EasterEggModal from './components/Certificates'; // EasterEggModal component
import Footer from './components/CustomCursor'; // Footer component

export function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('locksmith-theme');
      if (saved) return saved === 'dark';
      return true; // Default to dark mode for developer tooling aesthetic
    }
    return true;
  });

  const [easterEggOpen, setEasterEggOpen] = useState<boolean>(false);

  // Sync dark class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('locksmith-theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('locksmith-theme', 'light');
    }
  }, [darkMode]);

  // Global keyboard shortcuts (Cmd+K / Ctrl+K / ?)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setEasterEggOpen((prev) => !prev);
      } else if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setEasterEggOpen((prev) => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] relative selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Navigation */}
      <Navbar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onOpenEasterEgg={() => setEasterEggOpen(true)}
      />

      {/* Main Page Sections */}
      <main className="w-full overflow-x-hidden">
        {/* Section 1: Hero */}
        <Hero onOpenEasterEgg={() => setEasterEggOpen(true)} />

        {/* Section 2: Product In Action (Interactive Migration Workbench) */}
        <ProductWorkbench />

        {/* Section 3: Lock Contention Hierarchy */}
        <LockMatrix />

        {/* Section 4: CI/CD Safety Pipeline Mechanics */}
        <WorkflowSection />

        {/* Section 5: Integration Configurations */}
        <IntegrationSection />

        {/* Section 6: Architecture FAQs */}
        <FAQSection />
      </main>

      {/* Footer */}
      <Footer onOpenEasterEgg={() => setEasterEggOpen(true)} />

      {/* Easter Egg Terminal Modal */}
      <EasterEggModal
        isOpen={easterEggOpen}
        onClose={() => setEasterEggOpen(false)}
      />
    </div>
  );
}

export default App;

