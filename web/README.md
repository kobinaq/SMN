# Social Marketers Network — Website

Premium marketing-community site for SMN.

Current operational sources of truth: `../docs/staff-guide.md`, `../docs/ai-architecture.md`, `../docs/database-migrations.md`, `../docs/success-metrics.md`, and `../docs/testing.md`.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- **Payload CMS 3** (SQLite locally; Postgres in production; staff app at `/staff`; Payload admin chrome retired)
- **Member auth** via Payload `members` collection (portal at `/app`)
- **Cloudflare R2** for media when configured (S3-compatible)
- GSAP + Lenis (scroll storytelling + page transitions)
- Resend (form email)
- Mailchimp (newsletter)
- Selar (course checkout links)
- WhatsApp (community)
- Vercel-ready

## Develop

```bash
cd web
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- Staff: [http://localhost:3000/staff](http://localhost:3000/staff) — create first **staff** user on first visit at `/staff/login`
- Member portal: [http://localhost:3000/login](http://localhost:3000/login) → `/app` after signup

Copy `.env.example` → `.env` / `.env.local`. Without Resend/Mailchimp keys, forms log to the server console.

Marketing pages fall back to seed data in `src/lib/content.ts` when CMS collections are empty.

### Auth model

| Collection | Who | Surfaces |
|------------|-----|----------|
| `users` | Staff | `/staff` (canonical); `/admin` redirects |
| `members` | Network members | `/login`, `/signup`, `/app/*` |

Members cannot open the staff app. Staff manage members under **Members** in `/staff`.

## Deploy on Vercel

The Next.js app is in the **`web`** folder (not the repo root).

### Required project settings

| Setting | Value |
|--------|--------|
| **Framework Preset** | Next.js |
| **Root Directory** | `web` |
| **Build Command** | `npm run build` (default) |
| **Install Command** | `npm install` (default) |
| **Output Directory** | leave default (do not set) |

**Root Directory is the usual cause of a Vercel 404** when the repo root only has `web/` + docs.

1. Vercel → Project → **Settings → General → Root Directory**
2. Set to `web` → Save
3. **Deployments → Redeploy** the latest commit

### Environment variables (Production)

At minimum:

- `PAYLOAD_SECRET` — long random string (**same as local** if you share the Neon DB)
- `NEXT_PUBLIC_SITE_URL` — full origin, e.g. `https://your-app.vercel.app` (required for staff cookies & server actions)
- `DATABASE_URL` — Neon Postgres URL

Optional: Resend, Mailchimp, WhatsApp invite, `OPS_EMAIL`.

### Production product stack

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | `postgresql://…` (Neon/Supabase) |
| `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` | Cloudflare R2 media |
| `R2_PUBLIC_URL` | Public CDN URL for media (optional but recommended) |
| `PAYLOAD_SECRET` | Required |

Without R2, media uses local disk (or is disabled on Vercel). Without Postgres, use SQLite locally; Vercel marketing still uses seed content unless a remote DB is set.

### Database schema (production Postgres)

The stock Payload CLI loader breaks on Node 24, so project scripts bundle the config and call the installed ESM migration API:

```bash
cd web
npm run db:migrate # apply committed migrations
npm run db:check   # list public tables
```

Ensure `DATABASE_URL` is your Neon/Postgres URL and `PAYLOAD_SECRET` matches Vercel when targeting that DB.

Schema push is **opt-in** (`PAYLOAD_DB_PUSH=true` only during `db:push`). The app does not push on every request — that was slow and could break staff auth surfaces.

For Neon, either the **pooled** or **direct** connection string works; if queries flake, try the direct (non-`-pooler`) URL.

### Current migration policy

A full PostgreSQL baseline is committed under `src/migrations`. Use `npm run db:migrate` for fresh and already-migrated databases, and create reviewed future snapshots with `npm run db:migrate:create -- concise_name`.

Existing production predates that baseline. Do not replay the full baseline over its tables; follow the guarded push/verify/adopt procedure in `../docs/database-migrations.md`. Normal app startup keeps schema push disabled.

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Storytelling homepage |
| `/staff` | Staff app (ops + CMS) |
| `/admin` | Redirects to `/staff` (legacy Payload UI only if `STAFF_LEGACY_ADMIN=true`) |
| `/login` `/signup` | Member auth |
| `/app` | Member portal home |
| `/app/profile` | Member profile |
| `/programs/cohort` | Flagship cohort |
| `/programs/courses` | Selar catalogue |
| `/apply` | Cohort application |
| `/community` | WhatsApp CTA |
| `/employers` | Partner / talent forms |

## CMS collections

Collections cover staff/users, members, media/content/site settings, mentorship, opportunities, enrollments/learning/LMS/progress, portfolios, certificates, audit events, and AI usage/feedback/knowledge/drafts/career state.

See repo root `PRODUCT-ROADMAP.md` for the current delivery and release state.

## Workflow admin and AI

Staff start with the workflow-first Overview and use Course Builder, Member 360, Mentorship Operations, Opportunity Operations, and Certificate Issuing. Tutor, Content Studio, and Career Coach use a provider-independent runtime and independent feature flags; all remain disabled by default until their release gate is approved.
## Automated opportunity sources

Phase 7.3 can import public marketing roles from Greenhouse, Lever, and Ashby without API keys.

1. Set `CRON_SECRET` in Vercel to a random value of at least 16 characters.
2. In Payload admin, open **Opportunities → Opportunity Sources**.
3. Add a company, choose its ATS, and enter the public board identifier:
   - Greenhouse: the token in `boards.greenhouse.io/<token>`
   - Lever: the site name in `jobs.lever.co/<site>`
   - Ashby: the board name in `jobs.ashbyhq.com/<board>`
4. Leave **Auto publish** off until the source has produced consistently relevant results.
5. Imported roles appear under **Opportunities → Opportunities** as `pending` for staff review.

Vercel calls `/api/cron/sync-opportunities` daily at 05:00 UTC. Imported applications always continue on the employer's original site; SMN stores only member activity status.
## Learning dashboard operations

The learning product combines external Selar/Classroom access with SMN enrollments, milestones, and the native LMS course/module/lesson/progress foundation.

1. In **Learning → Learning Items**, create published milestones/resources with a stable `programKey` such as `cohort-2026` or `ai-marketers`.
2. In **Learning → Enrollments**, link a member to the same `programKey`, choose the grant source, and add Classroom/Selar URLs.
3. Active or completed enrollments unlock matching items in `/app/learning`.
4. Use access rule **Any member** for general onboarding, **Matching enrollment** for paid programs, and **Active/completed cohort member** for cohort-wide material.
5. Member completion is stored under **Learning → Progress**.

Selar purchases are granted manually for now by creating an enrollment with source **Selar purchase** and optionally storing the order reference. A verified Selar webhook can automate this later without changing the dashboard model.
