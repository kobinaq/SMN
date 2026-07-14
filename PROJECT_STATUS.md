# SMN Project Status

**Updated:** 2026-07-13

## Current product

SMN includes a public marketing/content website, Payload staff CMS, authenticated member portal, mentorship, opportunities, learning and LMS delivery, portfolios, credentials, workflow-first administration, and feature-flagged AI-assisted learning/career tools.

### Public and member product

- Marketing pages, CMS fallback content, forms, events, resources, insights, stories, cohort/course pages, mentorship, employers, legal pages, and WhatsApp community integration.
- Separate staff and member auth collections/cookies.
- Member profile with visibility, skills, career interests, and goals.
- Mentor applications, approved directory, mentorship requests, capacity, relationships, feedback, and notifications.
- Manual/imported opportunities, Greenhouse/Lever/Ashby sync, moderation, search/filter, external application handoff, and member activity.
- Enrollments, learning items, Classroom/Selar links, LMS courses/modules/lessons, unlisted YouTube player, Media/R2 attachments, progress, completion, and course access.
- Portfolio case studies and public `/u/[handle]` profiles.
- Member credentials and public `/verify/[code]` verification.

### Staff product

- Canonical staff app at `/staff` (portal design language). `/admin` redirects unless `STAFF_LEGACY_ADMIN=true`.
- Workflow-first Overview with action queues, health, metrics, quick actions, and recent meaningful changes.
- Course Builder with readiness, curriculum operations, progress automation/correction, analytics, Tutor controls/reporting, and Content Studio.
- Member 360, Mentorship Operations, Opportunity Operations, and Certificate Issuing.
- Content CMS: posts, resources, media library.
- Website CMS: programme catalogue, events, stories, site settings.
- System: staff users, AI usage/feedback (read-only), audit log.
- Grouped navigation and server-enforced super-admin/content/learning/mentorship/opportunity/support/analyst roles.
- Audit events for consequential staff actions.

### AI product

- Provider-independent runtime with an isolated Groq adapter and deterministic mock provider.
- Auth, role checks, input/schema validation, injection screening, prohibited-action policy, quotas, timeouts, opaque actors, privacy-minimized usage, retention, feedback, and deletion.
- Approved course retrieval with entitlement, course isolation, lexical ranking, citations, and unsupported-answer decline.
- Course Tutor with nine modes, sources, feedback, reset, per-course controls, aggregate reporting, privacy, and responsive UI.
- Content Studio with text and strict structured drafts, requested controls, candidate review, provenance, versions, and explicit saves.
- Career Coach with deterministic opportunity ranking, explanations, gaps/learning, conversation, confirmed goals/plans, feedback, reset, and data management.

All AI surfaces remain independently feature-flagged. Production enablement follows the release gates in `PRODUCT-ROADMAP.md`.

## Production state

- Production URL: `https://socialmarketersnetwork.vercel.app`.
- Vercel root directory: `web`.
- Production Postgres: Neon via `DATABASE_URL`.
- The July 13 admin RSC failure was traced to schema drift. The authorized schema push repaired the pre-AI admin schema, required reads passed, and `/admin` returned HTTP 200.
- The final AI collections/latest member-LMS fields were implemented after that repair and still require the guarded production schema/adoption procedure.
- AI flags must remain false through that procedure.

## Migration state

- Full PostgreSQL baseline generated under `web/src/migrations`.
- Bundled Node 24 scripts exist for type generation, migration creation, migration application, and guarded baseline adoption.
- Fresh databases use `npm run db:migrate`.
- Existing production follows `docs/database-migrations.md`.
- Disposable PostgreSQL proof and production baseline adoption are open verification gates.

## Verification state

Completed:

- Payload types regenerated to `web/src/payload-types.ts`.
- Payload admin import map regenerated.
- PostgreSQL baseline generation completed without connecting to the database.
- `npm run typecheck` — clean.
- `npm run lint` — clean (generated migration warnings ignored).
- `npm run test:unit` — 25 passed, 1 skipped.
- `npm run build` — production build succeeded.
- `npm run test:e2e` — 7/7 Playwright workflows passed (seeded SQLite, mock AI, disposable DB).
- Injection-policy pattern broadened to catch “ignore all previous system instructions”.
- E2E CSRF fixed via runtime `SITE_URL` / Playwright origin allowlisting; demo course seeds `tutorEnabled`.

Active / remaining:

1. Disposable PostgreSQL migration proof.
2. Existing-production final schema push, full reads, guarded baseline adoption, and no-pending-migration confirmation.
3. R122 final 16-part readiness report.

## External configuration and content gates

- Verified Resend sender/domain and Payload email adapter.
- Mailchimp production audience credentials.
- R2 production upload/CDN verification.
- Google Analytics configuration.
- Final Selar, Google Classroom, event registration, WhatsApp, cohort/pricing, legal, employer, course, mentor, and certificate content supplied by stakeholders.
- Production opportunity cron verification.

## Security and privacy controls in place

- Staff/member cookie separation and member-cookie API bridge.
- Server-side staff roles and member ownership checks.
- Allowlisted member profile update.
- Public portfolio/credential visibility restrictions.
- Production environment validation.
- AI data minimization, opaque actor identifiers, bounded retention, explicit persistence confirmation, deletion, and high-impact action blocks.

## Release assessment

| Release | Current state |
|---|---|
| Internal engineering | Implementation complete through R121; static/unit/build/E2E gates passed |
| Existing public/member product | Implemented; production schema adoption and env checks pending |
| Workflow admin extension | Implemented; local E2E passed |
| AI internal testing | Implemented behind flags; local safety/static/build/E2E passed |
| AI private beta | Awaits production schema adoption, accessibility/privacy/operations review |
| R122 readiness decision | Pending migration proof + production adoption evidence |

See `HANDOFF-CODEX.md` for the exact incoming-agent continuation.
