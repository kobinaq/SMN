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
| **8.0 AI governance foundation** | In progress | Provider-independent runtime, policy, usage controls, privacy records, and approved retrieval |
| **8.1 Course-aware AI Tutor** | In progress | Grounded lesson help with citations, course isolation, feedback, and instructor controls |
| **8.2 Instructor Content Studio** | In progress | Structured, reviewable course drafts with provenance and no automatic publishing |
| **8.3 AI Career Coach** | In progress | Transparent profile, learning, portfolio, and opportunity guidance with confirmed saves |

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

## AI-Enabled Learning and Career Intelligence

This program extends the existing member, learning, mentorship, portfolio, certificate, and opportunity foundations. It is an assisted workflow, not an autonomous decision-maker. Every generated artifact remains a draft until a person reviews the result, and the server blocks AI from publishing content, grading, issuing credentials, deciding mentorship, applying for work, or changing protected member data.

### Status model

Roadmap work uses `Planned`, `In progress`, `Internal testing`, `Private beta`, `Public beta`, `Generally available`, `Paused`, or `Retired`. A phase only advances when its acceptance criteria and required safety tests are evidenced. Current AI phases are `In progress`; none are beta-ready until the final readiness review.

### Phase 8.0 — AI governance foundation

Dependencies: member/staff authorization, Postgres, approved LMS content, audit events, environment-managed provider configuration, and privacy documentation.

Acceptance criteria:

- Provider-independent text, structured-output, streaming, tool, usage, timeout, and error contracts; the Groq SDK is isolated to one adapter.
- Environment-specific model aliases validated at startup, with no feature-level model IDs or secrets.
- Server-side authentication, role authorization, schema validation, per-user limits, bounded context, timeouts, audit metadata, and configurable retention.
- Approved-material retrieval enforces course entitlement and returns citations; unsupported answers are declined.
- Policy tests prove prohibited high-impact actions cannot be invoked through AI routes or tools.

Risks and controls: prompt injection is contained by treating retrieved text as untrusted data; privacy exposure is reduced through field allowlists, redaction, short retention, and aggregate reporting; provider failure uses explicit degraded states rather than invented results; cost and latency are constrained by quotas, timeouts, and usage telemetry.

### Phase 8.1 — Course-aware AI Tutor

Dependencies: Phase 8.0, published LMS material, lesson entitlement, and staff-configured Tutor availability.

Acceptance criteria:

- Explanation, simplification, example, summary, revision, Socratic, answer-feedback, comparison, and next-lesson modes cite approved course sources.
- Retrieval is isolated to the active entitled course and resists instructions embedded in course content.
- Lesson and course UI includes suggestions, source links, reset, feedback, privacy messaging, recoverable errors, and accessible mobile behavior.
- The Tutor declines unsupported claims and assignment-completion requests and never exposes another learner’s conversation.
- Instructors see privacy-preserving topic/feedback aggregates, not casual transcript access.

Success measures: grounded-response rate, citation coverage, helpful-feedback ratio, unsupported-answer decline rate, active-course isolation failures (target zero), median latency, timeout rate, and weekly learners helped. Metrics exclude full prompt/response bodies by default.

### Phase 8.2 — Instructor AI Content Studio

Dependencies: Phases 8.0–8.1, Course Builder permissions, draft/version models, and structured schemas.

Acceptance criteria:

- Authorized learning staff can draft course outlines, lessons, examples, quizzes, rubrics, revisions, and FAQs using validated controls and automatic course context.
- Quiz, rubric, and lesson-outline generation use separate strict schemas and reject malformed provider output.
- Staff can preview, edit, regenerate, compare, select, reject, and save a versioned draft with provenance.
- Generated material never auto-publishes and cannot bypass publication readiness gates.

Success measures: accepted-draft ratio, edited-before-save ratio, time to first usable draft, schema failure rate, generation latency, and number of drafts published only after ordinary human review.

### Phase 8.3 — AI Career Coach

Dependencies: Phase 8.0, member profile and goal consent, enrollments, certificates, public portfolios, and moderated opportunities.

Acceptance criteria:

- A dedicated member area summarizes opted-in profile, skills, learning, credentials, portfolio, goals, mentorship, and opportunity context.
- Opportunity matching is deterministic and inspectable before an LLM explains matches, gaps, and relevant learning; language never promises employment outcomes.
- Tools are allowlisted, authenticated, narrowly scoped, and read-only except for an explicit confirmed goal or plan save.
- Members can review recommendations, gaps, learning, portfolio guidance, plans, conversation, saved items, reset state, and manage retained data on mobile.

Success measures: recommendation saves, plan confirmations, opportunity-detail visits, learning starts from recommendations, transparent match coverage, helpful-feedback ratio, reset/deletion completion, latency, and tool-policy violations (target zero).

### Release gates and sequencing

```text
8.0 governance -> 8.1 Tutor -> 8.2 Content Studio
               -> 8.3 Career Coach
```

Internal testing requires mocked provider, retrieval, schema, timeout, limit, injection, permission, minimization, and fallback suites. Private beta additionally requires current privacy copy, retention/deletion operations, monitored quotas, accessible mobile flows, staff guidance, incident ownership, and a rollback flag for every AI surface. Public beta requires evidence from private beta, acceptable safety/quality metrics, support readiness, and explicit product approval. No release gate depends on a real-provider call in normal CI.
