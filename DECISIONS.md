# Engineering Decisions: Locksmith

### 1. Why this design and positioning approach over the obvious alternative?

**Rejected alternative**: A generic "AI-powered Database Optimizer" or standard SaaS landing page featuring a templated hero, 3 feature columns, a fake logo bar ("Trusted by Stripe, Netflix"), and vague marketing copy ("Boost database speed by 10x").

**Chosen approach**: **Locksmith** — a laser-focused developer tool that solves one acute, high-anxiety engineering problem: table-locking Postgres DDL migrations causing cascading production outages under high query loads.

**Why**:
- **Sharper value proposition**: Senior backend and platform engineers immediately understand the threat of an `ACCESS EXCLUSIVE` lock on a table with 20M rows. The copy is precise and technical rather than vague marketing fluff.
- **Micro-interaction restraint**: Rather than scattering multiple distracting scroll reveals or floating badges across the page, we invested 100% of interaction craft into **one central interactive DDL & Lock Contention Workbench**. It lets users toggle real incident scenarios (adding columns with defaults, concurrent index creation, FK constraints), drag a live row-count slider (100K to 50M rows), and watch calculated lock hold times, queued queries, and generated safe multi-step SQL plans react in real time.
- **Zero fake social proof**: Rather than fabricated customer counts, credibility is established through real PostgreSQL lock mechanics (from `ACCESS SHARE` up to `ACCESS EXCLUSIVE`), explicit statement timeout limits (`SET lock_timeout = '250ms'`), and copyable GitHub Actions CI configurations.

---

### 2. One trade-off made under the time limit, and what I'd do with a real week.

**The trade-off**:
To keep the client-side bundle lean and fast without backend dependencies, the migration analyzer in the interactive workbench uses a client-side heuristic model (mapping DDL patterns to Postgres lock matrices and calculating lock queue duration based on table row multipliers) rather than running an embedded WebAssembly Postgres engine (`pg-mem` / DuckDB Wasm / PGlite).

**With a real week**:
1. **In-Browser PGlite WASM sandbox**: I would embed `@electric-sql/pglite` directly in the browser to execute genuine DDL statements against an in-memory catalog, allowing visitors to paste arbitrary custom SQL migrations and inspect real `pg_locks` system views live.
2. **Interactive Visual PR Comment Bot Simulator**: Add an interactive GitHub pull request review diff viewer that simulates a live PR review conversation between `locksmith-bot` and a developer requesting an automated lock-free refactor.
3. **Live ORM AST parser generator**: Support one-click conversion between Prisma Schema, Drizzle Schema, and Rails `db/migrate` syntax directly inside the workbench.

---

### 3. AI tool usage and personal verification / changes.

- **AI Usage**: Used AI to scaffold the initial AST scenario matrix data structures, assist with standard PostgreSQL lock mode descriptions, and draft the initial TypeScript types for the workbench state machine.
- **Personal Verification & Manual Changes**:
  1. **Postgres Locking Accuracy**: Personally verified every single generated SQL script against PostgreSQL 14–17 documentation. Specifically ensured that `CREATE INDEX CONCURRENTLY` is executed outside a standard migration transaction block and that foreign keys are added with `NOT VALID` prior to running `VALIDATE CONSTRAINT` in a second phase.
  2. **Layout & Responsive Architecture**: Manually audited CSS layout at `390px` (iPhone 14) and `1440px` (desktop), tuning flex wrap behaviors, padding scales, and removing all fixed-width containers to guarantee zero horizontal scroll.
  3. **Typography & Token Hierarchy**: Manually replaced default Tailwind styles with a custom CSS token design system in `src/index.css` (custom dark/light tokens, mono font pairing with JetBrains Mono for SQL code, precise glow boundaries for lock severity states).
  4. **Performance Verification**: Ensured all dynamic animations rely exclusively on GPU-accelerated CSS properties (`transform` and `opacity`) to eliminate layout thrashing during slider interactions.
