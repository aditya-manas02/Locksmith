# Locksmith — Zero-Lock Postgres DDL Migration Engine

> Continuous schema migration safety for PostgreSQL that detects table locks and guarantees zero downtime before pull requests merge.

Built for the **Acdyon Technologies Engineering Frontend Challenge (Part 2: The Premium Home Page)**.

---

## 🌟 Product Proposition

- **What it is**: A CI/CD-native schema migration safety analyzer and multi-phase SQL plan generator for PostgreSQL.
- **Who it's for**: Senior backend, infrastructure, and platform engineers managing high-throughput PostgreSQL databases where unvetted DDL causes cascading connection pool exhaustion and production outages.
- **Core Outcome**: Automatically inspects PR migration scripts against live schema metadata in CI, detects blocking exclusive locks (`ACCESS EXCLUSIVE`) and lock queue stalls, and outputs verified, lock-free multi-step migration plans.

---

## 🚀 Live Demo & Local Development

### Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Run local dev server
npm run dev

# 3. Production build & type-check
npm run build

# 4. Preview production build
npm run preview
```

### Free Deployment (Vercel / Netlify / GitHub Pages)

- **Vercel**: Run `npx vercel` or connect the GitHub repository for instant zero-config deployment.
- **Netlify**: Run `npx netlify deploy --prod --dir=dist`.
- **GitHub Pages**: Build output in `./dist` is fully static and ready for GitHub Pages hosting.

---

## 🎯 Architecture & Design Highlights

1. **Product In Action**: Interactive Workbench featuring real-time Postgres lock physics, live row-count slider (100K to 50M rows), side-by-side SQL diffs, and simulated CI test execution.
2. **Postgres Lock Matrix**: Interactive inspector covering all 8 PostgreSQL lock levels from `ACCESS SHARE` up to `ACCESS EXCLUSIVE`.
3. **One Micro-Interaction That Earns Its Keep**: Live DDL & Lock Contention Calculator dynamically recomputing lock acquisition stall duration, queued queries at 850 TPS, and multi-step phase safety.
4. **All-or-Nothing Dark & Light Theme**: Built with CSS custom property design tokens in `src/index.css` ensuring 100% token coverage and zero light-mode leakage.
5. **Bonus Easter Egg**: Press `⌘K` or `?` (or click the terminal badge in navigation) to launch the interactive **Locksmith CLI Inspector**. Try typing `acdyon`, `inspect`, `locks`, or `help`.
6. **Honesty & Integrity**: Zero fabricated testimonials, zero fake user counts, zero fake logos. Every claim is rooted in genuine PostgreSQL locking mechanics.

---

## 📄 Engineering Decisions

See [`DECISIONS.md`](./DECISIONS.md) for the 1-page engineering rationale answering the 3 required rubric questions.

