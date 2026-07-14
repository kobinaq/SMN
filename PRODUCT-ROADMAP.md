# SMN Product Roadmap

**Updated:** 2026-07-14  
**Orientation:** Refinement over expansion. Code under `web/` is the source of truth.  
**Plan:** `IMPLEMENTATION_PLAN.md` (R300+) · **Audit:** `REFINEMENT_AUDIT.md`

## Product foundations (unchanged)

| Area | Decision |
|---|---|
| Member identity | Payload `members` |
| Staff operations | Custom `/staff` app; Payload Local/REST; `/admin` redirect |
| Database | PostgreSQL production; SQLite disposable E2E |
| Media | Payload Media + R2 when configured |
| LMS video | Unlisted YouTube (`youtube-nocookie`) |
| AI | Existing Tutor / Content Studio / Career Coach only; independent flags |

## Freeze

No community forum, native payments, employer portal, new AI assistants, messaging, social feed, or new microservices.

---

## Phase 1: Production reliability

| Field | Detail |
|---|---|
| Status | In progress |
| Objective | Dependable auth, env, migrations, mutations, integrations, smoke |
| Dependencies | Neon access, Resend/R2/cron secrets |
| Acceptance | Smoke matrix R340–R349 green; no silent email/auth failures; role guards on admin APIs |
| Tests | Unit + E2E auth/smoke; CI green |
| Risks | Schema drift; preview Origin CSRF |
| Success metric | Zero critical auth/mutation flakes in smoke |

## Phase 2: Interaction consistency

| Field | Detail |
|---|---|
| Status | Pending |
| Objective | One interaction system for loading/empty/error/success/confirm |
| Dependencies | Phase 1 helpers |
| Acceptance | Shared toast/dialog/skeleton/FormField used across portal + staff ops |
| Tests | Component/unit + a11y keyboard on dialogs |
| Risks | Half-migrated prompts |
| Success metric | No `window.confirm`/`prompt` in staff primary ops |

## Phase 3: Member experience refinement

| Field | Detail |
|---|---|
| Status | Pending |
| Objective | Onboarding, continuity dashboard, profile, LMS resume, mentorship/opportunity status, portfolio, certificates |
| Dependencies | Phase 2 primitives |
| Acceptance | New member reaches first lesson without help; resume in one click; every form gives feedback |
| Tests | Member E2E R590 |
| Risks | Overwhelming dashboard |
| Success metric | Time-to-first-lesson ↓; silent progress failures = 0 |

## Phase 4: Admin experience refinement

| Field | Detail |
|---|---|
| Status | Pending |
| Objective | Dashboard, Course Builder depth, Member 360, mentorship/opportunity/certificate ops without collection hopping |
| Dependencies | Phase 2 dialogs; Phase 1 auth |
| Acceptance | Non-technical staff publish a course from Course Builder alone |
| Tests | Staff E2E R591 |
| Risks | Scope creep into new products |
| Success metric | Screens-per-course-publish ↓ |

## Phase 5: Existing AI refinement

| Field | Detail |
|---|---|
| Status | Pending (flags off in production until schema gate) |
| Objective | Safer Tutor/Studio/Coach UX; grounding; monitoring; never auto-publish |
| Dependencies | Production schema adoption; Phase 1 fallbacks |
| Acceptance | Provider failure does not break non-AI flows; unsupported answers explicit |
| Tests | Mock AI E2E R592 |
| Risks | Enabling flags before adoption |
| Success metric | Grounded/decline rates monitored; zero auto-publishes |

---

## Release gates (still apply)

1. **Internal verification** — types, lint, unit, build, Playwright, disposable Postgres proof  
2. **Production schema** — adopt baseline; AI flags false through procedure  
3. **Private AI beta** — privacy, quotas, rollback, accessibility review  
4. **Public MVP** — refinement acceptance §26 + stakeholder content/env  

## Current next checkpoint

Execute Phase 1 reliability hardening and Phase 2 shared kit, then member continuity dashboard + LMS progress feedback (highest member-facing confusion from audit).
