# SMN Refinement Implementation Plan

**Updated:** 2026-07-14  
**Programme:** Platform refinement (no major new features)  
**Audit:** `REFINEMENT_AUDIT.md`

An item is complete only when: (1) implemented, (2) tested, (3) docs updated, (4) production build passes.

Status legend: `[ ]` open · `[~]` in progress · `[x]` done

---

## Phase 0 — Audit & planning

- [x] **R300** — Full route/API/auth/workflow/test/deploy audit (`REFINEMENT_AUDIT.md`)
- [x] **R301** — Convert refinement brief into this numbered checklist
- [~] **R302** — Align `PROJECT_STATUS.md` and refinement roadmap phases
- [~] **R303** — Add `docs/production-checklist.md`, `docs/member-journeys.md`, `docs/admin-journeys.md`, `docs/design-system.md`, `docs/accessibility.md` shells

---

## Phase 1 — Production reliability

### Schema, env, deploy

- [ ] **R310** — Verify migration tooling + document current prod adoption state
- [~] **R311** — Production env validation covers Resend, CRON_SECRET, SITE_URL, R2 completeness
- [~] **R312** — Document backup/recovery and rollback (`docs/deployment.md`)
- [~] **R313** — Production-like smoke script checklist automated or documented end-to-end
- [~] **R314** — Confirm `/staff` is canonical; document `STAFF_LEGACY_ADMIN` emergency only

### Auth & sessions

- [ ] **R320** — Staff + member cookie isolation verified under simultaneous login
- [~] **R321** — All staff mutation clients send `credentials: "include"`
- [~] **R322** — All `/api/admin/*` auth use `staffAuthHeaders(request)` (JWT promotion)
- [~] **R323** — Role guards on every admin mutation (incl. opportunity-operations, course-builder)
- [~] **R324** — Password-reset path: clear UX when email unconfigured; adapter wiring documented
- [ ] **R325** — Bootstrap first-user remains safe (empty users only) + rate/abuse notes

### Request hygiene

- [~] **R330** — Shared API helper: validate → authorize → succeed/fail JSON → log
- [~] **R331** — No stack traces/secrets in client error bodies
- [~] **R332** — Duplicate-submit protection on critical POSTs (disable + server idempotency where needed)
- [ ] **R333** — Timeouts / AbortSignal on AI and ATS import paths
- [ ] **R334** — Graceful external-service failure (email, R2, Groq, ATS) without breaking core UX
- [~] **R335** — Structured server logging for failed mutations (no PII dumps)

### Reliability smoke matrix

- [ ] **R340** — Member register / login / logout
- [ ] **R341** — Staff login / logout
- [ ] **R342** — Profile update
- [ ] **R343** — Course create + publish readiness path
- [ ] **R344** — Lesson completion + progress calculation
- [ ] **R345** — Mentor apply + approve + mentorship request
- [ ] **R346** — Opportunity create/import + application tracking
- [ ] **R347** — Portfolio publish
- [ ] **R348** — Certificate issue + public verify
- [ ] **R349** — AI disabled / provider failure fallback

---

## Phase 2 — Interaction consistency

### Shared UI kit

- [~] **R360** — Toast / inline alert primitives (success, warning, error, info)
- [~] **R361** — Skeleton / loading block primitives
- [~] **R362** — EmptyState + ErrorState + PermissionDenied components
- [~] **R363** — ConfirmDialog (destructive + generic) replacing `window.confirm`/`prompt` in staff ops
- [~] **R364** — StatusBadge system (draft/published/pending/expired/revoked/…)
- [~] **R365** — FormField with label association, error text, `aria-invalid`
- [ ] **R366** — PageHeader + Breadcrumbs for portal and staff
- [ ] **R367** — Unsaved-changes warning helper
- [~] **R368** — BusyButton / submit lock pattern
- [~] **R369** — Portal `loading.tsx` + `error.tsx` boundaries

### Interaction rules applied

