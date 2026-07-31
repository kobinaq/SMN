# SMN Implementation Plan

**Updated:** 2026-07-21

**Canonical for:** remaining engineering and release work

**Product status:** `PRODUCT-ROADMAP.md`

Status: `[ ]` open · `[~]` implemented but not fully verified · `[x]` verified at the current checkpoint.

An item is complete only when its implementation, tests, documentation, and relevant production or staging evidence are current. Historical requirement-by-requirement audits were consolidated into this actionable queue.

## P0 — Restore a green current baseline

- [x] **P001** Current TypeScript check passes (`npm run typecheck`, 2026-07-21).
- [x] **P002** Current unit suite passes (36 passed, 1 skipped, 2026-07-21).
- [ ] **P003** Fix five lint errors in `LearningNav`, `StaffEntitySwitcher`, and `StaffMediaField`.
- [ ] **P004** Resolve or deliberately suppress the `SiteDocument` `<head>` lint warning using the supported Next.js pattern.
- [ ] **P005** Run a current production build after lint is clean.
- [ ] **P006** Run the complete Playwright suite against the current code and record totals.
- [ ] **P007** Confirm CI is green on the resulting commit.

## P0 — Database and production safety

- [x] **P010** PostgreSQL baseline migration is committed.
- [x] **P011** Existing production baseline and `20260714_marketing_cms_fields` adoption are documented.
- [~] **P012** `20260717_events_paystack` migration is committed; disposable-Postgres and production application evidence remain open.
- [ ] **P013** Verify all migrations from empty disposable PostgreSQL.
- [ ] **P014** Confirm production `payload-migrations` state and record the result without replaying the baseline.
- [ ] **P015** Take a production recovery point and name the rollback owner before applying pending migration work.
- [ ] **P016** Run post-migration reads for events, event registrations, payments, enrollments, courses, and existing core collections.

## P0 — Events and Paystack release

- [~] **P020** Free and paid event registration, payment creation, verification, webhook handling, fulfillment, tickets, cancellation, and check-in are implemented.
- [ ] **P021** Configure Paystack test keys and webhook secret on a controlled environment.
- [ ] **P022** Verify signature rejection, amount/currency validation, duplicate initialize/verify/webhook delivery, and idempotent enrollment/registration fulfillment.
- [ ] **P023** Verify success email failure does not undo a completed payment or grant.
- [ ] **P024** Verify refund/cancellation ownership and user-facing policy with stakeholders.
- [ ] **P025** Run staff registration list, cancellation, QR/ticket, and check-in smoke tests.
- [ ] **P026** Confirm production migration and webhook URL before exposing paid CTAs.

## P1 — Auth, permissions, and reliability

- [~] **P030** `/staff` is canonical and `/admin` is emergency-only.
- [ ] **P031** Re-run simultaneous staff/member login, logout, cookie isolation, and protected-route tests.
- [ ] **P032** Audit every `/api/admin/*`, `/api/staff/*`, event, and payment mutation for role checks, CSRF/origin behavior, input validation, and safe errors.
- [ ] **P033** Verify first-user bootstrap is restricted to an empty users collection and document abuse/rate considerations.
- [ ] **P034** Verify password reset and transactional email behavior with production-like Resend configuration.
- [ ] **P035** Add or connect structured production error monitoring without sensitive payloads.
- [ ] **P036** Exercise graceful failures for R2, Resend, Mailchimp, Groq, ATS feeds, Paystack, and Classroom links.

## P1 — Member and learning regression

- [~] **P040** Onboarding, profile tags, continuity dashboard, lesson resume, progress feedback, portfolios, and certificate presentation are implemented.
- [ ] **P041** Expand member E2E through signup, onboarding, profile, course access, progress/resume, mentorship, opportunity tracking, portfolio publishing, certificate view, events, tickets, and logout.
- [ ] **P042** Verify member-facing mobile behavior at 375px and keyboard flows for dialogs/navigation.
- [ ] **P043** Confirm empty/error/loading states and retry copy for every critical member mutation.
- [ ] **P044** Verify public portfolio and certificate privacy rules with anonymous and authenticated users.

## P1 — Staff workflow regression

- [~] **P050** Custom staff Today, learning, people, mentorship, opportunities, certificates, events, content, website, system, and AI workspaces are implemented.
- [ ] **P051** Verify course create → curriculum → settings → readiness → publish without legacy admin.
- [ ] **P052** Verify Member 360, notes, mentor review/request transitions, opportunity moderation, certificate issue/revoke/reissue, and event operations.
- [ ] **P053** Verify all destructive actions use accessible confirmation and preserve useful list state.
- [ ] **P054** Test staff tablet layouts, media selection/upload, entity switching, and permission-denied states.
- [ ] **P055** Remove or quarantine remaining dead legacy `/admin` links and unused Payload-view components.

## P1 — AI private-beta readiness

- [~] **P060** Tutor, Content Studio, and Career Coach are implemented behind independent flags.
- [ ] **P061** Confirm production AI schema before enabling any flag.
- [ ] **P062** Verify course entitlement/isolation, citations, unsupported-answer decline, injection handling, quotas, timeouts, retention, deletion, and feedback.
- [ ] **P063** Verify Content Studio remains draft-only and requires explicit reviewed saves.
- [ ] **P064** Verify Career Coach explains matches and requires confirmation before saving plans.
- [ ] **P065** Verify provider failure and disabled flags never break non-AI pages.
- [ ] **P066** Review current Groq model availability before beta and update aliases only through configuration.

## P2 — Accessibility, performance, and observability

- [~] **P070** Skip link, focus-visible styles, labels, reduced-motion support, and shared feedback primitives exist.
- [ ] **P071** Resolve all automated accessibility issues and manually test keyboard/focus behavior on critical routes.
- [ ] **P072** Run mobile/tablet layout review for public, member, and staff critical paths.
- [ ] **P073** Profile heavy staff dashboards, Course Builder, content pages, and image delivery.
- [ ] **P074** Confirm private data is never cached publicly and analytics payloads contain no sensitive data.
- [ ] **P075** Establish operational dashboards/alerts for failed payments, imports, email, AI, and server errors.

## P2 — Stakeholder and content completion

- [ ] **P080** Confirm live fees, paid catalogue availability, refund terms, and application language.
- [ ] **P081** Supply verified testimonials, partner logos, impact statistics, WhatsApp invite, and Classroom links.
- [ ] **P082** Complete legal review for privacy, terms, payment/refund, AI, and event data handling.
- [ ] **P083** Configure live analytics property, Resend sender, Mailchimp audience, R2/CDN, cron secret, and operations inbox.
- [ ] **P084** Name deployment, migration, payment operations, incident, and rollback owners.

## Completed foundations

- [x] Public CMS-backed marketing/content platform and July 18 page uplift.
- [x] Separate staff and member authentication domains.
- [x] Member portal, mentorship, opportunities, portfolios, certificates, LMS foundation, and progress automation.
- [x] Custom `/staff` operations and CMS application.
- [x] Shared UI feedback, confirmation, selection, tag, loading, error, and navigation primitives.
- [x] Provider-independent AI foundation with three existing surfaces.
- [x] First-party events and Paystack implementation in code.
- [x] Migration, environment, testing, deployment, staff, member, AI, and accessibility documentation structure.
