# Social Marketers Network Application

The application lives in web/. For project status and priorities, read [../PRODUCT-ROADMAP.md](../PRODUCT-ROADMAP.md). The documentation index is [../docs/README.md](../docs/README.md).

## Stack

- Next.js 16 App Router, React 19, TypeScript, Tailwind CSS
- Payload CMS 3 with PostgreSQL production and disposable SQLite E2E
- Custom staff app at /staff and member product at /app
- Cloudflare R2 media, unlisted YouTube LMS video
- Paystack payments, Resend email, Mailchimp newsletter, Ahrefs analytics
- Provider-independent AI with Groq and mock adapters

## Local development

From web/:

1. Copy .env.example to .env.local and supply safe development values.
2. Run npm install.
3. Run npm run dev.

Key local routes:

| Route | Purpose |
|---|---|
| / | Public website |
| /signup and /login | Member authentication |
| /app | Member product |
| /staff/login and /staff | Staff authentication and product |
| /admin | Redirect to /staff unless emergency legacy mode is enabled |

Marketing content can fall back to safe defaults when CMS records are empty. Missing external credentials disable or degrade only their integration; see [../docs/environment-variables.md](../docs/environment-variables.md).

## Authentication

Payload users are staff; Payload members are community members. Staff and member cookies are isolated. Collection and route authorization is server-enforced. See [../docs/authentication.md](../docs/authentication.md).

## Database

Production requires PostgreSQL. Normal startup never pushes schema.

- npm run db:migrate applies committed forward migrations.
- npm run db:migrate:create -- concise_name creates a reviewed migration.
- npm run db:check lists/validates schema state.
- npm run db:ensure-sqlite prepares disposable local/CI SQLite.

Existing production predates the baseline; follow [../docs/database-migrations.md](../docs/database-migrations.md) and never replay the baseline over existing tables.

Current migrations are listed in `src/migrations/index.ts`. Apply new ones with `npm run db:migrate` after deploy. The 20260825 lock-rels migration is required before Payload document-lock queries can succeed against collections added after the baseline.

## Quality

Run:

1. npm run generate:types
2. npm run typecheck
3. npm run lint
4. npm run test:unit
5. npm run build
6. npm run test:e2e

The exact current checkpoint is in [../docs/testing.md](../docs/testing.md). As of 2026-07-21, typecheck and unit tests pass, while lint has five errors in newer staff components; build/E2E need a fresh run afterward.

## Deployment

Vercel must use web as the Root Directory and the default Next.js output. Configure the production environment, apply reviewed migrations, and complete [../docs/production-checklist.md](../docs/production-checklist.md). See [../docs/deployment.md](../docs/deployment.md).

## Product domains

- Public CMS: Site Settings, Media, posts, resources, courses, events, and stories
- Members: profiles, onboarding, mentorship, opportunities, portfolios, certificates, events, and tickets
- Learning: enrollments, learning items, LMS courses/modules/lessons, progress, analytics, and completion
- Staff: Today, learning, people, mentorship, opportunities, certificates, events, content, website, users, audit, and AI activity
- Payments: Paystack checkout/verification/webhook, payment records, registration/enrollment fulfillment
- AI: Tutor, Content Studio, and Career Coach behind independent flags

Operational procedures are consolidated in [../docs/staff-guide.md](../docs/staff-guide.md).

## Opportunity imports

The protected cron can ingest public Greenhouse, Lever, and Ashby boards. Keep auto-publish off until a source is proven. Applications continue on the employer site; SMN stores member tracking state only.

## External integrations

Paystack, Resend, R2, Mailchimp, Ahrefs, WhatsApp, Classroom, ATS feeds, and Groq require their documented environment values and separate staging/production smoke. Normal deterministic CI does not contact those services.
