# SMN handoff for Codex

**Date:** 2026-07-11  
**Repo:** `github.com/kobinaq/SMN` (branch `main`)  
**App root:** `web/` (Next.js 16 App Router + Payload 3)  
**Production:** `https://socialmarketersnetwork.vercel.app`  
**Vercel Root Directory:** must be `web`  
**Previous agent:** Grok Build (session limit almost up)

This document is the transfer brief. Codex has full repo access. Prefer reading code over re-deriving architecture.

---

## 1. Product in one paragraph

**Social Marketers Network (SMN)** is a premium marketing-community site for modern marketers (Africa-first): flagship cohort, Selar self-paced courses, WhatsApp community, events, insights, resources, and employers/partners. Phase 7+ turns it into a **network product** with member accounts, mentors, jobs, learning dashboard, portfolios, certificates — without building a full LMS or replacing WhatsApp/Selar/Classroom yet.

---

## 2. Current state (what works)

### Marketing site (largely complete)
- Dark-only brand UI (no light mode)
- Home (hero photo fan, philosophy, instructor Arielle Adodo, courses, community, events, stories)
- About, programs/cohort/courses, community (WhatsApp), events (calendar uplift), insights + articles, resources library + detail
- Apply, contact, employers, mentorship pages (thinner layouts)
- Forms: cohort apply, contact, newsletter (Resend/Mailchimp when env set; otherwise console log)
- GSAP + Lenis motion (Lenis off on mobile/touch)
- Unique image map: `web/src/lib/images.ts` — do not reuse photos across surfaces
- Seed content: `web/src/lib/content.ts` when CMS empty

### Platform / product started (7.0–7.1)
- **Staff CMS:** Payload collection `users` → `/admin`
- **Members:** auth collection `members` → `/signup`, `/login`, `/app/*`
- Portal shell: home, profile edit, placeholder pages for learning/mentors/opportunities
- Postgres via `DATABASE_URL` (`web/src/lib/db.ts`); SQLite local fallback
- R2 via `@payloadcms/storage-s3` when `R2_*` env present
- Schema push: **opt-in only** — `npm run db:push` (not on every request)
- Dual document shells: multi-root layouts (no `app/layout.tsx`)
  - `(site)`, `(auth)`, `(portal)` → `SiteDocument`
  - `(payload)` → Payload `RootLayout`

### Confirmed working in production (as of handoff)
- Marketing pages + images
- Member `/login` → `/app` (user was logged in)
- Neon DB reachable; `members` / `users` tables exist

### Not confirmed / broken / fragile
- **`/admin` on Vercel was blank black** while local worked  
  - Root cause identified: `Users.access.admin` returned `true` when `!req.user`, so Payload rendered Dashboard with `user: null` instead of redirecting to login  
  - **Fix committed in spirit** in `Users.ts`: `admin` must return **boolean only** for staff  
  - **Verify after deploy:** private window → `/admin` → should redirect to `/admin/login` or create-first-user  
- Member and staff share **one** cookie: `payload-token` (Payload global `cookiePrefix`)  
  - Middleware `web/src/middleware.ts` strips member JWT from `/admin` request only  
  - Logging into staff admin still **overwrites** member cookie (known limitation)
- Resend / Mailchimp / domain / `R2_PUBLIC_URL` not fully set (user waiting on domain purchase)
- Thinner marketing pages not “uplifted” to events/community quality: employers, mentorship, stories, programs hub, courses catalogue
- Legal: privacy/terms are starter stubs
- GA4 not wired
- Selar / Lu.ma URLs still placeholders in seed content

---

## 3. Locked technical decisions (do not reverse without reason)

