# SMN Staff Guide

**Updated:** 2026-07-21

**Canonical for:** everyday staff and admin procedures

## Sign in and permissions

Use /staff/login. Staff accounts use Payload users; member accounts cannot enter the staff app. Roles are super-admin, content, learning, mentorship, opportunity, support, and analyst. Missing navigation means the account does not have that domain.

/admin redirects to /staff. Use STAFF_LEGACY_ADMIN=true only as a temporary engineering recovery measure.

The first visit may create the first super-admin only when no users exist. After bootstrap, a super-admin manages staff under System → Users.

## Today

Start at /staff. Review action queues, health signals, and recent changes, then open the relevant workspace. Treat counts as operational prompts, not performance grades.

## Learning and Course Builder

1. Open /staff/learning and create or select a course.
2. Complete settings: programme key, instructor, category, summary, outcomes, access, enrollment, certificate, preview, Tutor, and publication fields.
3. Build modules and lessons. Use the detail editors for lesson type, reading body, external resource, YouTube URL, and downloadable Media attachments.
4. Review readiness before publication.
5. Use learner progress overrides only for a justified correction; include a durable reason.
6. Use analytics for completion, inactivity, and curriculum drop-off, not grading.

Enrollments grant access through a stable programme key and can carry Classroom or external course links. Learning Items remain useful for lightweight milestones alongside the native LMS.

Content Studio generates reviewed drafts only. Compare candidates, edit the selected draft, save explicitly, and continue through ordinary curriculum and publication review. It cannot publish automatically.

## Members

Use the People/Members workspace to search members and review profile, skills/goals, learning, certificates, portfolio, mentorship, opportunity activity, and private notes. Notes must be factual, necessary, and appropriate for authorized support colleagues. Do not place private notes or protected personal information into AI prompts.

Members edit their own public profile and portfolio through /app. Staff should avoid changing member-authored content unless a support workflow explicitly permits it.

## Mentorship

- Review mentor applications and approve, pause, or reject with a clear reason.
- Watch capacity before introductions.
- Move requests through new, reviewing, introduced, completed, or declined.
- Record relationship feedback and preserve audit history.
- AI does not approve mentors or make matching decisions.

## Opportunities

- Review imported and manually created roles, duplicates, expiry, applications, and source failures.
- Verify employer, destination URL, dates, and role details before publication.
- Keep new ATS sources manual-review until their relevance is proven.
- Closing or archiving requires an operational reason.
- Member applications continue on the employer site; SMN records tracking state only.

## Certificates

Use the certificate workspace and issuing wizard. Confirm eligibility and active duplicates before issuing. Reissue when replacing a credential; revoke only with a durable reason. Public verification requires a valid, public credential code. PDFs use Media/R2 when available.

## Events, registrations, and payments

### Create an event

1. Open Website → Events.
2. Set title, schedule, location/format, capacity, publication state, and access link.
3. For a paid event, set the amount in minor currency units and confirm the public copy/refund terms.
4. Leave legacy external registration URL blank for first-party registration.

### Operate registrations

1. Open Events and select the event.
2. Review paid/free registrations and payment state.
3. Use the check-in screen to validate the ticket/registration.
4. Cancel only through the supported action so registration and audit state remain consistent.
5. Escalate refunds to the designated payment owner; cancellation and Paystack refund are not interchangeable unless the workflow explicitly performs both.

Never mark a payment successful manually to work around a webhook problem. Capture the Paystack reference, time, event/course, and visible error, then escalate without copying card or private payment data.

## Content, website, and media

- Content manages posts, resources, and media.
- Website manages public courses, events, stories, and Site Settings.
- Publish only verified testimonials, permissions, metrics, fees, and partner claims.
- Upload images, PDFs, certificates, and learning files through Media. Production uses R2 when configured.
- Keep LMS videos on unlisted YouTube rather than uploading them to Media.

## System

Super-admins manage staff users. Authorized staff can review audit and privacy-minimized AI activity. Never delete or rewrite audit records to hide an operational mistake.

## AI operations and incidents

Tutor, Content Studio, and Career Coach have separate flags. AI can be wrong. Never paste secrets, private notes, protected characteristics, payment data, or unnecessary personal data into an AI field.

For unsafe, unsupported, cross-course, or privacy-sensitive behavior:

1. Stop using the affected surface.
2. Record feature, time, course/opportunity identifier, and visible error without copying private prompt content.
3. Disable only the affected feature flag.
4. Preserve privacy-minimized usage and feedback records.
5. Escalate to the engineering/product owner.
6. Resume only after the cause and rollback path are verified.

## Related runbooks

- [Admin architecture](admin-architecture.md)
- [Authentication](authentication.md)
- [Database migrations](database-migrations.md)
- [Deployment](deployment.md)
- [Production checklist](production-checklist.md)
- [AI architecture](ai-architecture.md)
