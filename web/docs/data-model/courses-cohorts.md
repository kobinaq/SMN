# Courses, cohorts and One-on-One

Phase 1B. The change is additive.

## Courses evolved in place

The `courses` collection keeps its slug, and every existing field and column stays. It had 0 rows on dev and prod, so nothing moves. Old fields (`programKey`, `selarUrl`, `delivery`, `classroomUrl` and the rest) are removed in phase 6. `lms-courses` data is not moved.

Added to `courses`: `whoItsFor` (array, table `courses_who_its_for`) and `certificateEnabled` (default true).

Reused with a new meaning:

- `amount` is the course default price in pesewas (GH₵1 = 100). A cohort can override it. There is no second price field.
- `lmsCourse` links to the LMS course that holds the modules and lessons.
- `status`: `published` means public. `coming-soon` is not listed by the public API.

Access is staff-only for read, create, update and delete. The public reads courses only through `GET /api/programs` (see `docs/api/programs.md`).

## Cohorts

New `cohorts` collection. One course has many cohorts. Status runs `draft`, `open`, `full`, `running`, `finished`. `price` is an optional override in pesewas. All access is staff-only.

## One-on-One

New global `one-on-one`. Duration, days per week and session count are editable defaults (2 weeks, 4 days, 8 sessions) while the format is confirmed. Staff-only.

## Migration

`src/migrations/20261120_140000_courses_cohorts_one_on_one.ts` is hand-written, additive and idempotent. It creates `courses_who_its_for`, `cohorts`, `one_on_one`, `one_on_one_included`, `one_on_one_resources`, `one_on_one_rels`, the `enum_cohorts_status` type, their indexes and foreign keys, and adds `courses.certificate_enabled`. It touches `payload_locked_documents_rels` only if that table exists (it does not on dev or prod). `down` is a no-op.

## Seed

`npm run seed:courses` upserts the Social Media Marketing course, its outcomes and its who-it's-for rows. Copy matches `socialMediaProgram` in `src/lib/pages/programs.ts`. It sets no price and creates no cohort.

It is guarded twice:

1. `decideSeedTarget` accepts a `DATABASE_URL` only when its host is the dev endpoint `ep-wispy-rice-abpfeozn` (direct or pooler). Missing, unparseable, production and any other host are refused with exit code 1.
2. The SQL raises an exception unless the server reports `neon.endpoint_id` equal to that endpoint.

The script logs the endpoint id and the course id, never the URL. `node scripts/seed-courses.mjs --print-sql` prints the SQL and does not connect.

The statement uses fixed row ids (for example `seed-smm-outcome-01`), so a second run updates rows instead of adding them. It removes nothing.
