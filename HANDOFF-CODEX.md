# SMN Engineering Handoff

**Updated:** 2026-07-13  
**Repository:** `github.com/kobinaq/SMN`, branch `main`  
**Application root:** `web/`  
**Production:** `https://socialmarketersnetwork.vercel.app`

This is the current transfer brief. Use it with `IMPLEMENTATION_PLAN.md`, `PRODUCT-ROADMAP.md`, `PROJECT_STATUS.md`, and the documents under `docs/`. Older phase assumptions have been removed because the product now includes a real LMS foundation, workflow-first administration, and three AI-assisted product surfaces.

## 1. Product and architecture now

SMN is a public marketing-community website plus an authenticated network product. Payload is the system of record, API, authorization layer, staff CMS, and member-auth provider. Staff use `users` at `/admin`; members use `members` at `/login`, `/signup`, and `/app`. Browser cookies are separated through the `smn-admin` prefix and the `smn-member-token` bridge.

The implemented product includes:

- Public marketing/content pages and CMS-managed content.
- Member profiles, mentor applications/directory/requests, opportunities and application activity, learning/enrollments, portfolios, and public credentials.
- LMS courses, modules, lessons, unlisted YouTube playback, Media/R2 attachments, member entitlement, lesson progress, course completion automation, readiness, analytics, and certificate eligibility.
- Workflow-first admin Overview, Course Builder, Member 360, Mentorship Operations, Opportunity Operations, and Certificate Issuing.
- Minimal staff roles: super-admin, content, learning, mentorship, opportunity, support, and analyst, enforced on server collection access and custom routes.
- Provider-independent AI foundation, course-aware Tutor, instructor Content Studio, and member Career Coach, all independently feature-flagged.

## 2. Production incident resolved during this work

The reported production admin RSC failure was caused by database schema drift, not the browser-extension `content.js`/`polyfill.js` messages. Production had 37 older tables and lacked new admin schema such as `member_notes`, `mentorship_relationships`, and staff role fields.

With user authorization, `npm run db:push` was run against the configured Neon database. Verification then showed 41 tables, required columns present, successful admin Local API reads, and HTTP 200 for the production `/admin` login surface. This repaired the pre-AI admin schema.

The final AI collections and the latest member/LMS fields were added afterward and have **not** yet been pushed to or adopted by production. Keep every AI feature flag false until the final schema procedure and verification are complete.

## 3. Work completed in the current uncommitted change set

### Workflow administration

- Course Builder tabs, metadata/readiness, curriculum actions, compensating writes, progress automation/overrides, analytics, Tutor settings, and Content Studio.
- Member 360 with private authored staff notes.
- Mentorship review, capacity, request transitions, relationships, feedback, audit, and notifications.
- Opportunity moderation, duplicate/expiry queues, applications, source health, and audited transitions.
- Certificate eligibility, bulk issuance, duplicate prevention, issuer/source relationships, notifications, reissue/revoke, audit, and compensation.
- Workflow navigation groups and server-enforced staff permission matrix.
- Disposable Playwright workflow scenarios were added for these operations.

### AI foundation and surfaces

- Provider-independent text, structured output, streaming, usage, timeout, and error contracts under `web/src/lib/ai`.
- Fetch-based Groq adapter isolated from feature code; mock provider supports text and structured test responses.
- Current model aliases documented from official Groq documentation in `docs/ai-architecture.md`.
- Validation, prompt-injection screening, prohibited-action policy, explicit save confirmation, per-actor hourly limits, opaque actor hashes, prompt hashes, timeouts, privacy-minimized usage records, feedback, retention expiry, and deletion.
- Approved course retrieval with entitlement, one-course isolation, lexical ranking, source delimiters, citations, unsafe-source filtering, and unsupported-answer decline.
- Tutor API/UI with nine modes, course controls, citations, feedback, reset, privacy copy, and aggregate reporting.
- Content Studio API/UI with separate strict quiz/rubric/outline schemas, all requested controls, generation/regeneration/comparison/selection/rejection/edit/save, provenance, and versioned drafts.
- Career Coach deterministic opportunity matching, evidence/gaps/learning, authenticated minimized context, explanations/conversation, confirmed goal/plan saves, feedback, reset, and retained-data deletion.
- Member profile editing now includes skills, career interests, and career goals.
- Privacy-conscious success metric definitions and events.

### Schema, scripts, tests, and documentation

- AI collections: `ai-usage-records`, `ai-feedback`, `ai-knowledge-sources`, `ai-drafts`, and `ai-career-states`.
- Full PostgreSQL baseline generated at `web/src/migrations/20260713_140429_smn_baseline_20260713.ts` with its snapshot and index.
- Node 24 workarounds added for migration creation/application and Payload type generation by bundling `payload.config.ts` before calling the installed ESM APIs.
- Guarded existing-database adoption script added; see `docs/database-migrations.md`.
- Generated Payload types and admin import map were refreshed.
- Mocked AI/safety tests, staff permission tests, optional flag-gated Groq integration test, and workflow/AI E2E tests were added.
- Staff guide, migration runbook, AI/admin architecture, metric definitions, environment reference, testing guide, roadmap, and status docs were updated.

## 4. Exact verification checkpoint

The user originally asked to defer tests until implementation was complete. Verification then began.

Completed:

- `npm run db:migrate:create -- smn_baseline_20260713` through the bundled workaround: passed and generated the baseline without connecting to the DB.
- `npm run generate:types` through the bundled workaround: passed; canonical output is `web/src/payload-types.ts`.
- `npm run generate:importmap`: passed.
- First unit run: existing 14 tests passed and the new AI suite failed to parse because `retrieval.ts` had an unterminated replacement string. That syntax defect was fixed.

