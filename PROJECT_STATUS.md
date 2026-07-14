# SMN Project Status

**Updated:** 2026-07-14

## Current product

SMN includes a public marketing/content website, Payload staff CMS, authenticated member portal, mentorship, opportunities, learning and LMS delivery, portfolios, credentials, workflow-first administration, and feature-flagged AI-assisted learning/career tools.

## Marketing website (active workstream)

**Brief:** Improve clarity, credibility, conversion, CMS manageability, SEO, a11y, performance — without a full visual redesign.  
**Audit:** `MARKETING_SITE_AUDIT.md` · Checklist: `IMPLEMENTATION_PLAN.md` (M-series) · Analytics: `web/docs/marketing-analytics.md`

### Assessment (2026-07-14)

Original issues included unconfirmed seed prices, mixed Apply/Enroll CTAs, unwired `site-settings`, homepage seed testimonials, platform messaging that underplayed the native portal/LMS, starter legal copy, and missing sitemap/analytics.

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

## Production / platform state (unchanged gates)

- Production URL: `https://socialmarketersnetwork.vercel.app` (prefer custom domain in `NEXT_PUBLIC_SITE_URL`)
- Disposable PostgreSQL migration proof and production schema adoption remain open for the broader product line
- AI flags must remain false until release gates in `PRODUCT-ROADMAP.md`

See `HANDOFF-CODEX.md` for platform continuation; see marketing checklist for website follow-ups.
