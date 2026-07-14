# SMN Project Status

**Updated:** 2026-07-14  
**Active programme:** Platform refinement (`cursor/platform-refinement-8510`)  
**Source of truth:** code + `REFINEMENT_AUDIT.md` + `IMPLEMENTATION_PLAN.md`

## Current product (breadth)

Public site, member portal, LMS, mentorship, opportunities, portfolios, certificates, custom staff app at `/staff`, and feature-flagged AI (Tutor, Content Studio, Career Coach). Payload remains CMS/auth/API.

## Refinement programme status

| Phase | Focus | Status |
|---|---|---|
| 0 | Audit + checklist | Mostly done (docs shells landing; mark complete after build/tests) |
| 1 | Production reliability | In progress (admin auth headers, role guards, env soft checks, API helpers) |
| 2 | Interaction consistency | In progress (Toast/ConfirmDialog/Empty/Error/Skeleton wired; ops confirms migrating) |
| 3 | Member experience | In progress (continuity dashboard, onboarding checklist, profile tags, LMS resume + save feedback) |
| 4 | Admin experience | In progress (Course Builder settings editor; mentorship/opportunity ConfirmDialog) |
| 5 | Existing AI refinement | Pending (flags stay off in prod) |
| 6 | Mobile, a11y, performance, tests, docs | Pending / docs expanding |

## Highest-priority gaps remaining

1. Avatar upload + fuller onboarding persistence beyond local dismiss
2. Lesson attachments management in Course Builder editor
3. Member 360 tabs + record-level deep links
4. Opportunity filter persistence + broader tracking states
5. Broader E2E coverage for member continuity + staff settings save
6. AI knowledge approval / draft→curriculum still incomplete (flags off)

## Marketing website (completed workstream)

**Brief:** Improve clarity, credibility, conversion, CMS manageability, SEO, a11y, performance — without a full visual redesign.  
**Audit:** `MARKETING_SITE_AUDIT.md` · Checklist: `IMPLEMENTATION_PLAN.md` (M-series) · Analytics: `web/docs/marketing-analytics.md`

### Marketing progress

| Stage | Status |
|---|---|
| Audit + checklist docs | Done |
| Pricing withheld + GH₵ formatter | Done |
| CTA / application language | Done |
| Homepage conversion journey | Done |
| Social-proof publication gates | Done |
| Payload SiteSettings + stories fields | Done (migration `20260714_marketing_cms_fields`) |
| Programme / apply / employer / nav / legal / SEO | Done |
| Analytics events | Done (vendor property still client-gated) |
| Unit + e2e + production build | Passed |
| Deep performance / full WCAG audit | Remaining polish |

### Verification (2026-07-14)

- `npm run typecheck` — clean
- `npm run lint` — clean
- `npm run test:unit` — 32 passed, 1 skipped
- `npm run build` — passed
- `npm run test:e2e` — 14/14 passed (includes new marketing suite)

### Client confirmation still required

- Final cohort and course fee amounts (enable `cohort.priceConfirmed` only after confirm)
- WhatsApp invite URL
- Selar product URLs
- Real testimonials / partner logos / impact metrics (`verified` stats)
- Legal counsel review of privacy/terms/refunds
- Production analytics property (GTM/gtag/Plausible)
- Apply `20260714_marketing_cms_fields` (or `db:push`) on production Postgres before relying on new CMS columns

## Production / migration

- Production: `https://socialmarketersnetwork.vercel.app` (Vercel root `web`, Neon Postgres).
- Baseline migration tooling exists; disposable Postgres proof + final prod adoption remain open gates.
- AI feature flags must remain false until schema adoption + smoke gates pass.
- Backup/recovery notes: `docs/deployment.md` · ops gate: `docs/production-checklist.md`.

## Freeze

No new major product areas. Improve depth, reliability, and usability of what exists.

See `IMPLEMENTATION_PLAN.md` for the numbered requirement checklist (R300+ and M-series). Items stay `[~]` until implemented + tested + docs + production build.