Current static-check state:

- The first generated-type `npm run typecheck` reported 31 errors.
- Errors were primarily numeric Postgres relationship IDs still modeled as `string | number`, Payload draft-overload ambiguity for dynamic duplicated records, Career Coach union narrowing, Tutor enablement placed on the wrong LMS view type, a removed `discordInvite` field reference, and the admin wrapper returning a possible `Where` for `access.admin`.
- Fix batches were started. The portal batch completed. The admin-route batch was interrupted while `apply_patch` was still running; inspect its exact filesystem result before continuing.
- Lint output from the parallel gate was not preserved because the combined process rejected when unit tests failed.
- Full unit rerun, lint, build, Playwright E2E, disposable PostgreSQL migration verification, and production final-schema adoption remain outstanding.

## 5. Incoming agent: first actions

Do not restart implementation. Continue the verification/fix loop:

1. Run `git status --short` and inspect these partially patched files first:
   - `web/src/app/(payload)/api/admin/certificate-operations/route.ts`
   - `web/src/app/(payload)/api/admin/course-builder/route.ts`
   - `web/src/app/(payload)/api/admin/progress-overrides/route.ts`
   - `web/src/app/(payload)/api/admin/mentorship-operations/route.ts`
2. Run `cd web && npm run typecheck` and fix the remaining generated-type errors.
3. Run `npm run lint` and `npm run test:unit`; fix every failure.
4. Regenerate types/import map if config changes.
5. Run `npm run build`.
6. Run `npm run test:e2e`. The runner creates and removes a per-process SQLite database, forces one Playwright worker, seeds fictional records, and uses `AI_PROVIDER=mock` with all AI test flags enabled.
7. Verify the committed migration on a disposable PostgreSQL database. Review the full baseline SQL before any shared-environment action.
8. Only after all gates pass, follow `docs/database-migrations.md` for existing production: backup/maintenance window, final `db:push`, full schema reads, guarded `db:migrate:adopt`, then `db:migrate` must show no pending baseline.
9. Keep production AI flags false until private-beta approval.
10. Update `IMPLEMENTATION_PLAN.md` final gates and write R122’s 16-part delivery/readiness report with actual evidence.

## 6. Likely remaining type fixes from the first report

Recheck rather than applying blindly:

- `certificate-operations`: relationship helper must return numeric IDs; certificate inputs should coerce numeric IDs.
- `course-builder`: narrow dynamic collection unions and cast only spread-generated create data where Payload cannot infer required fields.
- `progress-overrides`: numeric IDs remove update/create overload ambiguity.
- `mentorship-operations`: numeric mentor/requester IDs.
- `learning-progress`, `lms-progress`, `mentor-requests`, `portfolios`, and opportunity sync: numeric relationship IDs.
- `mentor-applications`: dynamic draft create overload.
- `lms.ts`: `tutorEnabled` belongs on `LmsCourseCard`, not `LmsLessonListItem`.
- `admin-permission-config.ts`: `access.admin` must always resolve to boolean.

## 7. Database workflow

Fresh PostgreSQL database:

```bash
cd web
npm run db:migrate
```

Future schema change:

```bash
npm run db:migrate:create -- concise_change_name
```

Existing production must use the guarded baseline adoption runbook. The stock `payload migrate:*` and `payload generate:types` loaders fail on Node 24 with `ERR_REQUIRE_ASYNC_MODULE`; use the project npm scripts.

## 8. Important files

| File | Purpose |
|---|---|
| `IMPLEMENTATION_PLAN.md` | Requirement-level status and verification gates |
| `PRODUCT-ROADMAP.md` | Current product phases and release state |
| `PROJECT_STATUS.md` | Current operational status |
| `docs/admin-architecture.md` | Workflow admin structure and role matrix |
| `docs/ai-architecture.md` | AI boundaries, models, retrieval, retention, surfaces |
| `docs/database-migrations.md` | Fresh DB and existing-production adoption runbook |
| `docs/staff-guide.md` | Everyday workflow and AI incident guide |
| `docs/success-metrics.md` | Admin and AI metric definitions |
| `docs/testing.md` | Test layers and commands |
| `web/src/payload.config.ts` | Collections, views, DB, admin, plugins |
| `web/src/lib/ai/` | Provider/runtime/retrieval/schema/career foundation |
| `web/src/migrations/` | PostgreSQL migration baseline |
| `web/scripts/seed-demo.mjs` | Current fictional seed for workflow and AI E2E |

## 9. Stable operational facts

- Vercel project root is `web`.
- Normal app startup does not push schema.
- Media uses Cloudflare R2 when the complete `R2_*` configuration is present.
- LMS videos use unlisted YouTube embeds; other lesson files use Media/R2.
- Course access is based on existing member/enrollment rules and `programKey` grants.
- WhatsApp, Selar, Google Classroom, Resend, Mailchimp, R2, and employer ATS links remain external integrations configured through CMS/environment values.
- AI configuration is server-only. Normal CI never calls Groq.
- Extension console errors such as `content.js useCache` and `polyfill receiving end` are not application errors; inspect the server/RSC digest and database logs.

## 10. Release state at handoff

- Existing public MVP/product features: implemented; production integration/content checks remain environment-specific.
- Workflow admin extension: implemented, verification incomplete.
- LMS operational extension: implemented, verification incomplete after the latest admin/AI changes.
- AI foundation/Tutor/Content Studio/Career Coach: implemented behind flags, verification incomplete, not approved for beta.
- Migration baseline: generated, not yet proven on disposable PostgreSQL or adopted by production.
- R122 final readiness report: pending verified evidence.
