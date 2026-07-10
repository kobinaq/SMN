# Social Marketers Network — Architecture & Build Plan

**Status:** Locked decisions v1  
**Date:** 2026-07-10  
**Product:** Premium marketing-community website (not a full LMS/portal)

---

## 1. Product framing

SMN is the **digital home of a professional learning network** for strategic marketers in Africa. The site must feel like a **premium editorial / portfolio experience** (Clapat-grade motion + typography), not a generic course storefront.

**Primary outcome**  
Visitors leave thinking: *“This is where marketers belong, grow, and build careers.”*

**Primary conversion**  
Flagship cohort applications.

**Secondary conversions**  
Self-paced course purchases (Selar), event registrations, newsletter, Discord joins, mentor applications, employer/partner enquiries.

---

## 2. Locked architecture decisions

| Concern | Decision |
|--------|----------|
| Frontend | **Next.js 15 (App Router) + TypeScript + Tailwind CSS** |
| CMS | **Payload CMS 3** (embedded or monorepo; Postgres on managed DB) |
| Hosting | **Vercel** (Next + Payload API routes / Node runtime as required) |
| Database | **Neon Postgres** (assumed; serverless-friendly for Vercel) |
| Media | **Vercel Blob** or **S3-compatible** (Cloudflare R2) via Payload storage adapter |
| Transactional email | **Resend** (form notifications + auto-replies) |
| Newsletter | **Mailchimp** (subscribe API from forms / footer) |
| Course sales / LMS | **Selar** (checkout + digital product delivery) |
| Live sessions | **Google Classroom** (cohort live classes; links managed in CMS) |
| Community | **Discord** (invite link; not built in-app) |
| Motion | **GSAP + ScrollTrigger** (+ optional Lenis smooth scroll) |
| Analytics | **GA4** + conversion events (assumed) |
| Forms backend | Next.js Route Handlers → validate → Resend (+ optional Mailchimp tag) |

### Explicitly out of MVP

Member portal, learning dashboard, in-app forum, job board, mentor directory, employer portal, native certificates, portfolio profiles, custom payment/LMS.

---

## 3. Assumptions (filled gaps)

These are **working defaults** until the client corrects them.

### Brand & positioning

| Item | Assumption |
|------|------------|
| Geography | Africa-first (English), global diaspora welcome |
| Currency | Display NGN primary on Selar links; optional USD note for international |
| Domain | `socialmarketers.network` (placeholder until confirmed) |
| Legal name | Social Marketers Network |
| Lead instructor | Single founder/instructor profile on About (name TBD from client) |

### Flagship cohort

| Item | Assumption |
|------|------------|
| Name | **Social Media Marketing & AI Cohort** |
| Format | Live instructor-led + community + portfolio projects |
| Duration | **8 weeks** |
| Cadence | Live sessions **2× / week** on Google Classroom |
| Next start | CMS-managed field (e.g. “September 2026”) |
| Pricing | CMS-managed; checkout may be “Apply first” (no pay until accepted) **or** Selar payment link after acceptance |
| Capacity | ~30 seats per cohort |
| Application fields | Name, email, WhatsApp, city/country, current role, experience level, LinkedIn, goals, how they heard about SMN, portfolio URL (optional) |
| Certificate | Mention “Certificate of completion” as content; digital certs = Phase 2 |

### Self-paced courses

| Item | Assumption |
|------|------------|
| Delivery | Sold on **Selar**; site shows catalogue + “Enroll on Selar” CTA |
| Access | Selar buyer experience; Google Classroom only for cohort live tracks |
| Count at launch | 3–6 course cards (even if some “Coming soon”) |

### Community & mentorship

| Item | Assumption |
|------|------------|
| Community home | **Discord** (public “Join Discord” CTA; private channels for paid/cohort after manual role) |
| Mentorship v1 | Marketing page + mentor application form (no matching UI) |
| Mentors | Alumni + industry pros; approval is manual offline |

### Events

