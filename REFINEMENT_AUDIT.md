# SMN Refinement Audit

**Date:** 2026-07-14  
**Branch:** `cursor/platform-refinement-8510`  
**Source of truth:** live code under `web/` (not roadmap alone)

This audit scopes a **refinement-only** programme: reliability, continuity, consistent interaction, mobile/a11y, and deepening existing workflows. No new major product areas.

---

## 1. Original state summary

SMN is a Next.js 16 + Payload 3 monorepo app (`web/`) with:

- Public marketing site `(site)`
- Member portal `(portal)` at `/app`
- Custom staff app `(staff)` at `/staff` (Payload admin chrome retired; `/admin` redirects)
- Dual auth: `users` / `smn-admin-token` vs `members` / `smn-member-token`
- LMS, mentorship, opportunities, portfolios, certificates
- Feature-flagged AI: Tutor, Content Studio, Career Coach

Breadth is high; many surfaces are **structurally present but operationally incomplete** for non-technical users.

---

## 2. Critical findings (by severity)

### P0 — Reliability / security

| Finding | Evidence | Impact |
|---|---|---|
| Production AI/LMS schema adoption still open | `PROJECT_STATUS.md`, `docs/database-migrations.md` | Risk of runtime/schema drift |
| Email silently skipped without Resend | `web/src/lib/email.ts` | Password reset / notifications appear broken |
| `opportunity-operations` lacks role guard | `api/admin/opportunity-operations/route.ts` | Any staff user may moderate |
| Several staff client fetches omit `credentials: "include"` | `CertificateActions`, `MemberNoteForm`, `ProgressOverrideForm`, `ContentStudio` | Intermittent 401s |
| Admin APIs use raw headers (CSRF Origin trap) vs staff JWT promotion | `api/admin/*` vs `lib/auth/staff.ts` | Auth flakes on preview/custom hosts |
| GraphQL + Payload REST catch-all remain mounted | `(payload)/api/graphql`, `api/[...slug]` | Broader attack surface than needed |
| No error monitoring (Sentry etc.) | repo-wide | Production failures invisible |
| Password reset depends on unconfigured email adapter | `Members.ts` `verify: false`, forgot-password copy | Incomplete auth loop |

### P1 — Continuity / confusion

| Finding | Evidence | Impact |
|---|---|---|
| Member home is a nav hub, not a continuity dashboard | `(portal)/app/page.tsx` `placeholders` | Members don’t know what to do next |
| Stale “roll out mentors/jobs/learning” copy | same | Trust erosion — features already ship |
| No guided onboarding after signup | `SignupForm` → `/app` | Cold start |
| LMS “Continue” goes to course root, not last lesson | `learning/courses/page.tsx` | Friction |
| Progress save failures are silent | `LmsProgressButton`, `LearningDashboard` | False confidence |
| Course Builder Settings read-only | `staff/.../learning/page.tsx` | Can’t finish readiness fields in-product |
| Lesson attachments not editable in staff UI | `field-defs.ts` `lmsLessonFields` | Schema unused |
| No enrollment / learning-item / progress staff screens | collections exist | Ops need raw DB or legacy admin |
| Mentorship: no member view of own requests | API POST only | Status opaque |
| Opportunity detail lacks member application status | `[slug]/page.tsx` | Tracking incomplete |
| Portfolio: create/delete only, no edit/preview flow | `PortfolioManager.tsx` | Guided case study incomplete |
| Media relations use raw IDs in CMS forms | `field-defs.ts` | Non-technical staff friction |

### P2 — Consistency / UX systems

| Finding | Evidence | Impact |
|---|---|---|
| No shared toast / skeleton / confirm dialog system | only `Button`, staff `ui.tsx`, native `confirm`/`prompt` | Inconsistent feedback |
| No portal `loading.tsx` / `error.tsx` | `(portal)` | Blank waits, hard failures |
| Staff ops still use browser prompts | Mentorship/Opportunity/Certificate actions | Poor a11y + mobile |
| Dead Payload view components still link `/admin/...` | `components/payload/*` | Confusion if imported |
| Profile labels missing `htmlFor` | `ProfileForm.tsx` | A11y |
| No skip-link / sitewide focus-visible in `globals.css` | CSS audit | Keyboard users |

### P3 — AI / release

| Finding | Evidence | Impact |
|---|---|---|
| AI flags default false; prod schema not adopted | `.env.example`, handoff | Correct — keep off until gates |
| No knowledge-source approval UI | `ai-knowledge-sources` | Grounding ops incomplete |
| No draft→curriculum apply | Content Studio saves `ai-drafts` only | Manual copy |
| Tutor hidden with no fallback copy when disabled | lesson page | Unlike Career Coach “coming soon” |
| Streaming API unused by product routes | `streamText` exists | Opportunity later, not expansion |

---

## 3. Route inventory (high level)

| Area | Routes | Notes |
|---|---|---|
| Public | `(site)/*`, insights, resources, events, stories, verify | Marketing mostly solid; legal/content env gates open |
| Auth | `/login`, `/signup`, `/forgot-password` | Reset email incomplete |
| Member | `/app`, profile, learning, mentors, opportunities, portfolio, certificates, career-coach | Continuity & status gaps |
| Staff | `/staff` + learning/content/website/system/ops | Strong skeleton; depth gaps |
| APIs | `/api/member-auth/*`, `/api/admin/*`, `/api/staff/*`, `/api/ai/*`, cron | Harden validation/auth/credentials |

---

## 4. Test / CI gaps

**EXISTS:** GitHub CI (typecheck, lint, unit, build, Playwright); 7–8 E2E covering staff login/ops + AI mock + public.

**MISSING vs refinement brief:** member register→onboard→lesson resume; mentor request; opportunity apply; portfolio publish; certificate view; staff curriculum create→publish; accessibility CI; disposable Postgres proof; monitoring.

---

## 5. Documentation drift

- Roadmaps still describe Payload `/admin` as primary in places; code uses `/staff`.
- Member home / opportunity copy still “coming soon” while features live.
- Missing docs required by brief: `REFINEMENT_AUDIT.md` (this file), `docs/member-journeys.md`, `docs/admin-journeys.md`, `docs/design-system.md`, `docs/accessibility.md`, `docs/production-checklist.md`.

---

## 6. Freeze decisions (confirmed)

Do **not** add: forum, payments, employer portal, new AI assistants, messaging, social feed, new microservices.

Do **improve:** shared interaction kit, onboarding, dashboard continuity, LMS resume/feedback, mentorship/opportunity status clarity, portfolio guided flow, certificate UX, staff Course Builder depth, Member 360, ops consistency, AI polish behind flags.

---

## 7. Recommended build order (matches brief §24)

1. Reliability & auth hardening  
2. Shared interaction system  
3. Member onboarding + dashboard + profile  
4. LMS / mentorship / opportunities / portfolio / certificates  
5. Staff dashboard + Course Builder + Member 360 + ops  
6. AI refinement (flags remain off in prod until verified)  
7. Mobile, a11y, performance, tests, docs, final report  

---

## 8. Success definition (refinement)

The product feels like **one coherent system**: members always know next action and status; staff complete ops without collection-hopping; every async action shows progress/success/failure; AI never breaks core flows when disabled or failing.
