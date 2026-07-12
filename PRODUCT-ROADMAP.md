# SMN Product Roadmap (Phase 7+)

Post-MVP network product. Marketing site remains public; authenticated product lives under `/app`.

## Locked Decisions

| Area | Choice |
|------|--------|
| Member auth | **Payload** `members` collection, separate from staff `users` |
| Staff CMS | Payload `users` -> `/admin` |
| Media | **Cloudflare R2** through the Payload S3 adapter when env is configured |
| Video lessons | **Unlisted YouTube** embeds, not self-hosted video |
| Hosting | Vercel, with `web` as the root |
| Production DB | Postgres through `DATABASE_URL` |

## Phases

| Phase | Status | Summary |
|-------|--------|---------|
| **7.0 Platform** | In progress | Dual auth, R2-ready media, Postgres-ready DB |
| **7.1 Portal shell** | In progress | Login/signup, `/app` home, profile, placeholders |
| **7.2 Mentor directory** | Implemented | Approved mentors, applications, filters, requests |
| **7.3 Opportunities** | Implemented | Moderated job/gig board with public ATS imports |
| **7.4 Learning dashboard** | Implemented | Enrollments, Classroom/Selar access, milestones, progress |
| **7.5 Portfolios** | Implemented | Member case studies, public `/u/[handle]`, 10 MB upload or cover URL |
| **7.6 Certificates** | Implemented | Staff-issued credentials, PDF on R2/media, public `/verify/[code]` |
| **7.7 LMS** | Implemented foundation | Courses, modules, YouTube lessons, R2 attachments, member progress |
| **7.8 Employer portal** | Planned | Thin employer dashboard |
| **7.9 Forum** | Optional / late | Prefer WhatsApp until demand is clear |
| **7.10 Native payments** | Conditional | Only if Selar blocks growth |

## Dependency Graph

```text
7.0 -> 7.1 -> 7.2 mentors
          -> 7.3 jobs -> 7.8 employers
          -> 7.4 learning -> 7.6 certificates -> 7.7 LMS
          -> 7.5 portfolios
```

## Env

See `web/.env.example` for `DATABASE_URL`, R2 variables, and existing Resend/Mailchimp variables.

No YouTube API key is required for LMS video playback. Staff paste unlisted YouTube watch/share/embed URLs into lessons. Other lesson files use Media/R2.

## Verification Checklist

- [ ] Staff create first user at `/admin`
- [ ] Member signup at `/signup` -> lands on `/app`
- [ ] Member cannot open `/admin`
- [ ] Profile save via `/app/profile`
- [ ] Logout returns to login
- [ ] With Postgres URL, app uses Postgres adapter
- [ ] With R2 env, Media uploads go to R2

## Phase 7.2 Delivery

- Staff-managed `mentors` and `mentorship-requests` collections
- Member mentor applications with draft/approval workflow
- Approved-only member directory with specialty search and filters
- Authenticated mentorship requests with staff moderation states
- Optional Resend notification to operations
- Public mentorship pages connected to the member workflow

## Phase 7.3 Delivery

- Staff-managed manual, partner, and imported opportunities
- Greenhouse, Lever, and Ashby public job-board importers
- Daily secured Vercel cron with relevance scoring, deduplication, and stale closure
- Pending-review moderation by default with per-source trusted auto-publishing
- Member search, filters, detail pages, external application handoff, and activity tracking

## Phase 7.4 Delivery

- Staff-managed enrollments for cohorts, Selar purchases, workshops, and community tracks
- Published learning items grouped by stable program keys and week
- Classroom, external course, and gated resource links
- Member progress checklist with server-side entitlement validation
- Staff grant flow for Selar entitlements

## Phase 7.6 Delivery

- Staff-managed `certificates` collection for member credentials
- PDF attachment through existing Media/R2 pipeline
- Member certificate shelf at `/app/certificates`
- Public verification page at `/verify/[code]` for valid public credentials
- Revoked, draft, and private certificates stay hidden from public verification

## Phase 7.7 Delivery

- LMS course structure: `lms-courses`, `lms-modules`, `lms-lessons`, and `lms-lesson-progress`
- Course access uses existing enrollment `programKey` grants
- Video lessons store unlisted YouTube URLs and embed through `youtube-nocookie.com`
- Lesson attachments use the existing Media/R2 pipeline for PDFs, templates, and other files
- Member course library at `/app/learning/courses`
- Course syllabus and lesson player with per-member completion tracking
- Quizzes, comments, automated certificate issuance, and payments are later LMS layers
