# SMN Engineering Handoff

**Updated:** 2026-07-21

**Branch:** `main` at `9642c5b`

**Repository:** `github.com/kobinaq/SMN`

**Application:** `web/`

**Production:** `https://socialmarketersnetwork.vercel.app`

This is the transfer snapshot. `PRODUCT-ROADMAP.md` is the canonical product/release status, `IMPLEMENTATION_PLAN.md` is the remaining work queue, and `ARCHITECTURE.md` describes the current system.

## Current state

SMN now includes:

- CMS-backed public marketing, programme, course, event, story, insight, resource, application, employer, legal, community, and contact surfaces.
- Separate member auth and portal for profile, onboarding, learning, mentorship, opportunities, portfolios, certificates, events, and tickets.
- LMS courses, modules, lessons, media/resources, enrollments, progress, completion, analytics, readiness, and certificate eligibility.
- Custom `/staff` application for Today, learning, people, mentorship, opportunities, certificates, events, content, website, system users/audit, and AI activity. `/admin` redirects to `/staff` unless emergency legacy mode is enabled.
- First-party free/paid event registration and Paystack checkout, verification, webhooks, fulfillment, payment records, tickets, cancellation, and check-in.
- Feature-flagged Tutor, Content Studio, and Career Coach with provider abstraction, grounding, safety, quotas, retention, feedback, and audit records.

## Changes after the previous handoff

Sixty-six commits landed after `66603f1`, including:

- the complete custom staff app and deeper Course Builder;
- shared interaction primitives and extensive member/staff refinement;
- portal sidebar, continuity, onboarding, portfolio, certificate, and LMS improvements;
- AI Tutor, Content Studio, and Career Coach UX upgrades;
- marketing CMS expansion, accessibility baseline, SEO, analytics, and July 18 page redesigns;
- first-party events and Paystack with `20260717_events_paystack`;
- more reliable SQLite-based CI/E2E setup and Payload config retries.

## Verification checkpoint

Run on 2026-07-21 against current `main`:

- `npm run typecheck` — passed.
- `npm run test:unit` — 36 passed, 1 skipped.
- `npm run lint` — failed with five `react-hooks/set-state-in-effect` errors:
  - `src/components/staff/LearningNav.tsx`
  - `src/components/staff/StaffEntitySwitcher.tsx` (two)
  - `src/components/staff/StaffMediaField.tsx` (two)
- Lint also reports one `@next/next/no-head-element` warning in `src/components/layout/SiteDocument.tsx`.
- Current production build and Playwright suite were not rerun after the lint failure.

The last fully documented run was 2026-07-14: typecheck and lint clean, 32 unit tests passed with 1 skipped, build passed, and Playwright passed 14/14. Do not treat that as evidence for the July 17–18 changes.

## Database state

Committed migrations:

1. `20260713_140429_smn_baseline_20260713`
2. `20260714_marketing_cms_fields`
3. `20260717_events_paystack`

Repository documentation records baseline adoption and the marketing migration on production. It does not establish that the events/Paystack migration has been applied. Inspect production migration bookkeeping before running anything. Never replay the baseline over an existing production database.

Normal deployment uses `npm run db:migrate`. `db:push` is only a guarded administrative bridge for a pre-baseline database and disposable local schema preparation; application startup never pushes automatically.

## Next actions

1. Fix current lint failures and warning.
2. Run typecheck, lint, unit, build, and full Playwright; update exact counts.
3. Verify all migrations on disposable PostgreSQL.
4. Inspect production migration state and safely apply any pending forward migration with a recovery point and named owner.
5. Smoke event registration, Paystack signatures/idempotency/fulfillment, tickets, cancellation, and check-in before exposing live paid CTAs.
6. Re-run critical staff/member/auth/LMS regression paths.
7. Keep AI flags off until each private-beta gate is approved.

## Production gates that require external confirmation

- Paystack live/test credentials, webhook endpoint/secret, test transactions, settlement and refund ownership.
- Resend sender, Mailchimp audience, R2/CDN, cron secret, Ahrefs property, WhatsApp invite, Classroom links, and operations inbox.
- Confirmed fees, testimonials, partner logos, impact claims, and legal/payment/refund review.
- Monitoring, backup/restore, incident response, deployment, and rollback owners.

## Working tree note

At the 2026-07-21 audit, local `main` matched `origin/main` except for two tracked deletions:

- `web/recordings/WALKTHROUGH.md`
- `web/recordings/smn-marketing-walkthrough.webm`

Treat those as user-owned changes; do not restore or commit them without confirmation.

## Documentation map

- `PRODUCT-ROADMAP.md` — canonical product and release state
- `IMPLEMENTATION_PLAN.md` — actionable remaining work
- `ARCHITECTURE.md` — technical architecture
- `docs/README.md` — documentation index
- `docs/staff-guide.md` — consolidated staff procedures
- `docs/member-journeys.md` — member workflows
- `docs/database-migrations.md` — schema runbook
- `docs/deployment.md` and `docs/production-checklist.md` — release procedure and sign-off
- `docs/testing.md` — quality gates and current evidence
- `docs/ai-architecture.md` — AI boundaries and operations
