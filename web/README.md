# Social Marketers Network — Website

Premium marketing-community site for SMN.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- **Payload CMS 3** (SQLite locally; Postgres in production; admin at `/admin`)
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
- CMS: [http://localhost:3000/admin](http://localhost:3000/admin) — create first **staff** user on first visit
- Member portal: [http://localhost:3000/login](http://localhost:3000/login) → `/app` after signup

Copy `.env.example` → `.env` / `.env.local`. Without Resend/Mailchimp keys, forms log to the server console.

Marketing pages fall back to seed data in `src/lib/content.ts` when CMS collections are empty.

### Auth model

| Collection | Who | Surfaces |
|------------|-----|----------|
| `users` | Staff | `/admin` only |
| `members` | Network members | `/login`, `/signup`, `/app/*` |

Members cannot open the Payload admin. Staff manage members under **Network → Members** in admin.

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

- `PAYLOAD_SECRET` — long random string
- `NEXT_PUBLIC_SITE_URL` — your `https://….vercel.app` (or custom domain)

Optional: Resend, Mailchimp, WhatsApp invite, `OPS_EMAIL`.

### Production product stack

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | `postgresql://…` (Neon/Supabase) |
| `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_ENDPOINT` | Cloudflare R2 media |
| `R2_PUBLIC_URL` | Public CDN URL for media (optional but recommended) |
| `PAYLOAD_SECRET` | Required |

Without R2, media uses local disk (or is disabled on Vercel). Without Postgres, use SQLite locally; Vercel marketing still uses seed content unless a remote DB is set.

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Storytelling homepage |
| `/admin` | Payload CMS (staff) |
| `/login` `/signup` | Member auth |
| `/app` | Member portal home |
| `/app/profile` | Member profile |
| `/programs/cohort` | Flagship cohort |
| `/programs/courses` | Selar catalogue |
| `/apply` | Cohort application |
| `/community` | WhatsApp CTA |
| `/employers` | Partner / talent forms |

## CMS collections

**Users** (staff), **Members** (portal), Media, Posts, Courses, Events, Stories, Resources + global **Site Settings**.

See repo root `PRODUCT-ROADMAP.md` for Phase 7+ (mentors, jobs, learning, certs).
