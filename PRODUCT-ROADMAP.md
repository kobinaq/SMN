# SMN Product Roadmap

**Updated:** 2026-07-13

SMN now operates as a public marketing-community website plus an authenticated network product. The roadmap distinguishes implementation state from release evidence: a feature can be implemented while static, migration, browser, production, or beta gates remain open.

## Product foundations

| Area | Current decision |
|---|---|
| Member identity | Payload `members`, separate from staff `users` |
| Staff operations | Payload `/admin` with workflow-first custom views and advanced collection fallbacks |
| Database | PostgreSQL in production; SQLite disposable E2E/local fallback |
| Media | Payload Media with Cloudflare R2 when configured |
| LMS video | Unlisted YouTube through `youtube-nocookie.com` |
| LMS files | Payload Media/R2 attachments |
| Course access | Member/cohort rules and enrollment `programKey` grants |
| Community | WhatsApp integration |
| Commerce/live cohort | Selar and Google Classroom integrations |
| AI | Provider-independent runtime; Groq is one adapter; every surface has a rollback flag |

## Delivery state

| Phase | Implementation | Release state | Delivered capability |
|---|---|---|---|
| 7.0 Platform | Implemented | Production verification | Dual auth, separated cookies, Postgres/SQLite adapter, R2-ready media, multi-root Next layouts, environment validation |
| 7.1 Member portal | Implemented | Production verification | Auth, home, profile, mentors, opportunities, learning, portfolio, certificates, Career Coach navigation |
| 7.2 Mentorship | Implemented | Verification | Applications, approved directory, requests, capacity, relationships, transitions, feedback, notifications, operations workspace |
| 7.3 Opportunities | Implemented | Verification | Manual/imported listings, ATS sync, moderation, deduplication, expiry, source health, member activity |
| 7.4 Learning and LMS | Implemented | Verification | Enrollments, milestones, courses, modules, lessons, video/player, attachments, progress, completion, readiness, analytics |
| 7.5 Portfolios | Implemented | Verification | Member case studies, visibility, public profile output, Media/R2 or URL covers |
| 7.6 Credentials | Implemented | Verification | Eligibility, bulk issuance, duplicate prevention, notifications, reissue/revoke, PDF/media, public verification |
| 7.7 Workflow admin | Implemented | Verification | Overview, Course Builder, Member 360, Mentorship/Opportunity Operations, Certificate Issuing, grouped navigation, staff matrix |
| 8.0 AI governance | Implemented | Internal verification | Provider contracts, policy, privacy records, quotas, timeout/errors, feedback, deletion, approved retrieval |
| 8.1 Course Tutor | Implemented | Internal verification | Nine grounded modes, citations, course isolation, controls/reporting, feedback, privacy/mobile UI |
| 8.2 Content Studio | Implemented | Internal verification | Course-aware text and strict structured drafts, controls, compare/review/save, provenance/versioning |
| 8.3 Career Coach | Implemented | Internal verification | Deterministic matching, explanations, gaps/learning, conversation, confirmed goals/plans, privacy controls |

## Workflow administration outcomes

### Course Builder

- Overview, Curriculum, Learners, Assessments, Analytics, Settings, and AI Content Studio tabs.
- Publication readiness and server-side readiness enforcement.
- Nested reorder/move/duplicate/delete operations with ownership checks and compensation.
- Completion automation, inactivity and certificate-eligibility derivation.
- Reasoned staff overrides with actor, time, before/after state, and audit record.
- Enrollment, activity, completion, drop-off, abandonment, and inactivity analytics.

### Member, mentorship, opportunity, and credential operations

- Member 360 combines profile, learning, credentials, portfolio, mentorship, opportunities, activity, and authorized private notes.
- Mentorship Operations covers applications, request lifecycle, mentor capacity, active relationships, feedback, audit, and notifications.
- Opportunity Operations covers moderation, expiry, applications, duplicate fingerprints, source health, and import failures.
- Certificate Issuing covers eligible completion selection, bulk issuance, active duplicate prevention, issuer/source records, notifications, reissue, revoke, audit, and compensation.

