# SMN Master Implementation Plan

**Source of truth:** `HANDOFF-CODEX.md` (re-read before every major phase)  
**Supporting context:** `PRODUCT-ROADMAP.md`, `ARCHITECTURE.md`, `web/README.md`, and repository code  
**Audit date:** 2026-07-12  
**Application root:** `web/` (Next.js 16 App Router + Payload 3)

## Checklist rules

- `[x]` means implementation, proportional verification, and documentation are complete in the repository.
- `[ ]` means incomplete, unverified, externally blocked, optional but undecided, or documentation/tests are incomplete.
- `[~]` means code exists but the complete acceptance gate has not been proved. This is deliberately not “complete.”
- Existing working-tree changes are user-owned and must be preserved. At audit time, seven portal API/auth files and `payload.config.ts` were modified, and `web/src/middleware.ts` was deleted.
- Before each phase: re-read `HANDOFF-CODEX.md`, inspect the working tree, consult relevant Next.js 16 docs under `web/node_modules/next/dist/docs/`, and update this document after the phase gate.

## Repository audit

### Current architecture

| Area | Current implementation | Primary files |
|---|---|---|
| Public site | Next.js route group with seed fallbacks | `web/src/app/(site)`, `web/src/lib/content.ts`, `web/src/lib/cms.ts` |
| Member auth/portal | Payload `members`, auth pages, protected `/app` | `web/src/collections/Members.ts`, `web/src/lib/auth/member.ts`, `web/src/app/(auth)`, `web/src/app/(portal)` |
| Staff CMS | Payload `users`, custom admin | `web/src/collections/Users.ts`, `web/src/app/(payload)`, `web/src/payload.config.ts` |
| Data | SQLite locally; Neon Postgres when `DATABASE_URL` exists | `web/src/lib/db.ts`, `web/scripts/push-schema.mjs` |
| Media | Payload Media; R2 when complete R2 env exists | `web/src/collections/Media.ts`, `web/src/lib/storage.ts`, `web/src/payload.config.ts` |
| Email/forms | Resend and Mailchimp with development fallbacks | `web/src/app/(site)/api/forms`, portal request routes |
| Product features | Mentors, opportunities, learning, portfolios, certificates, LMS foundation | corresponding collections, `web/src/lib/*`, `/app/*` routes |

### Baseline verification surface

There is no unit, integration, or browser-test framework configured. Existing executable gates are:

1. `npm run lint`
2. `npx tsc --noEmit`
3. `npm run build` (also regenerates the Payload import map)
4. `npm run db:push` and `npm run db:check` against an explicitly selected database
5. Manual local and production smoke tests for auth, admin, forms, uploads, and external integrations

Automated tests must be added for security-sensitive pure logic and APIs when practical; until then, affected items remain uncompleted if their required smoke test cannot be run.

## Requirement traceability checklist

### A. Delivery process requirements

- [x] **R001 — Audit the current repository before product changes.** Evidence: architecture, route, collection, history, dirty-tree, scripts, and documentation inventory above. Files: entire repo. Test: audit recorded here.
- [x] **R002 — Create `IMPLEMENTATION_PLAN.md`.** File: this document. Test: file exists and is readable.
- [x] **R003 — Convert every master-spec requirement into a numbered checklist.** File: this document, R001–R082.
- [x] **R004 — Map requirements to files, collections, routes, and tests.** Files: traceability entries and phase matrix below.
- [x] **R005 — Identify dependencies, risks, and migrations.** Files: dependency/risk/migration sections below.
- [ ] **R006 — Execute all work in the specified dependency order.** Gate: all non-optional requirements complete or explicitly superseded by stakeholder decision.
- [ ] **R007 — Update this checklist after every phase.** Ongoing process gate.
- [ ] **R008 — Mark items complete only after implementation, tests, and docs.** Ongoing process gate.
- [ ] **R009 — Re-read the master specification before each major phase.** Ongoing process gate; record in phase log.
- [ ] **R010 — If scope remains, leave a working repo and document the exact next step.** Ongoing handoff gate.

