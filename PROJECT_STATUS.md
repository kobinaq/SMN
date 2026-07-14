# SMN Project Status

**Updated:** 2026-07-14  
**Active programme:** Platform refinement (`cursor/platform-refinement-8510`)  
**Source of truth:** code + `REFINEMENT_AUDIT.md` + `IMPLEMENTATION_PLAN.md`

## Current product (breadth)

Public site, member portal, LMS, mentorship, opportunities, portfolios, certificates, custom staff app at `/staff`, and feature-flagged AI (Tutor, Content Studio, Career Coach). Payload remains CMS/auth/API.

## Refinement programme status

| Phase | Focus | Status |
|---|---|---|
| 0 | Audit + checklist | Mostly done (docs shells landing; mark complete after build/tests) |
| 1 | Production reliability | In progress (admin auth headers, role guards, env soft checks, API helpers) |
| 2 | Interaction consistency | In progress (Toast/ConfirmDialog/Empty/Error/Skeleton wired; ops confirms migrating) |
| 3 | Member experience | In progress (continuity dashboard, onboarding checklist, profile tags, LMS resume + save feedback) |
| 4 | Admin experience | In progress (Course Builder settings editor; mentorship/opportunity ConfirmDialog) |
| 5 | Existing AI refinement | Pending (flags stay off in prod) |
| 6 | Mobile, a11y, performance, tests, docs | Pending / docs expanding |

## Highest-priority gaps remaining

1. Avatar upload + fuller onboarding persistence beyond local dismiss
2. Lesson overview/completion celebration polish
3. Curriculum ConfirmDialog migration + attachments in lesson editor
4. Password-reset UX when Resend is unconfigured
5. Broader E2E coverage for member continuity + staff settings save
6. AI knowledge approval / draft→curriculum still incomplete (flags off)

## Production / migration

- Production: `https://socialmarketersnetwork.vercel.app` (Vercel root `web`, Neon Postgres).
- Baseline migration tooling exists; disposable Postgres proof + final prod adoption remain open gates.
- AI feature flags must remain false until schema adoption + smoke gates pass.
- Backup/recovery notes: `docs/deployment.md` · ops gate: `docs/production-checklist.md`.

## Freeze

No new major product areas. Improve depth, reliability, and usability of what exists.

See `IMPLEMENTATION_PLAN.md` for the numbered requirement checklist (R300+). Items stay `[~]` until implemented + tested + docs + production build.
