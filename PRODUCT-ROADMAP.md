# SMN Product Roadmap (Phase 7+)

Post-MVP network product. Marketing site remains public; authenticated product lives under `/app`.

## Locked decisions

| Area | Choice |
|------|--------|
| Member auth | **Payload** `members` collection (separate from staff `users`) |
| Staff CMS | Payload `users` â†’ `/admin` |
| Media | **Cloudflare R2** (S3 adapter) when env configured |
| Hosting | Vercel (`web` root) |
| Production DB | Postgres (`DATABASE_URL`) |

## Phases

| Phase | Status | Summary |
|-------|--------|---------|
| **7.0 Platform** | In progress | Dual auth, R2-ready media, Postgres-ready DB |
| **7.1 Portal shell** | In progress | Login/signup, `/app` home, profile, placeholders |
| **7.2 Mentor directory** | Implemented | Approved mentors, applications, filters, requests |
| **7.3 Opportunities** | Implemented | Moderated job/gig board with public ATS imports |
| **7.4 Learning dashboard** | Implemented | Enrollments, Classroom/Selar access, milestones, progress |
| **7.5 Portfolios** | Implemented | Member case studies, public `/u/[handle]`, 10 MB upload or cover URL |
| **7.6 Certificates** | Planned | PDF on R2 + `/verify/[code]` |
| **7.7 Employer portal** | Planned | Thin employer dashboard |
| **7.8 Forum** | Optional / late | Prefer WhatsApp until demand is clear |
| **7.9 Native payments/LMS** | Conditional | Only if Selar/Classroom block growth |

## Dependency graph

```text
7.0 â†’ 7.1 â†’ 7.2 mentors
           â†’ 7.3 jobs â†’ 7.7 employers
           â†’ 7.4 learning â†’ 7.6 certs
           â†’ 7.5 portfolios
```

## Env (product)

See `web/.env.example` for `DATABASE_URL`, R2_*, and existing Resend/Mailchimp vars.

## Verification checklist (7.0â€“7.1)

- [ ] Staff create first user at `/admin`
- [ ] Member signup at `/signup` â†’ lands on `/app`
- [ ] Member cannot open `/admin`
- [ ] Profile save via `/app/profile`
- [ ] Logout returns to login
- [ ] With Postgres URL, app uses Postgres adapter
- [ ] With R2 env, Media uploads go to R2

## Phase 7.2 delivery

- Staff-managed `mentors` and `mentorship-requests` collections
- Member mentor applications with draft/approval workflow
- Approved-only member directory with specialty search and filters
- Authenticated mentorship requests with staff moderation states
- Optional Resend notification to operations
- Public mentorship pages connected to the member workflow

## Phase 7.3 delivery

- Staff-managed manual, partner, and imported opportunities
- Greenhouse, Lever, and Ashby public job-board importers
- Daily secured Vercel cron with relevance scoring, deduplication, and stale closure
- Pending-review moderation by default with per-source trusted auto-publishing
- Member search, filters, detail pages, external application handoff, and activity tracking

## Phase 7.4 delivery

- Staff-managed enrollments for cohorts, Selar purchases, workshops, and community tracks
- Published learning items grouped by stable program keys and week
- Classroom, external course, and gated resource links
- Member progress checklist with server-side entitlement validation
- Staff grant flow for Selar entitlements; native playback and quizzes remain out of scope
