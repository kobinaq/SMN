# SMN Staff Application Architecture

**Updated:** 2026-07-21

The staff product is the custom /staff application. Payload remains the data, API, auth, access-control, and migration layer. /admin redirects to /staff unless emergency legacy mode is enabled.

## Information architecture

| Workspace | Purpose |
|---|---|
| Today | Action queues, platform signals, and recent changes |
| Learning | Course Builder, curriculum, lesson assets, learners, progress, analytics, AI drafts |
| People | Member search and cross-domain Member 360 context |
| Mentorship | Applications, capacity, requests, relationships, and feedback |
| Opportunities | Listings, imports, duplicates, expiry, applications, and source health |
| Certificates | Eligibility, issue, reissue, revoke, and verification |
| Events | Events, registrations, tickets, cancellation, and check-in |
| Content | Posts, resources, and Media |
| Website | Public courses, events, stories, and Site Settings |
| System | Staff users, audit records, and AI activity |

## Security model

Each staff user has one least-privilege role: super-admin, content, learning, mentorship, opportunity, support, or analyst. Access is enforced in collection access rules and custom routes; navigation visibility is only presentation.

Custom staff requests use authenticated Payload users, safe origin handling, input validation, and domain permission checks. Sensitive records such as member notes, audit events, payments, and AI usage have narrower access and should not be copied into public fields.

## Data access

- Server components use Payload Local API with the authenticated staff context.
- /api/staff/* serves custom staff CRUD, settings, media, AI, event registration, and check-in workflows.
- /api/admin/* remains for specialized workflow operations and must use the same staff authorization boundary.
- Every multi-record workflow should compensate or report partial failure and record an audit event where appropriate.

## Interaction contract

Primary staff actions use shared loading, success, error, empty, confirmation, selection, and status primitives. Destructive actions require explicit confirmation and a reason when the state change is operationally significant. Browser-native prompt/confirm dialogs are not part of the supported staff UX.

## Current verification concern

As of 2026-07-21, TypeScript and unit tests pass, but lint reports five synchronous-set-state-in-effect errors in newer staff navigation/media components. See the root implementation plan before treating the staff application as release-verified.

Everyday procedures are consolidated in [staff-guide.md](staff-guide.md).