- [~] **R370** — Every async staff/member mutation shows progress
- [~] **R371** — Every success shows confirmation (toast or inline)
- [~] **R372** — Every failure explains next step
- [~] **R373** — Forms retain values after validation failure
- [ ] **R374** — Back navigation restores filters where practical (ops lists)
- [ ] **R375** — Consistent terminology glossary applied in UI copy

---

## Phase 3 — Member experience refinement

### Onboarding

- [~] **R380** — Post-signup guided checklist (non-blocking)
- [~] **R381** — Essential profile step + skills/interests/goal prompts
- [~] **R382** — Platform orientation + first-course CTA
- [~] **R383** — Mentorship + opportunities discovery prompts
- [~] **R384** — Persist onboarding dismissal / completion

### Profile

- [~] **R390** — Profile completion percentage + incomplete sections list
- [~] **R391** — Suggested next action
- [~] **R392** — Skills as tags (not comma-only)
- [~] **R393** — Career interests as tags/controlled options
- [ ] **R394** — Avatar upload + preview
- [~] **R395** — Public/private visibility explanation + preview link
- [~] **R396** — Inline validation + save confirmation + mobile layout

### Homepage continuity dashboard

- [~] **R400** — Continue last lesson (deep link)
- [~] **R401** — Current course progress + incomplete lessons
- [~] **R402** — Profile completion card
- [~] **R403** — Mentorship pending/active status
- [~] **R404** — Opportunity application updates
- [~] **R405** — Portfolio drafts needing attention
- [~] **R406** — Recent certificates
- [~] **R407** — Remove stale “rolling out” placeholder copy
- [~] **R408** — Single primary next action + progressive disclosure

### LMS

- [~] **R410** — Course cards: status, duration, difficulty, progress, enrol state
- [~] **R411** — Course overview: outcomes, instructor, modules, cert, prerequisites, CTA
- [~] **R412** — Lesson: prev/next, module nav, progress chrome
- [~] **R413** — Progress save success + failure + retry (never silent)
- [~] **R414** — Resume last in-progress lesson
- [~] **R415** — Completion celebration + certificate eligibility CTA
- [ ] **R416** — Attachment presentation polish; member-safe empty media copy
- [ ] **R417** — Mobile lesson layout + keyboard accessibility

### Mentorship (member)

- [ ] **R420** — Clear lifecycle states + “who acts next”
- [ ] **R421** — Member request history / status page or section
- [ ] **R422** — Duplicate-request prevention messaging
- [ ] **R423** — Mentor capacity/availability clarity
- [ ] **R424** — Accessible request dialog (focus trap, Escape, labels)

### Opportunities (member)

- [~] **R430** — Filter persistence + expired labelling
- [~] **R431** — Detail page shows member application status
- [ ] **R432** — Expand tracking states (interested/applied/interviewing/offer/rejected/withdrawn/accepted) where schema allows safely
- [ ] **R433** — Notes + date applied + confirmation feedback
- [ ] **R434** — No auto-apply; external destination clarity

### Portfolios

- [~] **R440** — Guided case-study steps (title→reflection)
- [~] **R441** — Draft/publish + public preview before publish
- [~] **R442** — Edit existing case study (PATCH)
- [~] **R443** — Image upload/preview/order polish
- [~] **R444** — Remove full-page reload; use toast/refresh pattern

### Certificates (member + public)

- [~] **R450** — Copy verification link; clear revoked/reissued states
- [~] **R451** — Print/download-friendly presentation
- [ ] **R452** — Public `/verify/[code]` mobile + privacy-safe errors
- [ ] **R453** — Link certificate to programme/course when available

---

## Phase 4 — Admin experience refinement

### Staff dashboard

- [ ] **R460** — Attention items deep-link to filtered workspaces
- [ ] **R461** — Quick actions limited to frequent tasks
- [ ] **R462** — Platform health metrics decision-useful only
- [ ] **R463** — Surface failed integrations / import errors when available
- [ ] **R464** — Accurate workspace badges (incl. members if countable)