### B. Locked product and technical decisions

- [x] **R011 — Use Payload `members` for member auth; do not introduce Clerk/Auth.js.** Collection: `members`. Files: `Members.ts`, member auth helper. Routes: `/login`, `/signup`, `/app/*`. Tests: lint/type/build plus auth smoke pending under R072.
- [x] **R012 — Restrict staff auth/admin to Payload `users`.** Collection: `users`. Files: `Users.ts`, Payload admin files. Route: `/admin`. Tests: access code review; production smoke pending R069–R071.
- [x] **R013 — Use Cloudflare R2 via Payload S3 adapter for media, not Vercel Blob.** Collection: `media`. Files: storage/config/env docs. Tests: build; real R2 upload pending R076.
- [x] **R014 — Host on Vercel with Root Directory `web`.** Files: root and web Vercel configs, README. External setting verification pending R068/R075.
- [x] **R015 — Use Neon Postgres in production.** Files: `db.ts`, schema scripts, env docs. Test: schema helpers; external verification pending R075.
- [x] **R016 — Keep schema changes opt-in via `npm run db:push`; never push on every request.** Files: `db.ts`, scripts, package.json, README. Test: config/code inspection.
- [x] **R017 — Keep community chat on WhatsApp as the current integrated community channel.** Files/routes: site content, `/community`. External real invite pending R063.
- [x] **R018 — Keep course sales on outbound Selar links.** Files: content/Courses/Learning/Enrollments. Routes: programs and `/app/learning`. Real URLs/entitlements pending R064/R049.
- [x] **R019 — Keep live cohort operations on Google Classroom.** Collections: `enrollments`, `learning-items`. Route: `/app/learning`. Tests: feature code; live link/content verification pending.
- [x] **R020 — Preserve dark-only visual brand and specified palette/matte image treatment.** Files: `globals.css`, UI/components. Routes: all. Tests: build plus visual smoke pending R073.
- [x] **R021 — Display pricing copy in GHS.** Files: seed/CMS marketing content. Routes: program/course surfaces. Tests: content search/manual review.
- [x] **R022 — Deliver the approved LMS foundation.** Current product includes courses, modules, lessons, video playback, attachments, progress, completion, readiness, analytics, Tutor controls, and Course Builder operations.
- [x] **R023 — Deliver the approved mentorship request/capacity/relationship model and unlisted-YouTube LMS video model.** Collections/routes: mentorship and LMS surfaces. Tests: code inspection and workflow suites.
- [x] **R024 — Use unlisted YouTube embeds for lesson video and Media/R2 for other lesson files.** Collections: `lms-lessons`, `media`. Routes: LMS lesson player. Tests: URL/embed logic plus build; functional smoke pending R074.

### C. Platform and portal foundation (7.0–7.1)

- [x] **R025 — Maintain dual auth collections and multi-root document layouts.** Collections: `users`, `members`. Files: route-group layouts and `SiteDocument`. Tests: build.
- [~] **R026 — Separate staff and member cookies safely.** WIP uses `cookiePrefix: "smn-admin"` and removes middleware. Files: `payload.config.ts`, `member.ts`, deleted `middleware.ts`, portal APIs. Routes: `/admin`, `/api/*`, `/app/*`. Tests required: member login/session/API calls, staff login, concurrent staff+member sessions, logout isolation, build. Migration: existing sessions are invalidated/re-login required.
- [ ] **R027 — Add member avatar upload through Media/R2.** Collections: `members`, `media`. Files: `Members.ts`, `ProfileForm.tsx`, profile/API handling. Route: `/app/profile`. Tests: authorization, size/type validation, upload/removal, R2 smoke. Dependency: R013/R076.
- [ ] **R028 — Configure Payload email adapter with Resend for forgot-password.** Files: `payload.config.ts`, env example, auth UI/docs. Route/API: `/forgot-password`, Payload auth endpoints. Tests: local adapter mock or safe sandbox plus production-domain smoke. Dependency: verified sending domain.
- [x] **R029 — Document `db:push` as current schema process while Node 24 migration CLI is broken.** Files: README/handoff. Test: docs/code consistency.
- [ ] **R030 — Resolve root versus `web/vercel.json` ambiguity and verify Vercel Root Directory.** Files: both Vercel configs, README. Tests: config review and production deployment settings.
- [~] **R031 — Provide robust portal empty states.** Real feature pages include operational empty states; final empty-data render and build verification remain. Files: `/app/page.tsx`, feature pages/components.
- [~] **R032 — Prove production member session and profile PATCH are solid.** Files: auth helper, ProfileForm, Payload REST. Routes: `/login`, `/app/profile`, `/api/members/:id`. Tests: production smoke; WIP auth change must be completed first.
- [ ] **R033 — Deliver password-reset emails when Resend/domain is ready.** Same files/routes as R028. Test: end-to-end token email and reset.

