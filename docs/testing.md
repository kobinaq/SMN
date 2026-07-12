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

Current coverage focuses on pure, high-risk helpers:

- YouTube URL parsing for LMS embeds
- Production environment validation

## End-to-End Tests

Playwright is configured in `playwright.config.ts`.

The current smoke suite verifies:

- Public home page loads
- Member login page renders
- Anonymous users are redirected away from protected portal routes

Install browser binaries when needed:

```bash
npx playwright install chromium
```

## Remaining Test Work

The MVP still needs database-backed workflow tests for:

- Member registration/login/logout
- Staff login and admin permissions
- Mentor application and approval
- Mentorship request lifecycle
- Opportunity publishing and applications
- LMS course access and lesson completion
- Portfolio visibility and ownership
- Certificate issuance and public verification

Those tests should run against a disposable test database seeded with `npm run seed:demo`.
