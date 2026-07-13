# Database Migration Runbook

## Policy

Committed Payload migrations are the deployment path. Normal app startup keeps schema push disabled. `npm run db:push` is an explicit administrative bridge for an existing database that predates the migration baseline; it is not the normal deploy command.

The stock `payload migrate:*` loader fails on Node 24 in this repository because an ESM graph with top-level await is loaded through `require()`. The `db:migrate:*` scripts bundle `payload.config.ts` with esbuild and call the same installed Payload migration API from ESM.

## Fresh database

From `web` with PostgreSQL `DATABASE_URL` and `PAYLOAD_SECRET` configured:

```bash
npm run db:migrate
```

This applies pending files from `src/migrations` transactionally and records them in `payload-migrations`. Do not use `db:push` first on a fresh production database.

## Existing production database adoption

Production was explicitly schema-pushed before the first baseline existed. Never run the full baseline migration over those existing tables.

1. Back up the database and place writes in a controlled maintenance window.
2. Deploy application code with all AI feature flags still false.
3. Run `npm run db:push` once against the intended database to bring it to the exact final Payload schema.
4. Run `npm run db:check` and the application schema/read checks.
5. Set `ALLOW_MIGRATION_BASELINE=true` only for the adoption command, then run `npm run db:migrate:adopt`.
6. Run `npm run db:migrate`; it must report no pending baseline work.
7. Remove `ALLOW_MIGRATION_BASELINE` and keep `PAYLOAD_DB_PUSH` unset.

The adoption script refuses to proceed unless there is exactly one baseline file and full reads succeed for the core admin, LMS, certificate, and all AI collections. It then records that exact filename without executing its `up` SQL. It is idempotent.

## Future schema change

1. Change the Payload config.
2. Run `npm run db:migrate:create -- concise_change_name` using PostgreSQL configuration.
3. Review both generated SQL and snapshot; pay special attention to drops, nullability, unique constraints, and data backfills.
4. Verify on a disposable database with `npm run db:migrate`, unit tests, build, and E2E.
5. Back up production, deploy with affected features disabled, run `npm run db:migrate`, verify, then enable features.

Never edit or delete a migration already applied to a shared environment. Add a forward migration instead. Never use `migrate:reset`, destructive SQL, or automatic push in production.
