# Deployment

## Vercel

- Set the Vercel root directory to `web`.
- Use Node 24 to match the current project environment.
- Configure the production environment variables in `docs/environment-variables.md`.
- Ensure `NEXT_PUBLIC_SITE_URL` is the deployed origin with no trailing slash.

## Database

Production requires a durable Postgres database.

Schema changes are not pushed automatically during normal app startup. After collection changes:

```bash
cd web
npm run db:push
```

This runs Payload with `PAYLOAD_DB_PUSH=true` through the project script.

## Media

Cloudflare R2 is used through Payload's S3 storage adapter. Videos are not stored in R2; LMS lessons embed unlisted YouTube URLs. PDFs, images, certificates, templates, and other files go through Media/R2.

## Build Checks

Before deploying:

```bash
cd web
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Run `npm run test:e2e` locally after installing Playwright browsers.

## Backup and recovery

- Neon (or equivalent) continuous backups are the primary recovery path for Postgres.
- Before adopting migrations in production, take a manual snapshot / point-in-time note.
- Media in Cloudflare R2 should have versioning or a separate backup bucket if certificates and portfolio assets are production-critical.
- Rollback: redeploy the previous Vercel deployment; restore DB only if a migration is irreversible — document the owner before running `db:push` against production.
- Emergency Payload UI: set `STAFF_LEGACY_ADMIN=true` only temporarily; custom `/staff` remains canonical.

## Post-Deploy Smoke Test

See also `docs/production-checklist.md`.

- `/` loads public site.
- `/admin` redirects to `/staff` (or `/staff/login` for `/admin/login`).
- Staff login at `/staff/login` works and shows Overview.
- `/login` member login works.
- `/app` requires member auth and shows continuity actions (not placeholder “coming soon” copy).
- Member profile save works with confirmation.
- Media upload works from `/staff/content/media`.
- `/app/learning/courses` Resume/Start deep-links to a lesson for enrolled members.
- Course Builder Settings can edit and save course metadata.
- `/verify/<code>` verifies a public valid certificate.
- With AI flags off, non-AI pages still load if Groq is unavailable.