### Staff authorization

The server-enforced roles are super-admin, content, learning, mentorship, opportunity, support, and analyst. Navigation visibility is presentation only; collection access and every custom mutation revalidate authorization.

## AI-enabled learning and career intelligence

AI is an assisted layer over the existing LMS, member, portfolio, credential, mentorship, and opportunity data. Generated material remains subject to human review. The server policy blocks publishing, credential issuance, grading, mentorship decisions, job applications, employment decisions, and protected member-data changes through AI actions.

### 8.0 Governance and retrieval

Delivered:

- Text, structured-output, streaming, tool-definition, usage, latency, timeout, and safe-error interfaces.
- Environment model aliases and an isolated Groq HTTP adapter.
- Auth, role checks, schema validation, input limits, per-actor quotas, bounded timeouts, opaque actor identifiers, prompt hashes, retention expiry, feedback, and deletion.
- Approved-material retrieval with entitlement, strict course filtering, unsafe-source screening, deterministic ranking, source delimiters, citations, and unsupported-answer decline.
- Privacy-minimized events containing operational metadata rather than full prompt/response bodies.

### 8.1 Course-aware Tutor

Delivered:

- Explain, simplify, example, summary, revision, Socratic, answer-feedback, comparison, and next-lesson modes.
- Contextual lesson drawer, suggestions, sources, reset, feedback, recoverable errors, privacy copy, and responsive behavior.
- Course-level enablement/mode/guidance controls and aggregate usage/feedback/FAQ reporting.

### 8.2 Instructor Content Studio

Delivered:

- Course outline, lesson outline, lesson, example, quiz, rubric, revision, and FAQ drafts.
- Audience, level, context, tone, length, difficulty, example, outcome, assessment, marks, and count controls.
- Separate strict quiz, rubric, and outline schemas.
- Generate/regenerate, compare, select, reject, edit, explicitly save, provenance, and draft versions.

### 8.3 Career Coach

Delivered:

- Member skills/interests/goals, learning, certificates, public portfolio, and published opportunity context.
- Deterministic opportunity scores with visible evidence, gaps, and relevant learning before model explanation.
- Minimized authenticated conversation, goal/plan confirmation, saved state, feedback, reset, and retained-data deletion.

## Metrics and release gates

Definitions are in `docs/success-metrics.md`. The primary signals are workflow queue resolution, readiness, override rates, mentorship throughput, opportunity/source health, credential integrity, Tutor grounding/citations/declines/feedback, Content Studio generation-to-save conversion and schema failures, and Career Coach explanation/conversation/saves/feedback/reset outcomes.

### Internal verification gate

- Generated types and import map are current.
- TypeScript and ESLint pass.
- Mocked provider, schema, timeout, limit, injection, prohibited action, permission, minimization, retrieval isolation, citation, recommendation, and fallback tests pass.
- Production build passes.
- Disposable seeded Playwright workflows pass.
- Migration baseline succeeds on disposable PostgreSQL.

### Production schema gate

- Backup and maintenance plan recorded.
- Final schema applied with AI flags false.
- Required collection/column reads pass.
- Existing database adopts the committed baseline through the guarded runbook.
- `db:migrate` reports no pending baseline migration.

### Private AI beta gate

- Internal verification and production schema gates pass.
- Privacy copy, retention/deletion behavior, quota monitoring, accessible mobile/keyboard behavior, support guidance, incident ownership, and rollback flags are reviewed.
- Pilot feedback and failure/latency/grounding metrics have an assigned reviewer.

### Public release gate

- Private-beta evidence is reviewed.
- Safety, quality, reliability, support, content, external integration, and legal checks meet the approved thresholds.
- R122’s final 16-part readiness report records the decision and evidence.

## Current next checkpoint

Implementation is complete through R121. Verification is active: generated types/import map and the migration baseline exist; the first strict typecheck exposed relationship/draft typing issues and fix batches are partially applied. The incoming agent should follow `HANDOFF-CODEX.md` and finish typecheck, lint, unit, build, E2E, disposable PostgreSQL migration proof, production baseline adoption, and R122.