| Item | Assumption |
|------|------------|
| Types | Webinars, workshops, networking |
| Registration | External link (Luma / Google Form / WhatsApp) stored per event in CMS |
| Free default | Webinars free; paid events rare and linked out |

### Employers

| Item | Assumption |
|------|------------|
| v1 | Value prop + forms (talent request, partner, guest speaking) |
| No job board | Opportunities handled via email / Discord announcements |

### Content ops

| Item | Assumption |
|------|------------|
| Launch content | Placeholder-quality OK for structure; real copy loaded before public launch |
| Blog cadence | Insights posts in Payload; 4–6 seed articles |
| Resources | PDF downloads; optional email gate via Mailchimp tag `resource-download` |

### Design system tokens (from brief + logos)

| Token | Value (working) |
|-------|-----------------|
| Deep blue | `#0A2F8F` (from logo / brand; refine to exact hex from brand kit) |
| Baby blue | `#7EB6FF` |
| Mint | `#6FCFB0` |
| Grey | `#6B7280` |
| Near-black | `#0B0D12` (premium dark surfaces, Clapat/GrowthX feel) |
| White | `#FFFFFF` |
| Heading font | **League Spartan** |
| Body font | **Inter** |
| Logo | Wordmark only (blue on light / white on blue); no icon mark yet — use monogram **SMN** if needed in favicon |

---

## 4. Visual & motion direction

### Inspiration map

| Source | Steal this | Avoid this |
|--------|------------|------------|
| **Clapat** (primary) | Smooth scroll, pinned storytelling sections, dramatic typography reveals, image scale/mask transitions, page-transition feel, generous whitespace, editorial hierarchy | Pure portfolio-only IA; WordPress theme constraints |
| **GrowthX dark hero** | Premium black canvas, exclusive framing, strong center headline, logo social proof, geometric blue forms | “Invite-only” if SMN is open-application — adapt to “Application-based cohort” |
| **GrowthX cohort photo** | Large community photography, mixed type (serif accent optional for quotes), solid blue pill CTA | Overly warm gold palace aesthetic if it fights brand blue |
| **OnDeck** | Clear nav, network/community visual metaphor, dual audience (learners + partners), “Apply Now” as primary chrome | Cluttered multi-dropdown nav on mobile |
| **Reforge cards** | Clean course cards, lesson/meta chips, recommended badge, dark section with large quote marks | Dense SaaS dashboard chrome |

### Overall look

- **Default mode:** dark, premium, deep blue accents (Clapat × GrowthX Club).  
- **Light sections:** white/grey for readability (About, long-form Insights, forms).  
- **Mint** sparingly for success states, badges, secondary accents.  
- **Photography:** real community/cohort energy over stock icons.  
- **UI density:** editorial and spacious, not card-grid e-commerce.

### GSAP storytelling system

Implement a small **animation kit** so pages feel cohesive:

1. **Smooth scroll** — Lenis + ScrollTrigger scrub (respect `prefers-reduced-motion`).  
2. **Hero intro** — logo/wordmark fade + clip-path headline + staggered CTA.  
3. **Scroll-pinned chapters** (Home + Cohort) — full-viewport sections that pin while text/images morph (philosophy → ecosystem → programs → community).  
4. **Text split reveals** — lines/words rise with opacity (SplitType or GSAP SplitText if licensed; else CSS + GSAP).  
5. **Image parallax / scale** — images grow from 1.1 → 1 as they enter.  
6. **Horizontal strip** (optional Home) — ecosystem pillars or partner logos.  
7. **Card cascade** — programs/resources stagger on enter.  
8. **CTA band** — final full-bleed pin with Apply + Discord.  
9. **Route transitions** (nice-to-have) — simple opacity/clip between pages; don’t block SEO/content.

**Performance rules**

- Kill ScrollTriggers on unmount.  
- No heavy WebGL for MVP.  
- Disable/simplify motion when `prefers-reduced-motion: reduce`.  
- Lazy-load below-fold media; prefer WebP/AVIF.

---