| Topic | Decision |
|-------|----------|
| Member auth | **Payload** `members` collection — **not** Clerk/Auth.js |
| Staff auth | Payload `users` only for `/admin` |
| Media | **Cloudflare R2** (S3 adapter), not Vercel Blob |
| Hosting | Vercel, monorepo root directory **`web`** |
| DB production | **Neon Postgres** via `DATABASE_URL` |
| Schema changes | `npm run db:push` (`PAYLOAD_DB_PUSH=true`), not auto-push on request |
| Community chat | **WhatsApp** (external invite); do not build in-app chat yet |
| Course sales | **Selar** outbound links |
| Live cohort | **Google Classroom** (ops links; light dashboard later) |
| Brand | Dark-only, deep blue `#0A2F8F`, baby blue, mint; matte overlays on photos (not glow) |
| Currency display | GHS for pricing copy |

---

## 4. Critical file map

| Path | Role |
|------|------|
| `web/src/payload.config.ts` | Payload config, serverURL, CSRF, R2 plugin, admin branding |
| `web/src/lib/db.ts` | Postgres vs SQLite adapter; push only if `PAYLOAD_DB_PUSH=true` |
| `web/src/lib/server-url.ts` | `getServerURL()` for admin/cookies |
| `web/src/lib/images.ts` | Central unique image paths |
| `web/src/lib/content.ts` | Seed marketing content |
| `web/src/lib/auth/member.ts` | `getMember` / `requireMember` |
| `web/src/collections/Users.ts` | Staff access — **admin must return boolean staff-only** |
| `web/src/collections/Members.ts` | Member profiles + auth |
| `web/src/middleware.ts` | Strip member JWT on `/admin` only |
| `web/src/app/(payload)/layout.tsx` | Payload RootLayout + serverFunction |
| `web/src/app/(portal)/app/*` | Member portal pages |
| `web/src/app/(auth)/*` | Login/signup/forgot |
| `web/src/components/layout/SiteDocument.tsx` | Marketing/auth/portal html shell |
| `web/src/components/layout/BrandLogo.tsx` | Logo with `unoptimized` (avoid preload warnings) |
| `web/scripts/push-schema.mjs` | Production schema sync helper |
| `web/scripts/check-schema.mjs` | List tables |
| `PRODUCT-ROADMAP.md` | Short phase list |
| `ARCHITECTURE.md` | Original MVP architecture (some Discord refs outdated → WhatsApp) |
| `web/README.md` | Dev + Vercel notes |
| `web/.env.example` | Env template (no real secrets) |

---

## 5. Environment variables

### Required on Vercel (Production)

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres |
| `PAYLOAD_SECRET` | JWT/signing — **match local** if same DB |
| `NEXT_PUBLIC_SITE_URL` | Full origin e.g. `https://socialmarketersnetwork.vercel.app` (no trailing slash) — **critical for admin CSRF/cookies** |
| `R2_BUCKET` | Cloudflare R2 |
| `R2_ACCESS_KEY_ID` | R2 |
| `R2_SECRET_ACCESS_KEY` | R2 |
| `R2_ENDPOINT` | `https://<accountid>.r2.cloudflarestorage.com` |
| `R2_REGION` | Usually `auto` |

### Optional / later (domain)

| Variable | When |
|----------|------|
| `R2_PUBLIC_URL` | After custom media domain or r2.dev public URL |
| `RESEND_API_KEY`, `RESEND_FROM` | After domain for email |
| `OPS_EMAIL` | Form notifications |
| `MAILCHIMP_*` | Newsletter |
| `NEXT_PUBLIC_WHATSAPP_INVITE` | Real group link |

### Local
- Prefer `web/.env.local` for Postgres + secret (gitignored)
- Schema: `cd web && npm run db:push`
- Check tables: `npm run db:check`

### Schema / migrate notes
- `payload migrate` CLI **breaks on Node 24** in this environment (tsx / `@next/env` interop)
- Use `npm run db:push` instead of migrate for now
- Do **not** re-enable `push: true` on every app connect (causes 20–30s “Pulling schema” and failed admin queries)

---

## 6. Immediate priorities (do these first)

### P0 — Unblock production admin
1. Confirm latest `Users.access.admin` is deployed (boolean staff-only).
2. Private window → `https://socialmarketersnetwork.vercel.app/admin`
3. Expect **redirect to `/admin/login`** or create-first-user — not blank dashboard.
4. Create/login **staff** user (separate from member account).
5. If still blank: check browser console + Network for `/api/*` failures; verify `NEXT_PUBLIC_SITE_URL` and `PAYLOAD_SECRET` on Vercel.

