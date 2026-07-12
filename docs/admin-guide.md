# Admin Guide

Staff work happens in Payload at `/admin`.

## Members

- Open `Members`.
- Review name, email, profile fields, roles, and cohort status.
- Staff-controlled fields include `roles` and `cohortStatus`.
- Members can update only their own public profile fields from `/app/profile`.

## Mentors

- Open `Mentors`.
- Review draft mentor applications.
- Set `status` to `approved` to publish a mentor profile to members.
- Use `paused` or `rejected` when a profile should not appear.
- Approved mentors can receive mentorship requests.

## Mentorship Requests

- Open `Mentorship Requests`.
- Review requester, mentor, topic, goal, message, and preferred format.
- Move status through `new`, `reviewing`, `introduced`, `completed`, or `declined`.
- Use `staffNotes` for internal context.

## Opportunities

- Open `Opportunities`.
- Create manual listings with title, company, summary, type, work mode, location, and application URL.
- Set `status` to `published` for member visibility.
- Draft/pending listings are hidden from members.
- Imported listings are reviewed the same way.

## Opportunity Sources

- Open `Opportunity Sources`.
- Add Greenhouse, Lever, or Ashby public job-board sources.
- Keep new sources in review until imports are trusted.
- The cron route is protected by `CRON_SECRET`.

## LMS Courses and Lessons

- Create `LMS Courses` with a stable `programKey`.
- Grant access by creating an `Enrollment` for a member with the same `programKey`.
- Create `LMS Modules` linked to the course.
- Create `LMS Lessons` linked to both course and module.
- Add unlisted YouTube URLs for video lessons.
- Upload PDFs, templates, and downloads through lesson attachments.
- Publish course, modules, and lessons when ready.

## Learning Dashboard

- Use `Enrollments` to grant cohort, Selar, workshop, or community access.
- Use `Learning Items` for lightweight milestones, resources, and checklist items.
- `Progress` records are created by member interactions.

## Certificates

- Open `Certificates`.
- Create a certificate for a member.
- Use a unique `credentialCode`.
- Attach a PDF through Media when available.
- Set `status` to `valid`.
- Set `visibility` to `public` for `/verify/<code>`.
- Draft, private, and revoked certificates do not verify publicly.

## Portfolios

- Members create portfolio items from `/app/portfolio`.
- Staff can review items in `Portfolios`.
- Public portfolio entries require the member profile and item to be public.

## Website Content

Manage public content in:

- `Posts`
- `Courses`
- `Events`
- `Stories`
- `Resources`
- `Site Settings`

Posts require `publishedAt` before public API access. Course catalog items must be `published` or `coming-soon` for public access.

## Media

- Open `Media`.
- Upload images, PDFs, certificates, and downloadable files.
- Production files use Cloudflare R2 when configured.
- LMS videos should remain on unlisted YouTube, not Media/R2.
