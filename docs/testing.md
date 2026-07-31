# Testing and Verification

**Updated:** 2026-07-21

## Commands

Run from web/:

| Command | Purpose |
|---|---|
| npm run generate:types | Refresh generated Payload types |
| npm run typecheck | TypeScript without emit |
| npm run lint | ESLint and React/Next rules |
| npm run test:unit | Deterministic Vitest suite |
| npm run build | Production Next.js build |
| npm run test:e2e | Build, seed disposable SQLite, and run Playwright |
| npm run test:coverage | Unit coverage report |
| npm run db:ensure-sqlite | Prepare a fresh local/CI SQLite schema |
| npm run db:migrate | Apply committed PostgreSQL migrations |

npm test runs unit and E2E. Normal CI never calls Groq or Paystack.

## Current evidence

Run on current main on 2026-07-21:

- Typecheck passed.
- Unit tests passed: 36 passed, 1 skipped across 12 files.
- Lint failed: five react-hooks/set-state-in-effect errors in LearningNav, StaffEntitySwitcher, and StaffMediaField.
- Lint also reported one no-head-element warning in SiteDocument.
- Build and Playwright were not rerun after that lint failure.

The July 14 result of a passing build and 14/14 E2E predates the July 17 events/Paystack and July 18 page changes. It is historical evidence only.

## Unit coverage

Vitest covers AI foundation and safety, staff permissions, LMS analytics/readiness/completion, member continuity, environment validation, API responses, currency, and marketing defaults. The Groq integration test is skipped unless RUN_GROQ_INTEGRATION=true and GROQ_API_KEY is present.

Payment and event domain behavior currently needs dedicated deterministic unit coverage for signatures, amount/currency validation, idempotent fulfillment, duplicate callbacks, and cancellation/refund boundaries.

## Browser coverage

Playwright specs cover public/auth, marketing, and admin/AI workflows with a disposable payload.e2e database. The runner builds the app, creates a fresh SQLite schema, seeds fictional records, uses one worker, and removes the test database afterward.

The next complete browser regression must cover:

- staff/member simultaneous auth and logout isolation;
- member onboarding, profile, dashboard continuity, LMS progress/resume, mentorship, opportunity tracking, portfolio, certificate, and logout;
- staff Course Builder, member notes, mentorship, opportunities, certificates, media, settings, and event operations;
- free event registration, paid checkout test path, tickets, cancellation, and check-in;
- AI disabled/provider failure plus mock Tutor, Content Studio, and Career Coach;
- key public pages and SEO outputs after the July 18 redesign.

External Paystack, Resend, R2, Mailchimp, ATS, Classroom, and Groq behavior belongs in controlled integration/staging checks, not deterministic CI.

## Release evidence

Do not describe the branch as green until lint, typecheck, unit, build, and Playwright all pass on the same current commit. Schema-affecting releases also require the full migration chain on disposable PostgreSQL and the production checklist.