### D. Mentor directory (7.2)

- [x] **R034 — Add `mentors` and `mentorship-requests` collections.** Files: collection configs and payload registration. Migration: schema already reported pushed to Neon. Tests: build/schema evidence.
- [x] **R035 — Store mentor relation, topics, bio, availability, Cal.com URL, seniority, and approval status.** Collection: `mentors`. Tests: types/build and admin field review.
- [x] **R036 — Provide approved mentor directory and member filters.** Files: mentor data lib/directory component. Route: `/app/mentors`. Tests: lint/type/build; data-state smoke pending general R074.
- [x] **R037 — Provide mentor application and staff approval workflow.** Files: MentorApplication/API/collection. Routes: `/mentorship/become-a-mentor`, `/app/mentors`, `/admin`. Tests: access rules/build; full production smoke pending.
- [~] **R038 — Send mentorship requests and notify mentor plus ops via Resend.** Files: mentor request API/collection. Route: `/api/mentor-requests`. Current implementation has ops notification; verify mentor-recipient behavior, failure semantics, and production delivery.
- [x] **R039 — Replace/extend thin mentorship marketing introduction.** Routes: `/mentorship`, `/mentorship/become-a-mentor`. Tests: build/visual review.

### E. Opportunities board (7.3)

- [x] **R040 — Add opportunities, applications, and source/moderation data model.** Collections: `opportunities`, `opportunity-applications`, `opportunity-sources`. Tests: build/schema.
- [x] **R041 — Support staff/manual and moderated ATS-imported listings.** Files: opportunity sync library, cron API, admin collections. Route: `/api/cron/sync-opportunities`. Tests: importer logic/build; live source smoke pending.
- [x] **R042 — Provide member browse, search, filters, detail, apply handoff, and activity tracking.** Routes: `/app/opportunities`, `/app/opportunities/[slug]`, applications API. Tests: build; functional smoke pending.
- [~] **R043 — Notify relevant parties via Resend for opportunity workflows.** Inspect/define notification recipients and verify delivery; files: opportunity applications API and env/docs.

### F. Learning dashboard (7.4)

- [x] **R044 — Add enrollments, learning items, and progress collections.** Collections/files registered in Payload. Tests: build/schema.
- [x] **R045 — Show cohort status and Classroom/Selar links.** Route: `/app/learning`. Files: learning data/UI. Tests: build; entitled-member smoke pending.
- [~] **R046 — Support Selar entitlements by staff grant.** Collection: `enrollments`; documented manual grant exists. Tests: admin grant/member visibility smoke pending.
- [x] **R047 — Gate resource unlocks and weekly milestone checklists.** Collections: `learning-items`, `progress`, `enrollments`. API: `/api/learning-progress`. Tests: server-side entitlement code/build; authorization smoke pending.
- [x] **R048 — Keep learning-dashboard milestones and LMS lesson delivery as coordinated layers.** The LMS foundation owns YouTube playback, attachments, progress, readiness, analytics, and AI-assisted assessment drafting.
- [ ] **R049 — Add verified Selar webhook automation only if prioritized.** Files/routes/collection: new webhook route, enrollments, env docs. Dependency: Selar webhook contract and secret. Manual grant remains the current documented behavior.

