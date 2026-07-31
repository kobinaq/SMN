# Social Marketers Network — Current Architecture

**Updated:** 2026-07-21

**Canonical for:** system boundaries, data ownership, request flows, and deployment shape

**Product state:** [PRODUCT-ROADMAP.md](PRODUCT-ROADMAP.md)

## System overview

SMN is one Next.js application under web/. Payload supplies the data model, Local/REST APIs, authentication primitives, access control, migrations, and media integration. The application exposes four user-facing route groups:

| Surface | Routes | Identity |
|---|---|---|
| Public website | root, programmes, courses, events, stories, insights, resources, apply, community, employers, legal | Anonymous or optional member |
| Member auth | /login, /signup, /forgot-password | Payload members |
| Member product | /app/* | Authenticated member |
| Staff product | /staff/* | Authenticated Payload user |

Payload admin chrome is retired for normal work. /admin redirects to /staff; STAFF_LEGACY_ADMIN=true is an emergency-only fallback.

## Runtime and infrastructure

- Next.js 16 App Router, React 19, TypeScript, and Tailwind CSS.
- Payload CMS 3 with PostgreSQL in production and disposable SQLite for deterministic E2E.
- Vercel deployment with project root web/.
- Payload Media with Cloudflare R2 through the S3 adapter when fully configured.
- Unlisted privacy-enhanced YouTube embeds for LMS video.
- Paystack for first-party paid course/event checkout.
- Resend for transactional mail, Mailchimp for newsletter, Ahrefs/analytics helpers for public-site measurement.
- Public Greenhouse, Lever, and Ashby feeds for opportunity ingestion.
- Groq behind a provider-independent AI runtime; normal CI uses the mock provider.

## Authentication and authorization

Staff and members are separate Payload auth collections:

- users authenticate staff, use the smn-admin cookie namespace, and receive one least-privilege role: super-admin, content, learning, mentorship, opportunity, support, or analyst.
- members authenticate the portal and use the smn-member-token bridge.

Collection access and every custom mutation must enforce authorization server-side. Hidden navigation is not authorization. Staff API helpers promote the staff cookie into the Payload request context while preserving origin/CSRF controls. Member-owned records are filtered by authenticated member identity.

## Data domains

| Domain | Principal records |
|---|---|
| Website | Site Settings, Media, Posts, Courses, Events, Stories, Resources, newsletter and form records |
| People | Users, Members, Member Notes |
| Learning | Enrollments, Learning Items, Progress, LMS Courses, Modules, Lessons, Lesson Progress |
| Mentorship | Mentors, Mentorship Requests, Relationships, Feedback |
| Opportunities | Opportunities, Sources, Applications |
| Credentials | Portfolios, Certificates |
| Events and payments | Events, Event Registrations, Payments, Enrollments |
| Governance | Audit Events, AI Usage, AI Feedback, Knowledge Sources, Drafts, Career State |

Payload remains the system of record. UI components do not maintain an independent database or bypass collection access rules.

## Main request flows

### Staff operations

1. Staff authenticate at /staff/login.
2. Server components and custom staff APIs query Payload with the authenticated user.
3. The role matrix limits visible and mutable domains.
4. Mutations validate input, apply collection access, write records, and create audit records where required.
5. The staff UI reports progress, success, failure, and confirmation without relying on browser-native prompts.

### Learning

1. A member receives access through an active enrollment or an allowed programme key.
2. Published LMS records are resolved into a course/module/lesson tree.
3. Lesson completion writes member-owned progress.
4. Completion recalculates enrollment progress and certificate eligibility.
5. Files resolve through Media/R2; videos remain external YouTube embeds.

### Events and payments

1. A member or eligible visitor selects an event or paid course.
2. The initialize route validates the product, amount, identity, and Paystack configuration, then creates or reuses payment state.
3. Paystack redirects back to verification and independently calls the signed webhook.
4. Shared fulfillment records the successful payment and grants the event registration or course enrollment idempotently.
5. Members see tickets/access links; staff manage registrations, cancellation, and check-in.

Email delivery is a side effect, not the source of payment truth. A failed email must not reverse a successful payment or fulfillment.

### Opportunities

1. A protected cron fetches enabled public ATS sources.
2. Imported roles are normalized, fingerprinted, and usually held pending.
3. Staff review publication, duplicates, expiry, and source health.
4. Members track activity; applications continue on the employer’s external site.

### AI

1. An independent feature flag and authenticated entitlement gate the surface.
2. The runtime validates/minimizes input, applies quotas and safety checks, and selects the configured provider/model.
3. Tutor retrieval is restricted to approved material from the entitled course and returns citations or declines.
4. Content Studio validates structured candidates and saves reviewed drafts only.
5. Career Coach uses member-authorized profile context and requires confirmation before saving goals or plans.
6. Privacy-minimized usage and feedback records support operations and deletion/retention controls.

## Security boundaries

- Secrets are server-only; no Groq, Paystack, database, R2, Resend, or cron secret is exposed through NEXT_PUBLIC variables.
- Paystack webhooks require HMAC verification; fulfillment must remain idempotent and validate amount/currency/product.
- AI never auto-publishes, approves mentors, issues credentials, applies for jobs, or makes hiring decisions.
- Private staff notes do not enter AI context.
- Public portfolios, stories, and certificates require explicit publication/visibility state.
- Demo seeding is blocked in production unless explicitly unlocked.
- Automatic schema push is disabled during normal startup.

## Schema and deployment

Committed migrations are the production path:

1. 20260713_140429_smn_baseline_20260713
2. 20260714_marketing_cms_fields
3. 20260717_events_paystack

Fresh databases run npm run db:migrate. Existing pre-baseline production follows [docs/database-migrations.md](docs/database-migrations.md); never replay the baseline over existing tables. Vercel’s root directory is web/.

## Repository map

| Path | Responsibility |
|---|---|
| web/src/app/(site) | Public website and public APIs |
| web/src/app/(portal) | Member auth APIs and member product |
| web/src/app/(staff) | Custom staff app and staff APIs |
| web/src/app/(payload) | Payload API integration and legacy-admin redirect |
| web/src/collections | Payload data model and access rules |
| web/src/components | Public, member, staff, Payload, and shared UI |
| web/src/lib | Domain services, auth, AI, payments, CMS, analytics |
| web/src/migrations | Reviewed PostgreSQL migrations |
| web/tests/e2e | Deterministic browser workflows |
| docs | Operational and engineering references |