### Course Builder

- [~] **R470** — Editable course settings/metadata (instructor, outcomes, cover, status, tutor controls)
- [~] **R471** — Publication readiness blocks incomplete publish
- [~] **R472** — Lesson attachments management in editor
- [ ] **R473** — Enrollment grant/list minimal ops (no raw collection hopping)
- [ ] **R474** — Curriculum preview / learner preview link
- [ ] **R475** — Unsaved-change warning on editors
- [~] **R476** — Replace prompt-based curriculum confirms with ConfirmDialog
- [ ] **R477** — Assessments: keep Content Studio drafts only — no new LMS assessment product (freeze)

### Member 360

- [~] **R480** — Searchable member directory
- [ ] **R481** — Tabs: profile, learning, certificates, portfolio, mentorship, opportunities, notes, activity
- [~] **R482** — Show skills/goals; private notes remain private
- [ ] **R483** — Contextual actions (add note, open learning, open applications)
- [ ] **R484** — Deep links to related records
- [ ] **R485** — Safe limited member field updates for support (cohort/roles) with audit

### Mentorship Operations

- [ ] **R490** — Pending apps, capacity, unmatched, active/inactive/completed in one workspace
- [ ] **R491** — Persisted filters
- [ ] **R492** — Relationship feedback capture
- [ ] **R493** — Clear review history / audit
- [~] **R494** — ConfirmDialog for approve/reject/transition

### Opportunity Operations

- [ ] **R500** — Applications activity panel
- [ ] **R501** — Source CRUD or edit + sync retry
- [ ] **R502** — Duplicate handling guidance
- [ ] **R503** — Expiry warnings + preserved filters
- [ ] **R504** — Manual listing create shortcut
- [~] **R505** — Role-guarded API + ConfirmDialog actions

### Certificate issuing

- [ ] **R510** — Eligibility confirmation + preview
- [ ] **R511** — Bulk results + partial failure handling UI
- [~] **R512** — Revoke/reissue with reason dialogs
- [~] **R513** — Notification feedback clarity
- [ ] **R514** — Optional PDF attach when media available

### Staff workflow consistency

- [ ] **R520** — Shared save/publish/approve/reject patterns across ops
- [ ] **R521** — Side drawer for quick edits where practical
- [ ] **R522** — Preserve list filters after record close
- [ ] **R523** — Permission-denied empty states
- [ ] **R524** — Retire or quarantine dead `/admin` links in unused Payload components

---

## Phase 5 — Existing AI refinement (no new AI products)

- [ ] **R530** — Keep flags independent; prod stays off until schema+smoke gates
- [ ] **R531** — Tutor: clearer unsupported-answer + loading/error/retry/feedback
- [ ] **R532** — Tutor disabled state copy (parity with Career Coach)
- [ ] **R533** — Content Studio: validation errors, regenerate, partial accept, never auto-publish
- [ ] **R534** — Knowledge-source approve/list minimal staff UI (existing collection only)
- [ ] **R535** — Career Coach: match explanations, confirm-before-save, privacy controls polish
- [ ] **R536** — Provider failure never breaks non-AI pages
- [ ] **R537** — Rate-limit / timeout user messaging
- [ ] **R538** — Usage monitoring readable in System → AI activity
- [ ] **R539** — AI output labelled; feedback submission E2E with mock provider

---

## Phase 6 — Mobile, accessibility, performance, tests, docs

### Mobile

- [ ] **R550** — Member critical flows usable at 375px
- [ ] **R551** — Staff ops usable at tablet widths
- [ ] **R552** — Touch targets, sticky nav not covering CTAs, filters usable

### Accessibility (WCAG 2.1 AA practical baseline)

