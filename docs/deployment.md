# Deployment Runbook

**Updated:** 2026-07-21

## Vercel

- Project root: web
- Runtime: Node 24
- Build command: npm run build
- Output directory: Next.js default
- NEXT_PUBLIC_SITE_URL must be the deployed origin without a trailing slash.
- Configure production variables from [environment-variables.md](environment-variables.md).

## Pre-deploy gates

From web/, run:

1. npm run generate:types
2. npm run typecheck
3. npm run lint
4. npm run test:unit
5. npm run build
6. npm run test:e2e for auth, staff, member, payment, or schema-affecting work

As of 2026-07-21, the current branch is not release-green because lint has five errors in newer staff components. See [../IMPLEMENTATION_PLAN.md](../IMPLEMENTATION_PLAN.md).

## Database

Production requires PostgreSQL. Application startup never pushes schema automatically.

Normal deployment applies reviewed forward migrations with npm run db:migrate. Current committed migrations are the baseline, marketing CMS fields, and 20260717_events_paystack. The repository does not confirm that the events/Paystack migration has been applied to production.

Before a production migration:

1. Inspect payload-migrations and compare it with web/src/migrations/index.ts.
2. Take a named recovery point.
3. Identify the migration and rollback owner.
4. Disable affected feature exposure.
5. Apply only pending forward migrations.
6. Verify schema reads and affected workflows.

Follow [database-migrations.md](database-migrations.md). Do not run db:push as the normal deploy path.

## Media

Production uploads use Payload Media and Cloudflare R2 when the full R2 configuration is present. LMS videos remain unlisted YouTube embeds. Confirm upload, public delivery, replacement, and deletion behavior after storage configuration changes.

## Events and Paystack

Before exposing paid CTAs:

- Configure the Paystack secret/public keys and webhook secret.
- Register the production webhook endpoint.
- Confirm the events/Paystack migration is applied.
- Run a test transaction and verify signature handling, amount/currency, duplicate callbacks, fulfillment, member ticket/access, staff registration visibility, email behavior, cancellation, and check-in.
- Name the settlement and refund owner.

Free registration must also be tested because it bypasses Paystack while still creating registration/access records.

## Backup and rollback

- Neon or equivalent point-in-time recovery is the database recovery path.
- R2 should use versioning or a backup bucket where member assets and certificates are critical.
- Application rollback is a previous Vercel deployment.
- Database rollback should normally be a reviewed forward repair migration. Restore only when the incident owner determines it is safer than forward recovery.
- STAFF_LEGACY_ADMIN=true is a temporary UI recovery switch, not a database rollback.

## Post-deploy smoke

Use [production-checklist.md](production-checklist.md). At minimum verify:

- public home, courses, events, and legal pages;
- staff login, Today, media, Course Builder, people, and events;
- member login, dashboard, profile, learning resume, event registration/tickets, and logout;
- certificate public verification;
- free and paid fulfillment where enabled;
- non-AI routes with all AI flags disabled.
