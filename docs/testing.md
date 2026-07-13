# Testing

## Scripts

Run from `web`:

```bash
npm run typecheck
npm run lint
npm run test:unit
npm run test:e2e
npm run test:coverage
```

`npm test` runs unit tests and E2E tests. `npm run test:e2e` builds the app, starts `next start`, runs Playwright against a local test environment, then stops the server.

## Unit Tests

Vitest is configured in `vitest.config.ts`.

Coverage focuses on pure, high-risk helpers:

- YouTube URL parsing for LMS embeds
- Production environment validation
- LMS completion, readiness, and analytics
- AI provider contracts, structured schemas, invalid output, timeout mapping, rate limiting, injection policy, prohibited actions, minimization, opaque actor identifiers, course isolation/citations, unsupported fallbacks, and deterministic career matching
- Staff role boundaries

The live Groq integration check is skipped unless both `RUN_GROQ_INTEGRATION=true` and `GROQ_API_KEY` are present. Normal CI never calls Groq.

## End-to-End Tests

Playwright is configured in `playwright.config.ts`.

The current smoke suite verifies:

- Public home page loads
- Member login page renders
- Anonymous users are redirected away from protected portal routes
- A seeded staff user can log in and see the workflow-first dashboard
- Curriculum duplication and audited progress correction
- Content Studio generation, candidate review, and explicit draft save using mock AI
- Member 360 private notes, mentorship transitions, opportunity moderation, and certificate reissue
- Grounded Tutor answers/citations and confirmed Career Coach saves using mock AI
- Anonymous denial on staff and member AI mutation APIs

When running locally, the E2E runner pushes the schema and upserts fictional demo records into the disposable `payload.e2e.db` database before starting the production server. It never seeds the configured production database.

Install browser binaries when needed:

```bash
npx playwright install chromium
```

Playwright uses one worker because workflow tests intentionally mutate a shared per-process disposable database. The E2E runner deletes that database after the run. Real external email, R2, ATS feeds, and Groq require separate flag-gated integration or staging checks; they are not prerequisites for deterministic CI.

Before AI private beta, run typecheck, lint, unit, build, E2E, manual reduced-motion/mobile/keyboard checks, schema migration on a disposable PostgreSQL database, and the privacy/safety checklist in `docs/staff-guide.md`.
