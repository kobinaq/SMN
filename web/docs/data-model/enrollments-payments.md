# Enrollments, payments, seats and enquiries (Phase 1C)

All changes are additive. Legacy rows stay valid.

## Enrollments

New optional fields on `enrollments`:

| Field | Notes |
| --- | --- |
| `offering` | `cohort` or `one-on-one`. Blank for legacy enrollments that use `programKey` only. |
| `cohort` | Relationship to `cohorts`. Shown when `offering` is `cohort`. |
| `catalogCourse` | Relationship to `courses` (Phase 1B). Derived from the cohort when blank. |
| `trainer` | Relationship to `users`. One-on-One only. |
| `payment` | Relationship to `payments`. |
| `sourceEnquiry` | Relationship to `enquiries`. |

`programType` gains `One-on-One`; `source` gains `enquiry` ("Converted enquiry"). `programName`, `programKey` and `programType` stay required.

Rules (`src/lib/enrollments/offering.ts`, enforced in a `beforeValidate` hook):

- `cohort` offering requires a cohort.
- `one-on-one` offering must not have a cohort.
- A cohort with no offering is an error ("Choose Cohort as the offering when a cohort is set.").
- A trainer is allowed only for `one-on-one`.

Derived values, only when blank (supplied values are never overwritten):

- Cohort: `programKey` `cohort-<id>`, `programName` the cohort name, `programType` `Cohort`, `catalogCourse` the cohort's course.
- One-on-One: `programKey` `one-on-one`, `programName` `One-on-One`, `programType` `One-on-One`.
- Legacy (no offering): nothing is derived.

## Payments

`payments.kind` gains `cohort` and `one-on-one` (varchar column, no enum change). New `cohort` relationship. Rules (`src/lib/payments/links.ts`): kind `cohort` requires a cohort; kind `one-on-one` must not have one; a cohort is allowed only with kind `cohort`.

These are records only. There is no checkout. `fulfillSuccessfulPayment` returns `{ ok: false, reason: "kind_not_fulfilled_yet" }` for these kinds and leaves the payment unchanged. Checkout and fulfillment are Phase 3 H-I.

## Seats left

`seatsLeft` = cohort `seats` minus enrollments whose status is `active` and whose cohort is that cohort, never below 0. It is computed only in `seatsLeft()` (`src/lib/programs/next-open-cohort.ts`). The catalog counts enrollments with `countActiveEnrollmentsByCohort`. Seat totals and counts are never exposed publicly.

## Enquiries

Stored type values are unchanged, plus `cohort-application`. Labels follow the plan:

| Stored value | Label |
| --- | --- |
| `programme-social-media-marketing` | Course interest |
| `cohort-application` | Cohort application |
| `one-on-one-training` | One-on-One |
| `organisational-training` | Workshop sales |
| `partnership` | Partnership |
| `contact` | Contact |
| `newsletter` | Newsletter |

Statuses: `new`, `contacted`, `qualified`, `converted`, `closed`. `in-progress` is kept as "In progress (legacy)" so existing rows stay valid and is not offered in pickers.

New staff-only fields: `owner` (user), `notes` (internal), `enrollment`. The public endpoint cannot set them or `status`.

New optional env vars: `ENQUIRY_NOTIFY_EMAIL_COHORT_APPLICATION`, `ENQUIRY_CONFIRM_COHORT_APPLICATION`.

## One-on-One

Format is fixed: 2 weeks, 4 live sessions a week, 8 sessions in total.

## Deferred

- Staff inbox UI to assign an owner, edit notes, convert to an enrollment and send a payment link: Phase 4K.
- Per-session Meet/Zoom links for One-on-One: Phase 4L Sessions.
- Renaming the British slugs and env-var suffixes: T3.
- Copying old cohort applications into the inbox: "link existing data".
- Public apply flow sending `cohort-application`: 3J.

## Migration

`src/migrations/20261122_115410_phase_1c_enrollments_payments_enquiries.ts`, scaffolded with `npm run db:migrate:create` and hardened by hand. It is additive and idempotent and is safe to run twice:

- Creates the `enum_enrollments_offering` type (guarded).
- Adds enum values with `ADD VALUE IF NOT EXISTS`: `One-on-One` (program type), `paystack` and `enquiry` (enrollment source), `cohort-application` (enquiry type), `contacted`, `qualified`, `converted` (enquiry status). `enum_payments_kind` is touched only if it exists; on dev and prod `payments.kind` is varchar.
- Adds nullable columns with `IF NOT EXISTS`: `enrollments.offering`, `cohort_id`, `catalog_course_id`, `trainer_id`, `payment_id`, `source_enquiry_id`; `payments.cohort_id`; `enquiries.owner_id`, `notes`, `enrollment_id`.
- Adds the matching indexes (`IF NOT EXISTS`) and `ON DELETE set null` foreign keys (guarded by `duplicate_object`).
- Sets the One-on-One format to 2 / 4 / 8 only where a value is NULL.

Nothing is dropped, renamed or retyped, and no rows are deleted. Legacy `in-progress` enquiries and legacy enrollments are not rewritten. `down` is a no-op.

`20261122_115410_phase_1c_enrollments_payments_enquiries.json` is the Payload schema snapshot written by the generator. It gives the next `db:migrate:create` a current baseline. Before it, the only snapshot was the July 2026 baseline, so the generator re-proposed every later hand-written change.
