import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  technicalNote?: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'Does Locksmith need network access to my production row data?',
    answer:
      'No. Locksmith operates strictly on PostgreSQL schema catalog metadata (table names, column types, row count estimates from pg_class.reltuples, and foreign key definitions). It never reads, stores, or transmits your application rows.',
    technicalNote: 'Security model: Read-only access to pg_catalog metadata tables, or static parsing via SQL AST.',
  },
  {
    question: 'Can every migration be transformed into zero-downtime SQL?',
    answer:
      '98% of standard additive and schema refactoring migrations (adding columns, indexes, foreign keys, non-null constraints, enums) can be decomposed into lock-free phases. For strictly destructive changes (e.g. dropping a column immediately), Locksmith enforces a safe 3-phase deprecation cycle.',
    technicalNote: 'Phases: 1. Ignore in ORM layer → 2. Mark column unused in catalog → 3. Drop column during bounded window.',
  },
  {
    question: 'How does Locksmith prevent lock queue pileups under heavy TPS?',
    answer:
      'Every phase in a generated Locksmith migration is prepended with `SET lock_timeout = "250ms"`. If the migration cannot acquire its lock within 250ms (for instance, if a long analytical transaction is holding a conflicting lock), it cancels itself immediately and releases its place in the lock queue.',
    technicalNote: 'Prevents the classic PostgreSQL outage where waiting DDL causes connection pool exhaustion.',
  },
  {
    question: 'Which PostgreSQL versions and hosting providers are supported?',
    answer:
      'PostgreSQL versions 14, 15, 16, and 17 are fully supported across Amazon RDS, Aurora PostgreSQL, Supabase, Neon, Google Cloud SQL, Azure Database for PostgreSQL, and self-hosted instances.',
    technicalNote: 'Version-specific catalog behaviors (like constant default optimization) are automatically branched in AST engine.',
  },
  {
    question: 'Can Locksmith be run self-hosted in air-gapped environments?',
    answer:
      'Yes. The Locksmith CLI and Docker container are distributed as self-contained static binaries that run on your own CI infrastructure without calling external services.',
    technicalNote: 'Zero telemetry or external telemetry egress required.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0); // First FAQ open by default

  const toggleItem = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 md:py-24 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-[var(--accent-emerald)] uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Honest Technical Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--text-primary)] tracking-tight">
            Frequently Answered Engineering Questions
          </h2>
          <p className="text-sm sm:text-base text-[var(--text-secondary)] mt-2">
            Transparent answers on database locks, security boundaries, and edge-case execution.
          </p>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-[var(--bg-surface)] border border-[var(--border-subtle)] hover:border-[var(--border-strong)] transition-colors rounded-xl overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => toggleItem(idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                    {faq.question}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] flex items-center justify-center text-[var(--text-secondary)] shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-4 sm:px-5 pb-5 pt-1 border-t border-[var(--border-subtle)]/50 text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed space-y-3 animate-in fade-in duration-200">
                    <p>{faq.answer}</p>
                    {faq.technicalNote && (
                      <div className="p-2.5 rounded bg-[var(--code-bg)] border border-[var(--code-border)] font-mono text-[11px] text-[var(--accent-emerald)] flex items-center gap-2">
                        <span className="font-bold">ENGINEERING NOTE:</span>
                        <span>{faq.technicalNote}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default FAQSection;

