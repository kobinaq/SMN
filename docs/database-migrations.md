# Database Migration Runbook

**Updated:** 2026-07-21

## Policy

Committed Payload migrations are the production schema path. Normal application startup and deployment do not push schema automatically. Use db:push only for a deliberately guarded pre-baseline adoption or disposable local database, never as routine production deployment.

Project scripts bundle payload.config.ts because the stock Payload loader is incompatible with this repository’s Node 24 ESM graph.

## Committed migrations

1. 20260713_140429_smn_baseline_20260713
2. 20260714_marketing_cms_fields
3. 20260717_events_paystack

Repository evidence records the baseline as adopted on the existing production database and the marketing migration as applied. Production application of 20260717_events_paystack is unconfirmed; inspect the database before acting.

## Fresh PostgreSQL database

With DATABASE_URL and PAYLOAD_SECRET configured, run npm run db:migrate from web/. This should apply all committed migrations transactionally and record them in payload-migrations.

Prove the migration chain on disposable PostgreSQL before production. Verify core collection reads plus events, registrations, payments, courses, and enrollments.

## Existing production

1. Read payload-migrations and compare names/order with src/migrations/index.ts.
2. Confirm the baseline and marketing migration records already documented.
3. Do not replay the baseline over existing tables.
4. Take a recovery point and stop or gate writes to affected features.
5. Run npm run db:migrate to apply only genuinely pending forward migrations.
6. Verify the affected schema and application flows.
7. Record the migration result, timestamp, operator, and rollback/recovery point in the deployment evidence.

If production bookkeeping differs from the repository’s documented state, stop and reconcile the schema before applying anything.

## Pre-baseline adoption

The guarded adoption command exists only for another existing database that already has the full baseline schema but no baseline migration record. Follow the script’s checks, temporarily set ALLOW_MIGRATION_BASELINE=true, run npm run db:migrate:adopt, then remove the variable. Never use this to skip an unapplied migration.

## Creating a schema change

1. Change the Payload collection/global configuration.
2. Run npm run db:migrate:create -- concise_change_name with PostgreSQL configuration.
3. Review generated SQL and snapshot for drops, nullability, constraints, indexes, and data backfills.
4. Add a forward data migration where existing records need transformation.
5. Verify from an empty disposable PostgreSQL database and from the previous schema state.
6. Run typecheck, lint, unit, build, and relevant E2E.
7. Back up production, deploy with affected features gated, run npm run db:migrate, verify, then expose the feature.

Never edit or delete a migration already applied to a shared environment. Never use migrate:reset, destructive ad-hoc SQL, or automatic schema push in production.