### G. Portfolios (7.5)

- [x] **R050 — Add portfolio/case-study data model and member management UI.** Collection: `portfolios`; route/API: `/app/portfolio`, `/api/portfolios`. Tests: build; authorization/upload smoke pending.
- [x] **R051 — Add public `/u/[handle]` with private/members/public visibility behavior.** Collections: members/portfolios. Files: portfolios lib/public route. Tests: build; privacy matrix smoke pending.
- [~] **R052 — Store portfolio media via Media/R2.** Upload-or-URL implementation exists. Tests required: 10 MB/type/security constraints and R2 smoke.
- [ ] **R053 — Optionally feature approved portfolio work on marketing Stories.** Route: `/stories`. Requires explicit product decision before implementation.

### H. Certificates (7.6)

- [x] **R054 — Add staff-issued certificates, Media/R2 PDFs, member shelf, and public verification.** Collection: `certificates`; routes: `/app/certificates`, `/verify/[code]`; libs/docs included. Tests: build; issue/privacy/revocation/R2 smoke pending general verification.

### I. LMS foundation (approved replacement direction for old 7.7)

- [x] **R055 — Add courses, modules, lessons, and per-member lesson progress.** Collections: `lms-*`; registered in Payload. Tests: build/schema.
- [x] **R056 — Reuse enrollment `programKey` for LMS course access.** Files: LMS/learning libs and collections. Tests: access code/build; authorization smoke pending.
- [x] **R057 — Provide member course library, syllabus, lesson player, and completion tracking.** Routes: `/app/learning/courses/**`, API `/api/lms-progress`. Tests: build; functional smoke pending.
- [x] **R058 — Embed unlisted YouTube through `youtube-nocookie.com`; keep attachments in Media/R2.** Files: LMS lib/lesson page/collections. Tests: URL parsing/build; browser/R2 smoke pending.
- [~] **R059 — Track advanced assessments, discussion, credential automation, and commerce integration as measured product extensions.** Content Studio assessment drafting and certificate eligibility/issuing operations are implemented; release evidence will inform deeper automation.

### J. Product integrations and release gates

- [ ] **R060 — Build thin employer organization accounts and dashboard for own listings/applicants (7.8).** Depends on opportunities. Collections: likely `employer-orgs` plus account/member relation and ownership fields. Routes: employer auth/dashboard to design. Tests: tenancy/access matrix, CRUD, moderation, build. Migration required.
- [ ] **R061 — Add forum/announcement archive only if WhatsApp proves insufficient (7.9).** No implementation until product decision; empty forum explicitly avoided.
- [ ] **R062 — Evaluate deeper payment and delivery integrations from production evidence.** Current Selar, Classroom, enrollment, and LMS architecture provides the integration boundary.

### K. Launch content, quality, legal, analytics, and integrations

- [ ] **R063 — Replace WhatsApp placeholder with real invite.** Files: env/Vercel variable and community CTA. Route: `/community`. Test: live link.
- [ ] **R064 — Replace Selar and Lu.ma placeholders; confirm cohort dates and GHS prices.** Files: seed/CMS content. Routes: programs, events, cohort. Test: stakeholder content review and live links.
- [ ] **R065 — Obtain legal review and replace starter privacy/terms stubs.** Routes/files: `/privacy`, `/terms`. Test: stakeholder/legal approval.
- [ ] **R066 — Wire GA4 with consent/privacy-aware configuration.** Files: layout/analytics component/env/docs. Routes: all. Tests: production DebugView/network and legal alignment.
- [ ] **R067 — Uplift employers, mentorship, stories, programs hub, and courses catalogue to events/community quality.** Files: respective site pages/components/images. Tests: responsive/visual/accessibility review and build.
- [ ] **R068 — After domain purchase, update site URL, Resend domain/from address, and optional R2 public URL.** Files: env example/docs; external Vercel/R2/Resend configuration. Tests: admin CSRF/cookies, email, media URL, redirects.

### L. Production verification and release gates

