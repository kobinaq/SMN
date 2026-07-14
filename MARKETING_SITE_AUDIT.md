# SMN Marketing Site Audit

**Audit date:** 2026-07-14  
**Application root:** `web/`  
**Scope:** Public marketing routes under `src/app/(site)`, auth entry points, shared content, Payload Website collections/globals  
**Rule:** Treat repository code as source of truth. Do not invent prices, metrics, or testimonials.

---

## 1. Public routes inventory

| Route | Purpose | Primary CTA today | Notes |
|-------|---------|-------------------|-------|
| `/` | Homepage | Mixed: Become a Member / Apply / WhatsApp / Enroll | Hardcodes courses, events, stories |
| `/about` | Mission, instructor | Apply to the cohort | Hardcoded `content.ts` |
| `/programs` | Programme hub | Apply / Browse courses | Clear split cohort vs courses |
| `/programs/cohort` | Flagship cohort | Apply Now | Pricing from `site.ts` |
| `/programs/courses` | Selar catalogue | Enroll on Selar | CMS + seed fallback |
| `/apply` | Cohort application | Submit application | Email-only backend |
| `/community` | WhatsApp landing | Join WhatsApp | Seed testimonials |
| `/events` | Event calendar | Register / Join WhatsApp | CMS + seed |
| `/insights` | Blog index | — | CMS + seed |
| `/insights/[slug]` | Article | Apply Now | Sidebar mentions Classroom |
| `/resources` | Resource library | Newsletter / WhatsApp | CMS + seed |
| `/resources/[slug]` | Resource detail | Get free download | Email gate |
| `/stories` | Success stories | Apply | CMS with seed fallback |
| `/mentorship` | Mentorship explainer | Browse mentors (portal) | Portal-dependent |
| `/mentorship/become-a-mentor` | Mentor path | Create account | Portal signup |
| `/employers` | Employer / partner | Talent request form | Clear employer path |
| `/contact` | Contact | Send message / WhatsApp | |
| `/privacy` | Privacy | — | Starter / counsel-marked |
| `/terms` | Terms | — | Starter / counsel-marked |
| `/verify/[code]` | Certificate verify | — | Production capability |
| `/u/[handle]` | Public portfolio | — | Production capability |
| `/login` | Member sign-in | Sign in | Auth |
| `/signup` | Member registration | Create account | Auth |
| `/forgot-password` | Password reset | — | Auth |

---

## 2. Findings by theme

### 2.1 Conflicting CTAs

- Header: **Apply Now** + **Join WhatsApp** + **Sign in** as near-equal actions.
- Cohort spotlight: **Enroll Now** → `/apply` (same destination as Apply).
- Hero: **Become a Member** vs final CTA **Apply to the cohort**.
- Variant labels: Apply Now / Apply / Apply to cohort / Apply to the cohort / Start your application / Submit application.
- Courses correctly use **Enroll on Selar** (different action) but programmes hub says **Buy on Selar**.

### 2.2 Pricing issues (requires client confirmation)

| Location | Current value | Issue |
|----------|---------------|-------|
| `site.ts` cohort `priceLabel` | `From GHS 250,000` | Unrealistic / placeholder-like; not confirmed |
| `content.ts` Growth Marketing | `GHS 45,000` | Unconfirmed seed |
| `content.ts` AI for Marketers | `GHS 38,000` | Unconfirmed seed |
| `content.ts` Social Strategy | `GHS 42,000` | Unconfirmed seed |
| Currency format | `GHS 250,000` | Inconsistent with target `GH₵2,500` |

**Decision:** Do not display misleading figures. Use safe wording pending client confirmation. Manage via Payload `site-settings` / course `price` fields.

### 2.3 Application journey

Intended flow from implementation + FAQs:

1. Explore programme  
2. Submit application (`/apply`)  
3. SMN reviews (copy: 3–5 business days)  
4. Acceptance  
5. Pay / payment plan  
6. Platform access (LMS, Classroom links, WhatsApp)

