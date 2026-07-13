# SMN Project Status

Date: 2026-07-12

## Implemented Features

- Public marketing website with home, about, programs, courses, cohort, community, events, insights, resources, stories, mentorship, employers, apply, contact, privacy, and terms pages.
- Payload CMS at `/admin` for staff users.
- Separate member auth collection and branded member login/signup pages.
- Member portal at `/app`.
- Member profile editing and public/private profile visibility.
- Mentor applications, approved mentor directory, and mentorship requests.
- Opportunities board with manual/imported listings and member application tracking.
- Opportunity source import support for Greenhouse, Lever, and Ashby feeds.
- Learning dashboard with enrollments, learning items, and progress.
- LMS foundation with courses, modules, lessons, YouTube video embeds, R2-backed attachments, and lesson progress.
- Portfolio case studies and public `/u/[handle]` pages.
- Certificates, member certificate list, and public `/verify/[code]` verification.
- Media upload through Payload, with Cloudflare R2 support.
- Vercel cron route for opportunity sync.
- Demo seed script at `web/scripts/seed-demo.mjs`.
- CI workflow at `.github/workflows/ci.yml`.

## Production-Ready Features

- Public site fallback content works without CMS data.
- Staff/admin access is restricted to `users`.
- Member portal routes redirect unauthenticated users to `/login`.
- Staff and member browser sessions now use separate cookies.
- Member profile update uses an allowlisted custom route.
- Member-owned workflow APIs use the member auth cookie bridge.
- Certificates verify only `valid` and `public` credentials.
- Portfolio public pages require both a public member profile and public published portfolio items.
- Production env validation exists for core required variables.

## Features Requiring Verification

- End-to-end production staff login after deploy.
- End-to-end member login/signup with the new `smn-member-token` cookie.
- R2 uploads on Vercel.
- Resend emails after verified sender/domain setup.
- Mailchimp newsletter integration with real audience settings.
- Opportunity import cron on Vercel.
- LMS access with real enrollments and real unlisted YouTube videos.
- Certificate PDF uploads and public verification with real files.

## Known Bugs / Risks

- Payload session revocation is not yet performed on member logout; member logout clears the browser cookie only.
- Several public content collections do not yet have draft/status workflows (`events`, `resources`, `stories`).
- Password reset depends on a configured Payload email adapter; without email it returns a safe generic response.
- Some older copy/assets may still contain placeholder external links for Selar, Lu.ma, WhatsApp, and legal pages.
- Full workflow automated tests are not yet implemented.
- npm audit currently reports 10 vulnerabilities from dependency tree review: 1 low, 9 moderate.

## Missing Integrations

- Resend production domain and Payload email adapter.
- Mailchimp production credentials.
- Google Analytics.
- Real Selar course/product URLs.
- Real Google Classroom links.
- Real Lu.ma/event registration links.
- Final WhatsApp invite.
- Custom media domain for `R2_PUBLIC_URL`.

## Missing Content

- Final legal privacy and terms review.
- Final cohort dates/pricing.
- Real employer/partner copy and listings.
- Real course curriculum and videos.
- Real mentor roster.
- Real certificate PDFs.

## Security Concerns Addressed

- Staff/member cookie separation implemented.
- Removed middleware cookie deletion workaround.
- Staff-only mutations added for public content collections and site settings.
- Member-owned APIs now authenticate against member cookie only.
- Profile update no longer depends on a member id in the URL.
- Public certificate verification exposes only necessary credential data.
- Production env validation added.

## Test Coverage

- Vitest configured.
- Playwright configured.
- Unit tests cover YouTube embed URL parsing and production env validation.
- E2E smoke tests cover public home, login page, and anonymous protected-route redirect.
- CI runs install, typecheck, lint, unit tests, build, and E2E smoke tests.

## Remaining MVP Work

- Add disposable test database and workflow-level integration tests.
- Add member logout server-side session revocation.
- Add robust email templates and notifications for all major workflows.
- Finish production env configuration and external integrations.
- Seed and verify realistic demo data locally/staging.
- Run complete manual staff and member journey tests after deploy.

## Readiness

- Internal testing: ready after deploying this hardening pass and running smoke checks.
- Private beta: close, but requires real env configuration, email setup, R2 verification, and seeded/manual workflow checks.
- Public MVP: not ready until full manual journeys and higher-value workflow tests pass.

## Workflow Admin and AI Extension (2026-07-13)

Implementation is complete and final verification is pending for the workflow-first admin, Course Builder/readiness/automation/analytics, Member 360, mentorship operations, opportunity operations, certificate issuing/lifecycle, grouped navigation, and the minimal seven-role staff matrix.

Provider-independent AI foundations, privacy-minimized retained usage, approved course retrieval, Tutor, Content Studio, deterministic-first Career Coach, success metrics, safety/unit/E2E source coverage, staff guidance, and independent rollback flags are implemented. AI remains disabled by default and is not approved for private beta until the final verification report is complete.

A full PostgreSQL baseline migration now exists for fresh databases. Existing production requires the guarded adoption procedure in `docs/database-migrations.md`; its schema was repaired through the pre-baseline admin tables but has not yet received/adopted the final AI schema in this status snapshot.

The older “Known Bugs,” “Test Coverage,” and “Remaining MVP Work” bullets above are historical context where contradicted by this dated section. The final 16-part readiness report will supersede release statements after verification.
