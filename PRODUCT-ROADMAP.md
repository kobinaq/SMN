# SMN Product Roadmap (Phase 7+)

Post-MVP network product. Marketing site remains public; authenticated product lives under `/app`.

## Locked decisions

| Area | Choice |
|------|--------|
| Member auth | **Payload** `members` collection (separate from staff `users`) |
| Staff CMS | Payload `users` → `/admin` |
| Media | **Cloudflare R2** (S3 adapter) when env configured |
| Hosting | Vercel (`web` root) |
| Production DB | Postgres (`DATABASE_URL`) |

## Phases

| Phase | Status | Summary |
|-------|--------|---------|
| **7.0 Platform** | In progress | Dual auth, R2-ready media, Postgres-ready DB |
| **7.1 Portal shell** | In progress | Login/signup, `/app` home, profile, placeholders |
| **7.2 Mentor directory** | Planned | Approved mentors, requests |
| **7.3 Opportunities** | Planned | Job/gig board |
| **7.4 Learning dashboard** | Planned | Classroom links, Selar entitlements |
| **7.5 Portfolios** | Planned | Public `/u/[handle]` |
| **7.6 Certificates** | Planned | PDF on R2 + `/verify/[code]` |
| **7.7 Employer portal** | Planned | Thin employer dashboard |
| **7.8 Forum** | Optional / late | Prefer WhatsApp until demand is clear |
| **7.9 Native payments/LMS** | Conditional | Only if Selar/Classroom block growth |

## Dependency graph

```text
7.0 → 7.1 → 7.2 mentors
           → 7.3 jobs → 7.7 employers
           → 7.4 learning → 7.6 certs
           → 7.5 portfolios
```

## Env (product)

See `web/.env.example` for `DATABASE_URL`, R2_*, and existing Resend/Mailchimp vars.

## Verification checklist (7.0–7.1)

- [ ] Staff create first user at `/admin`
- [ ] Member signup at `/signup` → lands on `/app`
- [ ] Member cannot open `/admin`
- [ ] Profile save via `/app/profile`
- [ ] Logout returns to login
- [ ] With Postgres URL, app uses Postgres adapter
- [ ] With R2 env, Media uploads go to R2
