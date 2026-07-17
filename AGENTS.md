# AGENTS

Social Marketers Network (SMN) is a single Next.js 16 + Payload CMS 3 app. The repo root is a thin npm wrapper; the entire application lives in `web/`. Standard scripts are in `web/package.json`; setup/run/test docs live in `web/README.md` and `docs/testing.md`.

## Cursor Cloud specific instructions

- **Run the app (dev):** from repo root `npm run dev` (delegates to `web/`), or `cd web && npm run dev`. One Next.js process serves the marketing site, member portal (`/app`), and staff ops app (`/staff`) on `http://localhost:3000`.
- **Local env file is required.** `web/.env` is git-ignored and machine-local; the update script does not create it. If it is missing, `cp web/.env.example web/.env`. The defaults are enough for dev/build: `PAYLOAD_SECRET` is set to a placeholder and `DATABASE_URL` is unset, so Payload uses local SQLite (`file:./payload.db`, auto-created). No external services are needed for local dev — Resend/Mailchimp/R2/Groq degrade gracefully when unconfigured.
- **First users:** on an empty DB, bootstrap the first staff user at `/staff/login`; members self-serve at `/signup` → `/app`.
- **Stale SQLite breaks build/importmap/e2e.** A leftover `payload.db` can fail `npm run build` or E2E with Drizzle `index already exists`. CI deletes `payload.db payload.db-shm payload.db-wal payload.importmap-*.db payload.e2e-*.db` first, then runs `npm run db:ensure-sqlite`. Do the same if the build complains about existing indexes.
- **E2E needs Postgres, not SQLite (non-obvious).** `npm run test:e2e` (in `web/`) calls `db:push` → `scripts/push-schema.mjs`, which hard-rejects non-`postgres://` URLs. Point it at a Postgres DB via `PLAYWRIGHT_DATABASE_URL=postgresql://user:pass@127.0.0.1:5432/<db>` and install the browser once with `npx playwright install chromium`. The default local SQLite flow described in `docs/testing.md` does not currently satisfy the `db:push` step.
- **Known pre-existing failures (not env-related):** `npm run lint` reports `react-hooks/set-state-in-effect` errors in a few components, and 4 of the expanded E2E specs assert seeded-demo UI that has drifted from the current dashboard. Both also fail on `main` CI, so treat them as pre-existing unless your change is meant to fix them.
