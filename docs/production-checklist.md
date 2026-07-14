# Production checklist

Use before promoting a build or enabling AI flags.

## Environment

- [ ] `DATABASE_URL` points at durable Postgres (Neon)
- [ ] `PAYLOAD_SECRET` is unique and not the development default
- [ ] `NEXT_PUBLIC_SITE_URL` matches the live origin (no trailing slash)
- [ ] R2 variables complete when media uploads are required
- [ ] `RESEND_API_KEY` + `RESEND_FROM` set for password reset / notifications
- [ ] `CRON_SECRET` set for opportunity import cron
- [ ] AI flags remain `false` until schema + smoke gates pass
- [ ] `STAFF_LEGACY_ADMIN` unset (custom `/staff` is canonical)

## Schema

- [ ] Production migrations adopted (`docs/database-migrations.md`)
- [ ] Backup/restore procedure documented for the Neon project
- [ ] Rollback owner identified

## Auth smoke

- [ ] Member register / login / logout
- [ ] Password reset UX (or clear “email unavailable” message)
- [ ] Staff login / logout at `/staff/login`
- [ ] `/admin` redirects to `/staff`
- [ ] Member and staff sessions remain isolated

## Core workflow smoke

- [ ] Profile update saves with confirmation
- [ ] Course create + publish readiness path
- [ ] Lesson completion persists and resumes
- [ ] Mentor application + approval
- [ ] Mentorship request transitions
- [ ] Opportunity create/import + application tracking
- [ ] Portfolio publish
- [ ] Certificate issue + public `/verify/[code]`
- [ ] AI-disabled / provider-failure does not break non-AI pages

## Quality gates

```bash
cd web
npm run typecheck
npm run lint
npm run test:unit
npm run build
```

Run Playwright smoke after a local production build when changing auth or staff ops.