- [ ] **R069 — Confirm green Vercel deploy with staff-only boolean admin access.** Files: `Users.ts`, config. External test: deployment status/logs.
- [ ] **R070 — In a private browser, `/admin` shows login/create-first-user rather than blank dashboard.** If broken, inspect console, network, HTML/RSC `user` and view before changing code.
- [ ] **R071 — Staff can log in and see authorized collections.** Test: production staff smoke with separate staff account.
- [ ] **R072 — Member can sign up/log in/use `/app`, save profile, and log out; member cannot open `/admin`.** Test: production member/auth isolation smoke.
- [ ] **R073 — Homepage and all unique image-map assets load in production.** Files: `images.ts`, Next image config. Test: browser/network smoke.
- [ ] **R074 — Smoke-test forms and implemented product flows (mentors, opportunities, learning, portfolios, certificates, LMS).** Tests: happy path, unauthenticated, wrong-owner, invalid input, empty state.
- [ ] **R075 — Verify `NEXT_PUBLIC_SITE_URL`, `PAYLOAD_SECRET`, Neon, cron, and required R2 variables in Vercel without exposing values.** External configuration check.
- [ ] **R076 — Prove Media upload/read/delete through R2 in production.** Collections: Media and all attachment relations. Test: small image/PDF lifecycle.
- [ ] **R077 — Confirm forms degrade safely when email/newsletter providers are absent and deliver when configured.** Routes: all form/request APIs. Tests: safe local fallback plus provider smoke.
- [ ] **R078 — Run and pass lint.** Command: `npm run lint`.
- [ ] **R079 — Run and pass TypeScript.** Command: `npx tsc --noEmit`.
- [ ] **R080 — Run and pass production build/import-map generation.** Command: `npm run build`.
- [ ] **R081 — Review final working-tree diff and preserve unrelated user changes.** Command: `git status --short`, `git diff --check`, targeted diff review.
- [ ] **R082 — Keep the repository working and record the exact next step whenever stopping.** See phase log/current next step.

## Dependency-ordered work plan

| Order | Phase | Requirements | Entry dependency | Completion gate |
|---:|---|---|---|---|
| 0 | Audit and baseline | R001–R010, R078–R081 | None | Plan exists; baseline results and dirty tree recorded |
| 1 | Auth/admin stabilization | R026, R030–R033, R069–R072, R075 | Production/env access for external gates | Cookie isolation implemented, lint/type/build pass, local + production auth matrix pass, docs updated |
| 2 | Platform media/email | R027–R029, R033, R068, R076–R077 | R2 and verified Resend domain | Avatar and reset flow pass end-to-end; schema/docs updated |
| 3 | Implemented-feature hardening | R034–R058, R074 | Stable auth/data | Access, validation, empty-state and integration tests/docs complete |
| 4 | Launch readiness | R063–R068, R073 | Stakeholder content/domain/legal inputs | Approved content/legal/analytics and production visual checks |
| 5 | Employer portal | R060 | Stable opportunities and explicit account model | Tenant-safe employer workflow, migration, tests, docs |
| 6 | Conditional roadmap | R049, R053, R059, R061–R062 | Explicit product approval/provider specs | Separately scoped acceptance criteria met |

## Required migrations and operational changes

1. **Auth cookie migration:** moving staff to `smn-admin-token` (via Payload `cookiePrefix`) invalidates existing staff sessions; members may also need to log in again depending on the final compatibility handling. No destructive data migration should be needed.
2. **Avatar/profile schema:** relation/upload field changes require `npm run db:push` against the intended database and a Media/R2 lifecycle check.
3. **Employer portal schema:** employer organizations/accounts, ownership, and listing relations require a reviewed schema push and tenant-access tests.
4. **Future feature schemas:** webhook idempotency records, forum, payments, or automated certificates require separate migrations only after approval.
5. **Payload types/import map:** after collection/config changes run `npm run generate:types` if applicable and `npm run build`/`generate:importmap`; review generated diffs.
6. **Production schema policy:** never enable automatic push during application requests. Back up/branch production data operationally before nontrivial schema changes.