### P0 — Stabilize, don’t thrash
- Avoid stacking speculative admin fixes without reproducing the HTML/RSC payload.
- Production debug tip: `curl` `/admin` HTML — if RSC stream has `"user":null` and page children `null` with Dashboard view, it’s the canAccessAdmin bug again.

### P1 — Content / launch readiness (marketing)
- Real WhatsApp invite, Selar URLs, Lu.ma events, cohort dates/prices
- Privacy/terms legal review
- GA4
- Domain → update `NEXT_PUBLIC_SITE_URL`, Resend domain, optional `R2_PUBLIC_URL`

### P1 — Optional page uplifts (quality parity with events/community)
- Employers, mentorship, stories, programs hub, courses catalogue

---

## 7. Remaining product phases (Phase 7+)

Implement in dependency order. Full design notes also in session plan history; this is the executable backlog.

```text
7.0 Platform ──► 7.1 Portal shell ──┬──► 7.2 Mentors
        (mostly done)    (mostly done) ├──► 7.3 Opportunities ──► 7.7 Employer portal
                                       ├──► 7.4 Learning ──► 7.6 Certificates
                                       └──► 7.5 Portfolios
                                       └──► 7.8 Forum (late / optional)
                                       └──► 7.9 Native pay/LMS (only if needed)
```

### 7.0 Platform — status: ~90%
**Done:** dual auth collections, R2 plugin, Postgres adapter, multi-root layouts, member session helpers, middleware for admin vs member cookie.  
**Left:**
- [ ] Prove `/admin` login on Vercel end-to-end
- [ ] Optional: separate cookies for members vs staff (today shared `payload-token` — staff login overwrites member)
- [ ] Avatar upload on profile (media → R2)
- [ ] Payload email adapter (Resend) for forgot-password
- [ ] Formal migrations when CLI works (or document db:push as permanent process)
- [ ] Fix monorepo `vercel.json` confusion (root vs `web/vercel.json`) if Root Directory is mis-set

### 7.1 Portal shell — status: ~80%
**Done:** signup/login/logout, `/app` home, profile form, nav placeholders.  
**Left:**
- [ ] Avatar upload
- [ ] Stronger empty states
- [ ] Ensure production member session + profile PATCH solid
- [ ] Password reset emails when Resend ready

### 7.2 Mentor directory — **next major feature**
**Goal:** Browsable, staff-approved mentors (not form-only).

**Build:**
- [ ] Payload collections: `mentors` (relation → member), `mentorship-requests`
- [ ] Fields: topics, bio, availability, Cal.com URL, status draft/approved
- [ ] Public or member-gated `/mentors` + `/app/mentors`
- [ ] Apply to become mentor → staff approve in admin
- [ ] Request mentorship → Resend to mentor + ops
- [ ] Filters: topic, seniority, availability
- [ ] Extend/replace thin `mentorship/page.tsx` marketing intro

**Out of scope:** auto-matching, in-app video.

### 7.3 Opportunities board
- [ ] Collections: `opportunities`, `opportunity-applications`, optional `employer-orgs`
- [ ] Staff/employer post; moderation states
- [ ] Member browse/filter/apply
- [ ] Notify via Resend
- [ ] `/app/opportunities` real UI

### 7.4 Learning dashboard (light LMS)
- [ ] Collections: `enrollments`, `learning-items`, `progress`
- [ ] Cohort status + Classroom links
- [ ] Selar entitlements via webhook or staff grant
- [ ] Resource unlocks; weekly milestone checklist
- [ ] **Not** video player / quiz engine

### 7.5 Portfolio profiles
- [ ] Collection `portfolios` / case studies
- [ ] Public `/u/[handle]` with visibility private | members | public
- [ ] Media on R2
- [ ] Optional feature on marketing Stories

### 7.6 Certificates
- [ ] Collection `certificates`
- [ ] Staff issue → PDF on R2
- [ ] Public `/verify/[code]`
- [ ] List in portal

