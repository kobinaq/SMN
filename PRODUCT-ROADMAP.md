# SMN Product Roadmap and Current Status

**Updated:** 2026-07-21

**Canonical for:** delivered product, release state, priorities, and external gates

**Detailed work queue:** `IMPLEMENTATION_PLAN.md`

SMN is a public marketing and community site, authenticated member platform, LMS foundation, first-party events and payments product, custom staff application, and a set of independently gated AI assistants. Payload is the system of record, authorization layer, and API.

## Current product

| Area | Delivered state |
|---|---|
| Public website | CMS-backed programmes, courses, events, stories, insights, resources, application, employer, legal, community, and contact experiences |
| Member platform | Separate member auth, profile, onboarding, continuity dashboard, learning, mentorship, opportunities, portfolio, certificates, event registrations, and tickets |
| Learning | Enrollments, learning items, LMS courses/modules/lessons, YouTube and file resources, progress, completion, readiness, analytics, and certificate eligibility |
| Staff operations | Canonical `/staff` app for Today, learning, people, mentorship, opportunities, certificates, events, content, website, users, audit, and AI activity |
| Events and commerce | First-party event registration, paid/free flows, Paystack checkout/verification/webhooks, payment records, fulfillment, Classroom access, tickets, cancellation, and check-in |
| AI | Feature-flagged Tutor, Content Studio, and Career Coach on a provider-independent runtime with safety, grounding, quotas, retention, feedback, and audit records |
| Integrations | Neon/Postgres, Cloudflare R2, Resend, Mailchimp, Ahrefs, Paystack, WhatsApp, Google Classroom, and public Greenhouse/Lever/Ashby feeds |

## Architecture decisions

- Staff authenticate through Payload `users`; members use Payload `members`. Their cookies and permissions are isolated.
- `/staff` is the staff product. `/admin` redirects there unless the emergency `STAFF_LEGACY_ADMIN=true` switch is set.
- PostgreSQL is required for production. Disposable SQLite databases support deterministic local E2E runs.
- Committed migrations are the production schema path. Application startup never pushes schema automatically.
- Media uses Payload Media and R2 when configured. LMS video uses privacy-enhanced unlisted YouTube embeds.
- Paystack is the first-party payment provider. Selar fields remain only for legacy catalogue records.
- AI features are independent, server-only, disabled by default, and never publish or make consequential decisions automatically.

## Delivery and release state

| Workstream | Implementation | Verification / production state |
|---|---|---|
| Marketing and CMS | Delivered and redesigned | July 14 typecheck, lint, unit, build, and 14/14 E2E were green; later redesigns need a fresh full run |
| Member and LMS refinement | Delivered substantially | Current typecheck and unit tests pass; full browser regression remains |
| Custom staff app | Delivered | Current lint has five `set-state-in-effect` errors in newer staff components |
| Events and Paystack | Delivered in code with migration | Production migration and live Paystack webhook/fulfillment smoke are not documented as complete |
| AI surfaces | Delivered behind flags | Production enablement remains a separate privacy, schema, provider, and smoke decision |
| Production migrations | Baseline and marketing adoption documented | `20260717_events_paystack` production application is unconfirmed in the repository |

## Current priorities

1. Fix the five lint errors in `LearningNav`, `StaffEntitySwitcher`, and `StaffMediaField`; resolve the `SiteDocument` head warning.
2. Run lint, typecheck, unit tests, production build, and Playwright against the current July 18 code.
3. Verify `20260717_events_paystack` on disposable Postgres and confirm whether it has been applied to production.
4. Smoke paid and free event registration, Paystack webhook fulfillment, duplicate callbacks, cancellation/refund behavior, tickets, and staff check-in.
5. Reconfirm staff/member session isolation and critical workflows after the custom staff and portal changes.
6. Keep each AI flag off until its schema, privacy, provider, accessibility, and rollback checks pass.
7. Complete stakeholder-owned production content and integration configuration.

## External and stakeholder gates

- Live Paystack keys, dashboard webhook URL/secret, settlement ownership, refund policy, and end-to-end test transactions.
- Production Resend sender/domain, operations inbox, Mailchimp audience, R2 bucket/CDN, cron secret, Ahrefs property, WhatsApp invite, and Classroom links.
- Confirmed course/cohort fees and catalogue availability.
- Approved testimonials, partner logos, impact metrics, privacy terms, refund terms, and legal review.
- Monitoring, backup/restore ownership, incident response owner, and rollback decision-maker.

## Release gates

### Internal release

- Current lint, typecheck, unit, build, and E2E pass.
- Migrations apply cleanly to disposable PostgreSQL.
- Member, staff, LMS, event, payment, and AI-disabled smoke paths pass.

### Production events and payments

- Migration state is recorded.
- Paystack signatures, idempotent fulfillment, amount/currency checks, email failure behavior, cancellation, and check-in are verified with test transactions.

### AI private beta

- Only the approved feature flag is enabled.
- Retrieval isolation, quotas, retention/deletion, feedback, provider failure, accessibility, and rollback are verified.

### Public readiness

- Stakeholder content and environment gates are closed.
- Backup/restore and incident ownership are explicit.
- Production smoke is signed off using `docs/production-checklist.md`.