## Risks and mitigations

| Risk | Impact | Mitigation/gate |
|---|---|---|
| Active auth WIP is incomplete | Security/session regressions | Preserve diff, inspect intent, test full member/staff concurrency matrix before marking R026 complete |
| Production settings are not repository-readable | Cannot prove admin/domain/R2/email | Keep external requirements unchecked and request targeted verification/access |
| No automated test framework | Regressions and weak access-control confidence | Add focused tests where feasible; require documented smoke matrix otherwise |
| Node 24 Payload migration CLI interop | Migration command failure | Continue opt-in `db:push`; document and reassess on dependency upgrade |
| Shared/changed cookies | Staff login overwrites member or stale tokens leak | Complete cookie-prefix migration and test both sessions simultaneously |
| R2 config differs by environment | Admin import-map/build or uploads fail | Keep config/import map environment-invariant; test with and without R2 env |
| External URLs/content are placeholders | Broken launch CTAs | Treat as stakeholder-blocked launch gates, never invent values |
| Legal/analytics consent mismatch | Compliance risk | Do not mark complete without legal/stakeholder review |
| Employer multi-tenancy | Cross-organization data exposure | Design ownership/access matrix first; automated negative tests required |
| Unprioritized product expansion | Delays and product fragmentation | Use measured R059/R061/R062 decision gates |
| Documentation contains stale phase numbering | Confusing roadmap | Update handoff, roadmap, and README together after each phase |

## Phase log

### 2026-07-12 — Phase 0 audit started

- Re-read master specification: yes.
- Completed: repository inventory, history, route/collection map, dirty-tree discovery, script/test inventory, initial traceability plan.
- Pre-existing WIP preserved: portal API auth changes, member auth helper, Payload cookie prefix, deleted middleware.
- Exact next step: inspect the complete auth WIP and relevant Next.js 16 proxy/auth/route-handler docs, run lint/type/build baseline, then either finish or safely correct the cookie-isolation migration before any new feature work.

### 2026-07-12 — Hardening baseline verified

- Re-read master specification: yes.
- Verified: 6/6 Vitest tests, TypeScript, ESLint, and Next.js production build pass.
- Build warning: Payload has no production email adapter; PostgreSQL dependency warns that future SSL-mode semantics will change.
- E2E smoke suite and production journeys remain unverified.

## Workflow Admin and AI Extension (new master specification)

The following requirements extend, rather than replace, R001–R082. Status cannot be complete until implementation, tests, and documentation all pass.

### Workflow-first administration

- [x] **R083 — Audit current admin, LMS, relationships, roadmap, and classify interface/workflow/model problems.** Evidence: `docs/admin-architecture.md`.
- [x] **R084 — Preserve Payload, separated collections, permissions, APIs, and default screens as advanced fallback.** Architecture constraint documented.
- [~] **R085 — Replace the default dashboard with attention queues, quick actions, platform overview, recent meaningful activity, and health signals.** Implemented in `AdminDashboard.tsx`, `payload.config.ts`, and admin styles; TypeScript and lint pass. Production build/admin smoke test still required.
- [~] **R086 — Build unified Course Builder tabs: Overview, Curriculum, Learners, Assessments, Analytics, Settings, AI Content Studio.** Implemented; final static/build/E2E gate pending.
- [~] **R087 — Add course metadata/readiness checklist and block incomplete publication server-side.** Implemented; final generated-type and negative-test gate pending.
- [~] **R088 — Add nested curriculum CRUD/reorder/move/duplicate/delete/preview with unsaved-change protection and transactional/compensating writes.** Implemented; workflow E2E execution pending.
- [~] **R089 — Automate enrollment, lesson completion, calculated course completion, inactivity, and certificate eligibility.** Implemented; final service/build/E2E gate pending.
- [~] **R090 — Add reasoned staff progress overrides with actor/time/before/after audit trail.** Implemented; final permission/audit E2E gate pending.
- [~] **R091 — Add course analytics for enrollment, progress, completion time, module drop-off, abandonment, and inactivity.** Implemented with tested pure analytics; final build/E2E gate pending.
- [~] **R092 — Build Member 360 with profile, learning, credentials, portfolio, mentorship, opportunities, activity, and private authored staff notes.** Implemented; role-sensitive E2E execution pending.
- [~] **R093 — Build Mentorship Operations and mentor detail workspace, approval/rejection confirmation, notes, explanations, audit, and notifications.** Implemented with relationship/capacity/feedback schema; final E2E pending.
- [~] **R094 — Build Opportunity Operations with moderation, duplicate detection, expiry, applications, source health, and import failures.** Implemented; final E2E pending.
- [~] **R095 — Build certificate issuing wizard with eligibility, bulk selection, duplicate prevention, unique codes, issuer, notifications, reissue/revoke, and transaction/compensation.** Implemented with migration schema; final type/permission/E2E gate pending.
- [~] **R096 — Improve standard screens and group navigation into Overview/Learning/Members/Mentorship/Opportunities/Credentials/Content/Website/System.** Implemented; final accessibility/responsive verification pending.
- [~] **R097 — Define and enforce a minimal staff permission matrix for super/content/learning/mentorship/opportunity/support/analyst responsibilities.** Implemented server-side; unit/static verification pending.
- [~] **R098 — Add all specified admin workflow E2E tests.** Test source and disposable seeded database implemented; Playwright execution pending.