- [ ] **R560** — Keyboard nav + visible focus-visible globally
- [ ] **R561** — Modal focus trap + Escape
- [ ] **R562** — Form labels + error associations
- [ ] **R563** — Contrast + status not colour-only
- [ ] **R564** — Skip link + heading hierarchy
- [ ] **R565** — Reduced-motion respected for new motion
- [ ] **R566** — Drag-and-drop alternatives remain for curriculum actions

### Performance

- [ ] **R570** — Paginate heavy staff tables
- [ ] **R571** — Optimize dashboard / Course Builder queries
- [ ] **R572** — Image optimisation for avatars/covers
- [ ] **R573** — Avoid private data caching mistakes

### Analytics (privacy-conscious)

- [ ] **R580** — Define event helpers for onboarding, lesson resume, mentor request, application track, portfolio publish, cert view
- [ ] **R581** — Admin timing/error events for course create / mentor approve / opp publish / cert issue
- [ ] **R582** — Wire only when analytics config present; no sensitive payloads

### Testing

- [ ] **R590** — Expand member E2E: register, onboard, profile, lesson complete/resume, mentor, opportunity, portfolio, cert, logout
- [ ] **R591** — Expand staff E2E: dashboard, course curriculum, publish readiness, Member 360, mentor, opportunity, cert, logout
- [ ] **R592** — AI mock tests: grounded, missing source, isolation, timeout, rate limit, disabled fallback, feedback
- [ ] **R593** — Unit tests for shared interaction helpers + progress save failure UX
- [ ] **R594** — CI remains green; document Postgres proof gap if still open

### Documentation

- [ ] **R600** — `PRODUCT-ROADMAP.md` refinement phases 1–5 with acceptance criteria
- [ ] **R601** — `docs/member-journeys.md`
- [ ] **R602** — `docs/admin-journeys.md`
- [ ] **R603** — `docs/design-system.md`
- [ ] **R604** — `docs/accessibility.md`
- [ ] **R605** — `docs/testing.md` updated coverage
- [ ] **R606** — `docs/deployment.md` + `docs/production-checklist.md`
- [ ] **R607** — `docs/ai-architecture.md` refinement notes
- [ ] **R608** — Final readiness report (internal / private beta / public MVP / AI beta)

---

## Constraints (always on)

- No new major product areas (forum, payments, employer portal, new AI assistants, messaging, social feed).
- Payload remains system of record; Local API + access control; no package internals.
- Strict TypeScript; migrations for schema changes; AI never auto-publishes or makes consequential decisions.
- Groq keys server-side only; flags independent.
- Do not mark complete without tests + docs + build.

---

## Marketing website improvement (2026-07-14)

**Audit:** `MARKETING_SITE_AUDIT.md`  
**Constraint:** Preserve brand identity; no full redesign; no invented prices/metrics/testimonials.

### Marketing checklist (M-series)

#### Docs & process
- [x] **M001–M005** Audit routes/content; create audit + update this plan + project status.

#### Pricing (stage 3)
- [x] **M010** Inventory all price/fee strings.
- [x] **M011** Withhold unconfirmed GHS figures from public display.
- [x] **M012** CMS-manage fees; mark client confirmation required.
- [x] **M013** Standardise format `GH₵X,XXX` via shared helper.
- [x] **M014** Safe wording: “Contact SMN for current fees” where unknown.

#### Application language & CTAs (stages 4–5)
- [x] **M020** Enrolment flow language: apply → review → accept → pay → access.
- [x] **M021** Terminology map: Apply / Buy on Selar / Member sign in / Hire / WhatsApp.
- [x] **M022** One primary CTA per page; secondary quieter.
- [x] **M023** Header primary = Apply for the next cohort (`/apply`).
- [x] **M024** Specific CTA labels (no generic Learn More where avoidable).

#### Homepage (stage 6)
- [x] **M030–M038** Restructure sections: hero → proof → journey → cohort → learning → mentorship/community → outcomes → employers → final CTA.

