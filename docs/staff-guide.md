# SMN Everyday Staff Guide

## Sign in and permissions

Use `/admin` with a staff account. Member accounts cannot enter Payload. The seven staff roles are deliberately narrow: super-admin, content, learning, mentorship, opportunity, support, and analyst. Ask a super-admin for a role change; do not share accounts. If a workspace or collection is absent, your role does not have that domain.

## Start with Overview

The Overview dashboard is the daily queue. Review items needing action, network health, and meaningful recent changes before opening individual collections. The custom navigation links directly to Course Builder, Member 360, Mentorship Operations, Opportunity Operations, and Certificate Issuing. Collection screens remain the advanced fallback.

## Course Builder

1. Select a course and complete its settings and learning outcomes.
2. Build modules and lessons in Curriculum. Reorder, move, or duplicate carefully; destructive actions require confirmation.
3. Check Overview readiness before publication.
4. Use Learners only for a justified progress correction. Every override requires a reason and creates an audit event.
5. Use Analytics for completion, inactivity, abandonment, and module drop-off—not as a grading tool.
6. Configure Tutor per course. Only approved, published course material is eligible context.

AI Content Studio creates drafts only. Choose the draft type and controls, generate, compare, select, edit, and explicitly save a reviewed version. It cannot publish. Continue through the normal readiness and publication flow after review.

## Member 360

Select a member to see profile, learning, credentials, portfolio, mentorship, opportunity activity, and recent audited events. Private staff notes must be factual, necessary, and suitable for authorized support colleagues. Do not copy sensitive personal data into notes or AI prompts.

## Mentorship Operations

Review mentor applications, approve or reject with a clear reason, watch mentor capacity, move requests through review/introduction/completion, and record relationship feedback. The system never delegates mentor approval or matching decisions to AI.

## Opportunity Operations

Review pending listings, expiry actions, duplicate fingerprints, applications, and source failures. Verify the employer, destination URL, dates, and role details before publication. Closing or archiving requires a reason and is audited. Career Coach rankings are member guidance, never hiring decisions or guarantees.

## Certificate Issuing

Only completed, eligible enrollments without an active duplicate appear in the issuing wizard. Confirm the selection before bulk issuing. Reissue when replacing a credential; revoke only with a durable reason. Each action records the issuer and audit trail. Never create certificates through AI Content Studio.

## AI operations and incidents

Tutor, Content Studio, and Career Coach are independently feature-flagged. AI can be wrong. Do not paste secrets, private notes, protected characteristics, or unnecessary personal data into an AI field. Review every draft or recommendation before acting.

If output appears unsafe, unsupported, or cross-course:

1. Stop using the affected surface and capture the feature, time, course/opportunity identifier, and visible error—do not copy private prompt content into a ticket.
2. Disable that feature flag for the environment.
3. Preserve privacy-minimized usage and feedback records for investigation.
4. Escalate to the product/engineering owner; do not work around policy blocks.
5. Resume only after the retrieval, permission, or provider issue is understood and verified.

Members can reset Career Coach state or delete retained Coach feedback/usage from the Career Coach privacy controls. Usage records expire according to `AI_USAGE_RETENTION_DAYS`.