### Provider-independent AI foundation and governance

- [~] **R099 — Create provider-independent AI interfaces for text, structured output, streaming, approved tools, usage, latency, timeout, and errors.** Implemented with Groq isolated to its adapter; final verification pending.
- [~] **R100 — Verify current production-supported Groq models from official docs, configure model IDs by environment, and document choices in `docs/ai-architecture.md`.** Implemented and documented; final release review pending.
- [~] **R101 — Enforce AI auth, authorization, validation, rate/usage limits, timeouts, logging, feedback, injection defenses, minimization, privacy messaging, and human approval.** Implemented; safety suite rerun pending.
- [~] **R102 — Add privacy-minimized AI usage records with configurable retention.** Implemented in schema/runtime; PostgreSQL proof and production adoption pending.
- [~] **R103 — Prevent AI from publishing, issuing credentials, grading, mentor decisions, applications, protected-data changes, or employment decisions.** Implemented server-side; safety suite rerun pending.
- [~] **R104 — Build provider-independent retrieval over approved course materials with course isolation and citations.** Implemented; retrieval test rerun pending.

### Course-aware AI Tutor

- [~] **R105 — Build grounded Tutor modes for explanation, simplification, examples, summaries, revision, Socratic guidance, answer feedback, comparison, and next-lesson review.** Implemented with unsupported-answer decline; verification pending.
- [~] **R106 — Retrieve/cite approved course/module/lesson/transcript/attachment/note/resource/FAQ context with strict course isolation.** Implemented; safety/retrieval rerun pending.
- [~] **R107 — Add contextual lesson/course Tutor UI with suggestions, provider streaming capability, sources, reset, feedback, errors, privacy, and mobile behavior.** Implemented with bounded atomic product responses; UI verification pending.
- [~] **R108 — Add Course Builder Tutor controls and aggregated, privacy-preserving feedback/FAQ reporting.** Implemented; build/E2E pending.

### Instructor AI Content Studio

- [~] **R109 — Integrate Content Studio inside Course Builder for course, lesson, example, assessment, rubric, revision, and FAQ drafts.** Implemented with learning-role checks; verification pending.
- [~] **R110 — Use separate server-validated structured-output flows for quiz, rubric, and lesson-outline schemas.** Implemented; mocked invalid-output rerun pending.
- [~] **R111 — Implement preview/edit/regenerate/compare/select/reject/save-draft workflow with provenance and versioning.** Implemented with the ordinary publication gate; E2E/permission execution pending.
- [~] **R112 — Add audience/level/context/tone/length/difficulty/example/outcome/assessment/marks/count controls and automatic course context.** Implemented; static/E2E verification pending.

