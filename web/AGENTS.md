<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Seed guard and credentials

Demo/seed scripts must call the guard in `scripts/lib/assert-non-prod.mjs` (requires `ALLOW_DEMO_SEED=1`; refuses production env and `PROD_DB_HOSTS` hosts). Never hardcode logins: e2e and verify scripts read `E2E_STAFF_*` / `E2E_MEMBER_*` from env.
