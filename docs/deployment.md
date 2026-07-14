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

## Post-Deploy Smoke Test

- `/` loads public site.
- `/admin` redirects to `/staff` (or `/staff/login` for `/admin/login`).
- Staff login at `/staff/login` works and shows Overview.
- `/login` member login works.
- `/app` requires member auth.
- Member profile save works.
- Media upload works from `/staff/content/media`.
- `/app/learning/courses` loads for an enrolled member.
- `/verify/<code>` verifies a public valid certificate.
