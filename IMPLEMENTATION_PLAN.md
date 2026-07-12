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
- [x] **R017 — Keep community chat on WhatsApp; do not build in-app chat yet.** Files/routes: site content, `/community`. External real invite pending R063.
- [x] **R018 — Keep course sales on outbound Selar links.** Files: content/Courses/Learning/Enrollments. Routes: programs and `/app/learning`. Real URLs/entitlements pending R064/R049.
- [x] **R019 — Keep live cohort operations on Google Classroom.** Collections: `enrollments`, `learning-items`. Route: `/app/learning`. Tests: feature code; live link/content verification pending.
- [x] **R020 — Preserve dark-only visual brand and specified palette/matte image treatment.** Files: `globals.css`, UI/components. Routes: all. Tests: build plus visual smoke pending R073.
- [x] **R021 — Display pricing copy in GHS.** Files: seed/CMS marketing content. Routes: program/course surfaces. Tests: content search/manual review.
- [x] **R022 — Do not build a full native LMS beyond approved scope.** Current approved direction includes the LMS foundation in R055–R058; native payments and later LMS layers remain conditional.
- [x] **R023 — Do not build auto mentor matching or in-app video.** Collections/routes: mentors use requests and external Cal.com; no video service. Tests: code inspection.
- [x] **R024 — Use unlisted YouTube embeds for lesson video and Media/R2 for other lesson files.** Collections: `lms-lessons`, `media`. Routes: LMS lesson player. Tests: URL/embed logic plus build; functional smoke pending R074.

### C. Platform and portal foundation (7.0–7.1)

- [x] **R025 — Maintain dual auth collections and multi-root document layouts.** Collections: `users`, `members`. Files: route-group layouts and `SiteDocument`. Tests: build.
- [~] **R026 — Separate staff and member cookies safely.** WIP uses `cookiePrefix: "smn-admin"` and removes middleware. Files: `payload.config.ts`, `member.ts`, deleted `middleware.ts`, portal APIs. Routes: `/admin`, `/api/*`, `/app/*`. Tests required: member login/session/API calls, staff login, concurrent staff+member sessions, logout isolation, build. Migration: existing sessions are invalidated/re-login required.
- [ ] **R027 — Add member avatar upload through Media/R2.** Collections: `members`, `media`. Files: `Members.ts`, `ProfileForm.tsx`, profile/API handling. Route: `/app/profile`. Tests: authorization, size/type validation, upload/removal, R2 smoke. Dependency: R013/R076.
- [ ] **R028 — Configure Payload email adapter with Resend for forgot-password.** Files: `payload.config.ts`, env example, auth UI/docs. Route/API: `/forgot-password`, Payload auth endpoints. Tests: local adapter mock or safe sandbox plus production-domain smoke. Dependency: verified sending domain.
- [x] **R029 — Document `db:push` as current schema process while Node 24 migration CLI is broken.** Files: README/handoff. Test: docs/code consistency.
- [ ] **R030 — Resolve root versus `web/vercel.json` ambiguity and verify Vercel Root Directory.** Files: both Vercel configs, README. Tests: config review and production deployment settings.
- [~] **R031 — Provide robust portal empty states.** Existing real feature pages have empty states, but portal home still declares `placeholders`. Files: `/app/page.tsx`, feature pages/components. Tests: empty-data render smoke and build.
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
- [x] **R048 — Do not add video player/quiz engine to light-dashboard layer.** The separate approved LMS foundation owns YouTube lesson playback; quizzes remain later scope.
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
- [ ] **R059 — Keep quizzes, comments, automated certificate issuance, and payments as later layers unless separately approved.** Scope guard, not authorized implementation.

### J. Remaining roadmap

- [ ] **R060 — Build thin employer organization accounts and dashboard for own listings/applicants (7.8).** Depends on opportunities. Collections: likely `employer-orgs` plus account/member relation and ownership fields. Routes: employer auth/dashboard to design. Tests: tenancy/access matrix, CRUD, moderation, build. Migration required.
- [ ] **R061 — Add forum/announcement archive only if WhatsApp proves insufficient (7.9).** No implementation until product decision; empty forum explicitly avoided.
- [ ] **R062 — Add native payments/native LMS expansion only if Selar/Classroom block growth (7.10).** No implementation until evidence and product decision.

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
| Scope expansion into full LMS/forum/payments | Delays and product fragmentation | Enforce conditional R059/R061/R062 gates |
| Documentation contains stale phase numbering | Confusing roadmap | Update handoff, roadmap, and README together after each phase |

## Phase log

### 2026-07-12 — Phase 0 audit started

- Re-read master specification: yes.
- Completed: repository inventory, history, route/collection map, dirty-tree discovery, script/test inventory, initial traceability plan.
- Pre-existing WIP preserved: portal API auth changes, member auth helper, Payload cookie prefix, deleted middleware.
- Exact next step: inspect the complete auth WIP and relevant Next.js 16 proxy/auth/route-handler docs, run lint/type/build baseline, then either finish or safely correct the cookie-isolation migration before any new feature work.

