# SMN Workflow-First Admin Architecture

## Original admin state (2026-07-12)

Payload is correctly established as the system of record, authentication and authorization layer, API, and staff UI. The data model is sensibly separated into members, mentors, mentorship requests, opportunities and sources, enrollments, LMS courses/modules/lessons/progress, portfolios, certificates, media, and public content.

The admin experience is still primarily collection-first. A custom `AdminDashboard` is inserted before Payload's default dashboard and shows four counts plus five links, but it does not replace the dashboard or provide workflow health, recent activity, course readiness, or cross-collection operations. Standard collection screens remain the only way to manage most related records.

## Relationship map

```text
members
  -> mentors (one profile per member)
  -> mentorship-requests.requester
  -> enrollments (programKey grants)
  -> lms-lesson-progress
  -> opportunity-applications
  -> portfolios
  -> certificates

lms-courses
  -> lms-modules.course
  -> lms-lessons.course
  -> lms-lesson-progress.course
  -> enrollments by programKey (logical link, not a relationship)

lms-modules
  -> lms-lessons.module

opportunity-sources
  -> opportunities.source
  -> opportunity-applications.opportunity
```

## Problem classification

### Interface problems

- Staff must traverse separate course/module/lesson screens.
- Member context is distributed across at least seven collections.
- Mentorship and opportunity operations require repeated filtered-list navigation.
- Certificate creation is a raw record form rather than an eligibility workflow.
- Navigation groups are partly technical (`Network`, `Admin`) rather than consistently task-oriented.

These should be solved with custom Payload views/components backed by Local API calls that run with the authenticated staff user and `overrideAccess: false`. Default collection screens remain available as advanced fallback.

### Workflow problems

- Course publication has no readiness gate.
- Progress completion is recorded per lesson, but enrollment completion and certificate eligibility are not automatically derived.
- Administrative corrections have no reasoned override/audit workflow.
- Mentor approval records approver/time, but rejection explanations and general audit events are absent.
- Imported-opportunity review has no unified source-health and duplicate-review surface.
- Certificate issuance has no multi-learner wizard, duplicate policy, or safe reissue flow.

### Genuine data-model gaps

- LMS course metadata: instructor, category, description/body, learning outcomes, prerequisites, enrollment settings, certificate settings, preview/readiness state, and AI tutor controls.
- Enrollment/activity: explicit LMS course relation or durable key policy, started/last-activity/completed timestamps, derived completion state.
- Audit/activity: actor, action, entity, before/after summary, reason, visibility, timestamp.
- Member support: private authored/timestamped staff notes.
- Mentorship operations: capacity, relationship lifecycle, responses, and feedback.
- Certificates: issuing staff, source course/enrollment, reissue/revocation metadata.
- AI: usage records, retention controls, career goals/plans, and course-approved retrieval material metadata.

Schema changes will be introduced only alongside a reviewed migration/schema-push plan and tests. No collection will be merged merely to simplify the UI.

## Target admin information architecture

- **Overview:** workflow dashboard, recent activity, platform health
- **Learning:** Course Builder, learner progress, advanced LMS collections
- **Members:** Member 360, members, portfolios, enrollments
- **Mentorship:** operations workspace, mentors, requests, relationships
- **Opportunities:** operations workspace, listings, applications, sources
- **Credentials:** issuing wizard, certificates
- **Content:** posts, courses catalogue, events, stories, resources, media
- **Website:** site settings
- **System:** users, audit events, AI usage, jobs/integration health

## Security architecture

- Every custom view requires a staff session.
- Every mutation revalidates role and arguments on the server.
- Local API calls use the current user with access control enabled.
- Browser components receive only the minimum data needed for the workflow.
- Consequential actions require confirmation and produce audit records.
- AI may propose drafts or explanations but cannot publish, issue credentials, approve mentors, apply for jobs, or mutate protected member data without explicit authorized confirmation.

## Delivery sequence

1. Replace the dashboard and establish reusable workflow-shell patterns.
2. Add the minimum audited schema needed for Course Builder and progress automation.
3. Deliver Course Builder, then Member 360, mentorship, opportunities, and certificates.
4. Harden navigation and standard screens.
5. Complete workflow E2E coverage before declaring the admin overhaul complete.
6. Add the provider-independent AI foundation and then Tutor, Content Studio, and Career Coach in that order.

## Implemented state (2026-07-13)

The workflow-first dashboard and all five operations workspaces are implemented. Course Builder includes readiness, curriculum actions, audited progress correction, analytics, Tutor controls/reporting, and Content Studio. Member 360, mentorship, opportunity, and certificate operations use authenticated Local/API calls, explicit confirmation, compensating or transactional writes where appropriate, and audit events.

Navigation groups now follow the target information architecture. Standard collection screens remain available for advanced record work. The enforced staff matrix is:

| Role | Primary responsibility |
|---|---|
| super-admin | All domains and staff administration |
| content | Posts, resources, media, catalogue, events, stories, website content |
| learning | LMS, enrollments, progress, certificates, approved AI sources/drafts |
| mentorship | Mentors, requests, relationships |
| opportunity | Listings, sources, applications |
| support | Member support, private notes, allowed enrollment/progress/application support |
| analyst | Read-only operational and aggregate reporting access |

Server-side collection wrappers and custom-route checks enforce these responsibilities; hiding navigation is not treated as authorization. Workflow audit and AI metric definitions are in `docs/success-metrics.md`. Everyday use and incident procedures are in `docs/staff-guide.md`.