## 5. System architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users (browser)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  Vercel — Next.js 15 App Router                                  │
│  • Marketing pages (RSC + client islands for GSAP)               │
│  • /admin → Payload admin                                        │
│  • /api/* → forms, Mailchimp, webhooks                           │
└───────┬──────────────┬──────────────┬──────────────┬────────────┘
        │              │              │              │
        ▼              ▼              ▼              ▼
   Neon Postgres   Resend API    Mailchimp API   Selar (external)
   (Payload data)  (emails)      (newsletter)    Google Classroom
                                                  Discord invites
```

### Request flows

**Browse content**  
Visitor → Next.js (ISR/SSR) → Payload Local API or REST → Postgres → rendered HTML.

**Apply to cohort**  
Form → `POST /api/forms/cohort-apply` → validate (Zod) → Resend to ops inbox + confirmation to applicant → optional Mailchimp tag `cohort-applicant` → success UI.

**Enroll self-paced**  
Course page CTA → **external Selar product URL** (from CMS). No payment code on our stack.

**Join community**  
CTA → Discord invite URL (CMS global).

**Live cohort access**  
After acceptance (offline process), ops adds student to Google Classroom + Discord role. Site only shows “what happens after you’re accepted.”

---

## 6. Monorepo / project shape

```
SMN/
├── apps/web/                 # or repo root as single Next app
│   ├── app/
│   │   ├── (marketing)/      # public site
│   │   ├── (payload)/admin/  # Payload admin
│   │   └── api/
│   ├── collections/          # Payload collections
│   ├── components/
│   │   ├── ui/
│   │   ├── sections/         # homepage/page blocks
│   │   ├── forms/
│   │   └── motion/           # GSAP hooks, providers
│   ├── lib/                  # resend, mailchimp, payload client
│   └── styles/
├── public/
├── ARCHITECTURE.md
└── package.json
```

**Recommendation:** Single Next.js app with Payload 3 embedded (`@payloadcms/next`) for simpler Vercel deploy.

---

## 7. Payload CMS collections

### Globals

- **SiteSettings** — site name, tagline, nav, footer, social links, Discord invite, default SEO, GA ID  
- **Brand** — logo light/dark, colour overrides (optional)  
- **Homepage** — ordered blocks (hero, philosophy, ecosystem, programs, events, stories, CTAs)

### Collections

| Collection | Purpose |
|------------|---------|
| **Pages** | Generic flexible pages if needed |
| **Programs** | High-level pathways (cohort vs self-paced) |
| **Cohorts** | Active/upcoming cohort: dates, price copy, curriculum, FAQ, Selar/apply mode, Classroom blurb |
| **Courses** | Self-paced: title, summary, outcomes, duration, price label, Selar URL, image, status |
| **Events** | Title, type, date, location/online, registration URL, featured image |
| **Resources** | Title, type (template/guide/prompts…), file, description, gateEmail? |
| **Posts** (Insights) | Blog: title, slug, category, body, cover, SEO |
| **Stories** | Success stories / testimonials: quote, person, role, media, video URL |
| **Team** | Instructor(s): bio, brands, milestones |
| **FAQs** | Reusable FAQ groups (cohort, general) |
| **FormSubmissions** | Optional store of applications (PII-aware; or email-only) |
| **Media** | Uploads |

### Block types (Homepage / flexible pages)

`Hero`, `RichText`, `PhilosophyGrid`, `EcosystemMap`, `ProgramCards`, `FeaturedEvents`, `ResourceRow`, `StoryCarousel`, `LogoCloud`, `CTABand`, `Newsletter`, `StatsRow`, `QuoteBreak`, `MediaFullBleed`

---

## 8. Site map & page responsibilities

| Route | Purpose | Key integrations |
|-------|---------|------------------|
| `/` | Story + ecosystem + CTAs | GSAP chapters |
| `/about` | Story, mission, instructor | — |
| `/programs` | Pathways overview | — |
| `/programs/cohort` | Flagship sales page | Apply form |
| `/programs/courses` | Catalogue | Selar links |
| `/programs/courses/[slug]` | Course detail | Selar CTA |
| `/community` | Culture + Discord join | Discord |
| `/mentorship` | How mentoring works | Mentor form |
| `/mentorship/become-a-mentor` | Mentor pitch | Mentor form |
| `/events` | Upcoming list | External reg links |
| `/events/[slug]` | Event detail | Reg link |
| `/resources` | Searchable library | Downloads / gate |
| `/insights` | Blog index | — |
| `/insights/[slug]` | Article | — |
| `/stories` | Success stories | — |
| `/employers` | Partner / hire talent | Partner forms |
| `/contact` | Enquiry types | Resend |
| `/apply` | Cohort application | Resend (+ Mailchimp tag) |
| `/privacy`, `/terms` | Legal stubs | — |

Nav (assumed): Programs · Community · Events · Insights · Resources · Employers · **Apply** (button)

---

## 9. Forms specification

All forms: client validation + Zod server validation + honeypot + rate limit (IP).

| Form | Fields (assumed) | Email to | Auto-reply | Mailchimp |
|------|------------------|----------|------------|-----------|
| Cohort apply | name, email, phone/WhatsApp, country, role, level, LinkedIn, goals, source, portfolio? | `hello@…` | Yes — “application received” | Tag `cohort-applicant` |
| Contact | name, email, type (general/partner/speaking), message | ops | Optional | No |
| Mentor apply | name, email, expertise, years, LinkedIn, why | ops | Yes | Tag `mentor-applicant` |
| Employer talent | company, name, email, need type, message | ops | Yes | Tag `employer` |
| Newsletter | email | — | Mailchimp confirmation | List subscribe |
| Resource gate | email + resourceId | — | Download link or unlock | Tag `resource-download` |

**Resend**

- From: `Social Marketers Network <noreply@domain>` (domain verified)  
- Ops inbox: configurable env `OPS_EMAIL`

---

## 10. External product map

```
                    ┌──────────────┐
   Apply accepted → │ Manual ops   │ → Google Classroom invite
                    │ (WhatsApp /  │ → Discord role
                    │  email)      │ → (optional) Selar payment
                    └──────────────┘

   Self-paced buy → Selar checkout → Selar delivers access

   Community CTA  → Discord invite

   Events         → Luma / Form / WhatsApp (per event URL)
```

**Copy rule:** Never imply in-platform video lessons or live streaming on the website itself. Clear lines:

- “Self-paced courses are delivered via Selar.”  
- “Live cohort sessions run on Google Classroom.”  
- “Community lives on Discord.”

---

## 11. SEO, analytics, performance

- Metadata API per page (title, description, OG from Payload)  
- `sitemap.xml` + `robots.txt`  
- JSON-LD: Organization, Course (where relevant), Event  
- GA4 events: `apply_submit`, `newsletter_subscribe`, `selar_click`, `discord_click`, `resource_download`, `event_register_click`, `mentor_apply_submit`, `employer_submit`  
- Lighthouse targets: mobile perf ≥ 80 with motion reduced; LCP hero image optimized  
- Fonts: `next/font` for Inter + League Spartan  

---

## 12. Environment variables (assumed)

```
DATABASE_URI=
PAYLOAD_SECRET=
BLOB_READ_WRITE_TOKEN=          # or S3 keys
RESEND_API_KEY=
RESEND_FROM=
OPS_EMAIL=
MAILCHIMP_API_KEY=
MAILCHIMP_AUDIENCE_ID=
MAILCHIMP_SERVER_PREFIX=        # e.g. us21
NEXT_PUBLIC_GA_ID=
NEXT_PUBLIC_SITE_URL=
DISCORD_INVITE_URL=             # also in CMS; env as fallback
```

---

## 13. Security & compliance

- No card data on our servers (Selar handles payments)  
- Form rate limiting + honeypot  
- Payload admin behind strong credentials; restrict admin routes  
- Privacy policy covers form data, Mailchimp, analytics  
- Don’t store more PII in `FormSubmissions` than needed (or email-only)  

---

## 14. Build phases & PR plan

### Phase 0 — Foundation (PR1)

- Next.js + Tailwind + design tokens (brand colours, type)  
- Base layout: nav, footer, logo, Apply CTA  
- Payload install, Postgres, Media, SiteSettings  
- Deploy pipeline to Vercel (preview + prod)

### Phase 1 — Design system & motion (PR2)

- UI primitives (Button, Card, Section, Badge, Input)  
- GSAP provider, Lenis, reduced-motion, reusable scroll hooks  
- Storytelling section templates (Hero, PinChapter, CTABand)

### Phase 2 — Core marketing pages (PR3)

- Home (block-driven) with GSAP chapters  
- About + Team/instructor  
- Programs index + Cohort page  
- Static legal stubs

### Phase 3 — Commerce-adjacent content (PR4)

- Courses catalogue + detail → Selar URLs  
- Events list/detail  
- Resources library + download/gate  
- Success stories

### Phase 4 — Community & B2B (PR5)

- Community (Discord)  
- Mentorship + Become a Mentor  
- Employers & Partners  

### Phase 5 — Insights & forms (PR6)

- Blog index + article template  
- All forms + Resend + Mailchimp  
- Apply page + confirmation states  

### Phase 6 — Polish & launch (PR7)

- SEO, analytics events, sitemap  
- Content seed, image pass  
- Motion QA, mobile QA, accessibility pass  
- Production domain + Resend domain auth + Mailchimp live list  

### Phase 7+ (post-MVP product)

Member portal, Selar webhooks deeper, Classroom automation, mentor directory, job board — **separate initiative**.

---

## 15. Homepage scroll storyboard (assumed)

| Beat | Section | Motion |
|------|---------|--------|
| 0 | Preloader / logo mark | Brief fade (optional) |
| 1 | Hero: tagline + Apply / Explore | Clip-path headline, CTA rise |
| 2 | “Not another course platform” | Pin + line-by-line philosophy |
| 3 | Core beliefs / pillars | Stagger cards or horizontal scrub |
| 4 | Learning ecosystem map | Draw/connect nodes (SVG or CSS) |
| 5 | Flagship cohort spotlight | Image scale + price reveal + CTA |
| 6 | Self-paced strip | Card cascade |
| 7 | Community (Discord) | Full-bleed photo + join |
| 8 | Stories | Quote marks + testimonial swap |
| 9 | Events + Resources | Soft enter |
| 10 | Employers teaser | Split panel |
| 11 | Newsletter + final Apply | Sticky CTA band |

---

## 16. Success metrics instrumentation

| KPI | How we measure |
|-----|----------------|
| Cohort applications | Form success + GA4 `apply_submit` |
| Course enrollments | GA4 `selar_click` (proxy) + Selar dashboard |
| Webinar/event regs | `event_register_click` |
| Newsletter | Mailchimp + `newsletter_subscribe` |
| Community growth | `discord_click` + Discord insights |
| Resource downloads | `resource_download` |
| Employer/mentor leads | Form events |

---

## 17. Open items still worth confirming with client

Not blockers for scaffolding, but confirm before public launch:

1. Exact domain + email addresses  
2. Lead instructor name, bio, headshot, brand list  
3. Real cohort dates, price, application vs pay-first flow  
4. Selar store URLs for each course  
5. Discord invite (permanent)  
6. Google Classroom is ops-only (confirm no student-facing Classroom link on site)  
7. Mailchimp audience name / double opt-in preference  
8. Exact brand hexes if a full brand guide exists  

---

## 18. Recommendation summary

Build a **Clapat-grade Next.js marketing site** with **Payload** as the content brain, **GSAP scroll storytelling** on Home + Cohort, and **outbound product surfaces**:

- **Selar** = money for self-paced  
- **Google Classroom** = live cohort delivery (ops)  
- **Discord** = community  
- **Resend** = form email  
- **Mailchimp** = list growth  
- **Vercel** = host everything public-facing  

Defer portals and native LMS until the brand site converts.
