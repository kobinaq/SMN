# Admin journeys

Staff work happens in the custom `/staff` app. Payload remains the system of record; `/admin` redirects to `/staff` unless `STAFF_LEGACY_ADMIN=true`.

## Daily operations

1. Sign in at `/staff/login`
2. Review Overview attention queues (deep links to filtered workspaces)
3. Use quick actions for frequent tasks only

## Course Builder

1. Open `/staff/learning`
2. Create draft course
3. Add modules and lessons in the Curriculum tab
4. Open a lesson’s **Edit lesson details** page to add materials:
   - Lesson type (video / reading / download / assignment)
   - Lesson text / reading content
   - External article or resource URL
   - Optional YouTube URL
   - Document uploads (PDFs and files)
5. Open the **Settings** tab for course-level fields:
   - Instructor
   - Category
   - Learning outcomes (one per line)
   - Access, publish status, certificate, Tutor controls
6. Publish only when readiness checks pass

Schema note: lesson `resourceUrl` / `resourceLabel` require a production schema update (`npm run db:push` or migrate) after deploy.

## Mentorship & opportunities

1. Mentorship workspace: approve/reject mentors; transition requests
2. Opportunities workspace: review imports, publish/close/archive with reasons
3. Filters should be preserved after returning from a record where practical

## Member 360 & certificates

1. Find a member and review learning, mentorship, opportunities, portfolio, notes
2. Issue certificates with eligibility confirmation; revoke/reissue with reasons
3. Administrative notes stay private to staff

## System

- Staff users, AI activity (read-only), and audit log under `/staff/system/*`
- AI Content Studio remains draft-only and feature-flagged