#### Messaging & platform (stages 7–8)
- [x] **M040–M044** Value prop + accurate platform (native portal/LMS/etc.); no unverified AI promo.
- [x] **M050–M052** Remove seed testimonials from public; CMS publication status.

#### Payload (stage 9)
- [x] **M060** Wire `getSiteSettings()` into layout/pages.
- [x] **M061–M064** Editable homepage/cohort/contact/social/banner fields; admin-friendly.
- [x] **M065** Migrations for schema changes.

#### Programmes, apply, employers, nav, legal (stages 10–14)
- [x] **M070–M071** Complete programme/course decision info; clear product types.
- [x] **M080–M083** Application clarity, confirmation next steps, validation.
- [x] **M090–M091** Employer conversion path.
- [x] **M100–M102** Simpler nav; keyboard menus; sign-in vs apply.
- [x] **M110–M111** Legal expansion with client-confirmation markers.

#### Quality gates (stages 15–22)
- [~] **M120–M124** SEO, performance, a11y, mobile.
- [x] **M130** Conversion analytics + event naming doc.
- [x] **M140** Automated tests (nav, apply, CMS render, SEO, a11y basics).
- [x] **M150** typecheck + lint + tests + production build.
- [x] **M160** Final 23-part marketing report.

### Marketing phase log

#### 2026-07-14 — Audit complete; implementation starting
- Re-read marketing brief: yes.
- Completed: route audit, pricing inventory, CTA/social-proof/CMS/SEO gaps documented in `MARKETING_SITE_AUDIT.md`.
- Exact next step: M010–M014 pricing + wire SiteSettings + CTA standardisation.

#### 2026-07-14 — Core marketing improvements shipped
- Pricing withheld pending confirmation (`Contact SMN for current fees` / `See Selar for current price`); `formatGhs` helper; `priceConfirmed` gate in SiteSettings.
- CTA terminology standardised via `lib/cta.ts`; header primary = Apply; WhatsApp demoted from header desktop.
- Homepage restructured toward conversion journey; CMS-backed courses/events/stories; seed testimonials removed from public fallbacks.
- `getSiteSettings()` wired through site layout + provider; SiteSettings expanded (homepage, announcement, footer, impact stats, cohort deadline/audience/format).
- Stories require `published` + `permissionConfirmed`; migration `20260714_marketing_cms_fields`.
- Application page explains apply → review → accept → pay → access; form labels + confirmation state.
- Employer page uses Hire / Share / Partner CTAs separate from apply.
- Nav simplified (Programmes / Learning / Community / Employers / About); keyboard dropdowns.
- Legal pages expanded with client-confirmation markers; sitemap + robots + Organisation/Course/FAQ JSON-LD; analytics helper + docs.
- Verification: typecheck clean; lint clean; unit 32 passed / 1 skipped; production build passed; Playwright e2e 14/14 passed.

#### Marketing checklist status (summary)
- [x] M001–M005 docs
- [x] M010–M014 pricing safety + format helper
- [x] M020–M024 application language + CTA hierarchy
- [x] M030–M038 homepage structure (CMS-ready proof slot)
- [x] M040–M044 messaging / platform accuracy (AI not promoted as generally available)
- [x] M050–M052 social proof gates
- [x] M060–M065 Payload wiring + migration
- [x] M070–M071 programme/course clarity
- [x] M080–M083 application flow clarity
- [x] M090–M091 employer path
- [x] M100–M102 navigation
- [x] M110–M111 legal expansion (counsel markers remain)
- [x] M120–M121 SEO basics (sitemap/robots/canonical/OG/Twitter/JSON-LD)
- [~] M122–M124 performance/a11y/mobile — baseline improvements (focus states, labels, reduced-motion already in hero); deeper audit remains
- [x] M130 analytics events + naming doc
- [x] M140 tests (unit + e2e marketing suite)
- [x] M150 typecheck/lint/unit/build/e2e
- [x] M160 final report in agent response / PROJECT_STATUS
