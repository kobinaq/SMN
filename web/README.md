# Social Marketers Network — Website

Premium marketing-community site for SMN.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- **Payload CMS 3** (SQLite locally; admin at `/admin`)
- GSAP + Lenis (scroll storytelling + page transitions)
- Resend (form email)
- Mailchimp (newsletter)
- Selar (course checkout links)
- Discord (community)
- Vercel-ready

## Develop

```bash
cd web
npm install
npm run dev
```

- Site: [http://localhost:3000](http://localhost:3000)
- CMS: [http://localhost:3000/admin](http://localhost:3000/admin) — create first user on first visit

Copy `.env.example` → `.env` / `.env.local`. Without Resend/Mailchimp keys, forms log to the server console.

Pages fall back to seed data in `src/lib/content.ts` when CMS collections are empty.

## Key routes

| Path | Purpose |
|------|---------|
| `/` | Storytelling homepage |
| `/admin` | Payload CMS |
| `/programs/cohort` | Flagship cohort |
| `/programs/courses` | Selar catalogue |
| `/apply` | Cohort application |
| `/community` | Discord CTA |
| `/employers` | Partner / talent forms |

## CMS collections

Users, Media, Posts, Courses, Events, Stories, Resources + global **Site Settings**.