**Gap:** Application is email-only (Resend); no Payload application record. Confirmation message is brief. Payment instructions after acceptance are not shown on the success state.

### 2.4 Platform messaging vs reality

- Footer / several pages position SMN as **WhatsApp + Selar + Google Classroom** only.
- Production also has native member portal, LMS, progress, mentorship, opportunities, portfolios, certificates, public verification.
- AI Tutor / Career Coach exist but are **feature-flagged** — must not be promoted as fully available unless production-verified and enabled.

### 2.5 Social proof

- Seed stories: Ada Okonkwo, Kwame Mensah (`content.ts`) — used on home + community **without** CMS; appear fictional/stock.
- Demo seed: `Efua Demo` / “Fictional alumna” in `seed-demo.mjs`.
- No verified impact metrics on the site.
- Homepage never calls `getStories()`.

### 2.6 CMS manageability

| Content | Payload | Live site |
|---------|---------|-----------|
| Site settings (name, tagline, cohort, WhatsApp, social) | `site-settings` global | **`getSiteSettings()` never called** |
| Courses | `courses` | Courses page only; home hardcodes seed |
| Events | `events` | Events page; home hardcodes seed |
| Stories | `stories` | `/stories` only; home/community hardcode seed |
| Posts / resources | Yes | Mostly wired |
| Homepage hero / CTAs / stats | No dedicated fields | Hardcoded components |
| Nav / footer | No | Hardcoded |

### 2.7 SEO gaps

- No `sitemap.ts` / `robots.ts`
- No structured data (Organisation, Course, FAQ, etc.)
- No Twitter cards
- Homepage uses only global metadata
- Canonical depends on `NEXT_PUBLIC_SITE_URL` (good default domain exists; avoid Vercel URL in production)

### 2.8 Analytics

- No public conversion analytics (no gtag/Plausible/PostHog/Vercel Analytics on marketing surfaces).

### 2.9 Accessibility / mobile

- Programs dropdown: hover-only; limited keyboard support.
- Multiple equal CTAs compete on small screens.
- Forms usable but labels are placeholders-only (weak a11y).
- Motion: GSAP/Framer present; `prefers-reduced-motion` needs audit.

### 2.10 Legal / trust

- Privacy and Terms are explicit **starter** policies requiring counsel review.
- Missing: refund/cancellation, application payment terms, cookie notice, AI disclosure, data-protection contact detail beyond ops email.

### 2.11 Performance

- Large hero imagery + GSAP/Lenis animation stack on homepage.
- Client components for header, hero, cohort spotlight.
- Image optimisation via `next/image` is present; further sizing/lazy-load review needed.

### 2.12 Broken / stale risks

- Default WhatsApp invite URL looks placeholder (`chat.whatsapp.com/socialmarketers`).
- Selar URLs are seed product paths — verify in CMS.
- Header “Join WhatsApp” goes to `/community`, not the invite URL.

---

## 3. Requirement checklist (from brief)

Convert every requirement into a tracking checklist. Status updated in `IMPLEMENTATION_PLAN.md` and `PROJECT_STATUS.md`.

### Audit & docs
- [x] M001 Audit all public-facing routes
- [x] M002 Identify CTA / pricing / proof / CMS / SEO / a11y issues
- [x] M003 Create `MARKETING_SITE_AUDIT.md`
- [x] M004 Create/update `IMPLEMENTATION_PLAN.md` marketing checklist
- [x] M005 Create/update `PROJECT_STATUS.md`

### Pricing
- [ ] M010 Review every price/fee/currency string
- [ ] M011 Remove or withhold unconfirmed figures (incl. GHS 250,000 / 45,000 / 38,000 / 42,000)
- [ ] M012 Move fees into CMS-managed settings with confirmation flag
- [ ] M013 Standardise currency format to `GH₵X,XXX`
- [ ] M014 Use safe temporary wording where amounts unknown