### AI Career Coach

- [~] **R113 — Build member Career Coach connecting profile, skills, learning, certificates, portfolio, goals, mentorship, and opportunities.** Implemented in dedicated `/app/career-coach`; verification pending.
- [~] **R114 — Implement transparent hybrid opportunity matching before LLM explanation, including matches, gaps, and relevant learning.** Implemented with deterministic inspection and guidance language; verification pending.
- [~] **R115 — Add narrowly scoped authenticated tools for summaries, completions, certificates, public portfolios, opportunities, courses, and confirmed goal/plan saves.** Implemented with member-cookie auth and explicit confirmation; verification pending.
- [~] **R116 — Add goal summary, recommendations, gaps, learning, portfolio guidance, plans, conversation, saved items, reset, and data management UI.** Implemented; mobile/privacy E2E/manual checks pending.

### Roadmap, metrics, tests, and documentation

- [x] **R117 — Maintain `PRODUCT-ROADMAP.md` with the current LMS, workflow admin, AI phases, dependencies, criteria, privacy, metrics, and release gates.** Reconciled 2026-07-13.
- [~] **R118 — Instrument specified admin, Tutor, Content Studio, and Career Coach success metrics using privacy-conscious events.** Implemented and defined in `docs/success-metrics.md`; verification pending.
- [~] **R119 — Add mocked AI tests for generation/retrieval/schema/tools/recommendations/timeouts/rate limits/invalid output/safety plus optional flag-gated Groq integration tests.** Test sources implemented; rerun pending; normal CI excludes Groq.
- [~] **R120 — Test course isolation, citations, injection resistance, permissions, invalid tools, minimization, duplicates, rate limiting, failure, and fallbacks.** Test sources implemented; full passing gate pending.
- [x] **R121 — Create/update required admin/AI/roadmap/status/environment documentation and everyday staff guide.** Reconciled 2026-07-13; root handoff records verification state.
- [ ] **R122 — Produce final 16-part delivery/readiness report for internal testing, private beta, public MVP, and AI beta.** Only after final verification.

### Extended work order

Proceed strictly: R083–R085, R086–R091, R092, R093, R094, R095, R096–R098, R117, R099–R104, R105–R108, R109–R112, R113–R116, R118–R122. Re-read the attached master specification before every major phase.

### 2026-07-12 — Workflow admin Phase 1

- Re-read new master specification: yes.
- Completed: R083 architecture/relationship audit and current-state documentation.
- Implemented, awaiting final gate: R085 custom dashboard replacement with access-controlled attention queues, quick actions, overview metrics, recent activity, and responsive styling.
- Verification: `npm run typecheck` passed; `npm run lint` passed.
- Build blocker: the required elevated build was rejected because the execution allowance reached its usage limit. No workaround attempted.
- Exact next step: run `cd web && npm run build`, then add a seeded admin dashboard E2E test and mark R085 complete only when both build and test pass. Continue with Course Builder design/schema migration only afterward.

### 2026-07-13 — Workflow admin, LMS, and AI implementation handoff

- Re-read and reconciled the master specification, implementation plan, product roadmap, project status, architecture, testing, environment, staff, metrics, and migration documents.
- Implemented through R121. R086–R116 and R118–R120 use `[~]` because source work exists while the final verification gate remains open.
- Generated a full PostgreSQL baseline and added bundled Node 24 workarounds for migration/type commands.
- Refreshed generated Payload types and the admin import map.
- Resolved the production pre-AI schema-drift incident and verified `/admin` HTTP 200; the final AI schema remains to be applied/adopted with feature flags false.
- First strict typecheck exposed 31 generated-type errors; fix batches are partially applied. First AI test parse failure in `retrieval.ts` was fixed. Full typecheck, lint, unit, build, E2E, disposable PostgreSQL proof, production adoption, and R122 remain.
- Exact continuation is recorded in `HANDOFF-CODEX.md`; incoming work starts with auditing the interrupted admin-route patch and rerunning `npm run typecheck`.