### 7.7 Employer portal (depends on 7.3)
- [ ] Employer org accounts
- [ ] Dashboard: own listings + applicants

### 7.8 Forum (late)
- Only if WhatsApp insufficient; empty forums hurt trust
- Prefer announcement archive first

### 7.9 Native payments / LMS
- Only if Selar/Classroom block growth
- Prefer webhooks + dashboard first

---

## 8. Known pitfalls (read before coding)

1. **`Users.access.admin` must return boolean staff-only.**  
   Never return `true` for `!req.user` — causes blank Dashboard on Vercel.

2. **Next.js 16 `images.localPatterns`**  
   If set, **only** listed paths work. Must include `/images/**`, `/brand/**`, and `/api/media/file/**`.

3. **Multi-root layouts**  
   No `app/layout.tsx`. Each of `(site)`, `(auth)`, `(portal)`, `(payload)` owns document shell. Don’t reintroduce nested `<html>` inside marketing body.

4. **Shared auth cookie**  
   Members and staff use `payload-token`. Middleware ignores member token on `/admin` only.

5. **Schema push**  
   `PAYLOAD_DB_PUSH=true` only for `npm run db:push`. Auto-push on connect breaks admin with slow schema pull.

6. **Node 24 + `npx payload migrate`**  
   Broken here; use db:push scripts.

7. **Import map for admin graphics**  
   `web/src/app/(payload)/admin/importMap.js` maps Logo/Icon. Paths use `@/components/payload/...`. Regenerate carefully if adding components.

8. **Branding**  
   SMN logo/icon in admin; `BrandLogo` uses `unoptimized` to avoid preload warnings.

9. **Do not expand scope into full LMS** unless product asks.

---

## 9. Suggested first Codex session

1. **Verify production `/admin`** after latest deploy; fix only if still blank (check canAccessAdmin + console/network).  
2. **Smoke test:** member signup/login, staff login, images, forms.  
3. **Start 7.2 Mentor directory** collections + `/app/mentors` list + staff approval flow.  
4. Keep marketing seed content working without requiring CMS for every page.

---

## 10. Commands cheat sheet

```bash
cd web
npm install
npm run dev              # http://localhost:3000
# Admin local:           http://localhost:3000/admin
# Member:                /signup → /app

npm run db:push          # push schema to DATABASE_URL (Postgres)
npm run db:check         # list public tables
npm run build            # production build
npx tsc --noEmit         # typecheck
```

---

## 11. Explicitly out of scope (unless product changes)

- Replacing WhatsApp with in-app chat  
- Full course player / quizzes  
- Job guarantees  
- Clerk / Auth.js for members  
- Vercel Blob instead of R2  
- Mobile native apps  

---

## 12. User / stakeholder context

- Founder instructor: **Arielle Adodo** (Ghana), LinkedIn-informed bio in content  
- Pricing shown in **GHS**  
- Community: **WhatsApp** (not Discord — ARCHITECTURE.md may still mention Discord in places; code uses WhatsApp)  
- Domain purchase pending → delay Resend + public R2 CDN until then  
- User preference: **stop stacking speculative fixes**; prefer root-cause verification (e.g. inspect production HTML/RSC for `user` and view type)

---

## 13. Open verification checklist for Codex

- [ ] Vercel deploy green after `Users.ts` boolean `admin` fix  
- [ ] `/admin` → login UI on production (private window)  
- [ ] Staff can log in and see collections  
- [ ] Member can still use `/app`  
- [ ] Homepage images load on production  
- [ ] `NEXT_PUBLIC_SITE_URL` = `https://socialmarketersnetwork.vercel.app` (or custom domain)  
- [ ] Neon + R2 env complete on Vercel  
- [ ] Uncommitted local diffs reviewed (git status may show WIP on newsletter, Members, Users, LoginForm, HeroPhotoGallery)

---

*End of handoff. Prefer this file + `PRODUCT-ROADMAP.md` + `web/README.md` as the source of truth for remaining work.*