### Application journey & CTAs
- [ ] M020 Confirm enrolment flow language sitewide
- [ ] M021 Standardise terminology (apply / purchase / sign-in / employer / WhatsApp)
- [ ] M022 Establish CTA hierarchy (one primary per page)
- [ ] M023 Align header CTA with primary business goal
- [ ] M024 Replace generic “Learn More” where specific labels exist

### Homepage
- [ ] M030 Hero: what / who / outcome / next action
- [ ] M031 Credibility section (verifiable only; CMS-ready)
- [ ] M032 Member journey section (learn → practice → mentorship → portfolio → credentials → opportunities)
- [ ] M033 Flagship programme / cohort block
- [ ] M034 Learning experience (production-verified only)
- [ ] M035 Mentorship & community
- [ ] M036 Member work & outcomes (real only)
- [ ] M037 Employer pathway
- [ ] M038 Final primary CTA

### Messaging & platform accuracy
- [ ] M040 Strengthen “marketers, not just content creators” with proof points
- [ ] M041 Remove unsupported superiority / guarantee claims
- [ ] M042 Reflect native platform (portal, LMS, portfolios, certificates, etc.)
- [ ] M043 Do not promote unverified/feature-flagged AI as generally available
- [ ] M044 Stop understating native platform vs WhatsApp/Classroom/Selar only

### Social proof
- [ ] M050 Remove/hide seed & fictional testimonials from public surfaces
- [ ] M051 CMS structures for testimonials, stories, portfolios, partners, stats
- [ ] M052 Publication / permission status on testimonials

### Payload / CMS
- [ ] M060 Wire `getSiteSettings()` into live site
- [ ] M061 Homepage editable fields (headline, copy, CTAs)
- [ ] M062 Cohort dates, deadlines, pricing, seats, payment-plan copy
- [ ] M063 Contact, WhatsApp, social, footer, announcement banner
- [ ] M064 Sensible defaults + admin-friendly validation
- [ ] M065 Migrations for schema changes

### Programme / course pages
- [ ] M070 Complete decision-making information on cohort/course pages
- [ ] M071 Distinguish cohort vs course vs free/paid/member-only

### Application flow
- [ ] M080 Clarify apply page + form labels/validation/mobile
- [ ] M081 Confirmation next steps, timeline, contact, payment timing
- [ ] M082 Duplicate-submission / honeypot behaviour verified
- [ ] M083 Avoid unnecessary personal data

### Employers
- [ ] M090 Dedicated employer CTAs (hire / share / partner)
- [ ] M091 Explain talent, portfolios, credentials, opportunity sharing

### Navigation
- [ ] M100 Simplify header IA
- [ ] M101 Keyboard-accessible dropdowns; clear active states
- [ ] M102 Separate sign-in from Apply visually

### Legal
- [ ] M110 Expand privacy/terms with platform realities + client-confirmation markers
- [ ] M111 Refund / application / payment / AI disclosure placeholders

### SEO / performance / a11y / mobile
- [ ] M120 Titles, descriptions, canonical, OG, Twitter, structured data
- [ ] M121 Sitemap + robots with production domain
- [ ] M122 Image/font/JS/animation performance improvements
- [ ] M123 WCAG 2.1 AA practical baseline
- [ ] M124 Mobile header/hero/forms/CTAs/overflow

### Analytics & tests
- [ ] M130 Privacy-conscious conversion events + naming docs
- [ ] M140 Nav / apply / CMS / SEO / a11y / responsive tests
- [ ] M150 Typecheck, lint, tests, production build pass
- [ ] M160 Final report (23 sections)

---

## 4. Priority order (execution)

Matches brief §21: audit → checklist → pricing → application language → CTAs → homepage → messaging → social proof → Payload → programmes → apply → employers → nav → legal → mobile → a11y → SEO → performance → analytics → tests → build → docs.
