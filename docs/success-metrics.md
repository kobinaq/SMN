# SMN Product and Operations Metrics

**Updated:** 2026-07-21

Metrics are diagnostic, privacy-conscious, and aggregate. They must not be used to score employees, mentors, learners, applicants, or low-volume individuals. Sources include workflow records, audit events, payment/registration state, analytics events, and privacy-minimized AI records.

## Staff operations

| Metric | Definition | Source |
|---|---|---|
| Queue resolution | Median time from pending creation to audited terminal action | entity timestamps and audit events |
| Course readiness | Share of courses passing publication readiness | LMS course/module/lesson state |
| Learning continuity | Resume usage, progress-save failures, completion, and inactivity | enrollments and lesson progress |
| Override rate | Audited progress corrections per 100 active enrollments | learning override audit events |
| Mentorship throughput | Applications, approvals, introductions, completions, declines, and capacity | mentorship records and audit events |
| Opportunity health | Pending age, expiry, duplicates, source failures, and moderation | opportunity records and audit events |
| Credential integrity | Eligibility-to-issue, duplicate blocks, reissues, revocations, and notification state | certificates and audit events |

## Events and payments

| Metric | Definition | Guardrail |
|---|---|---|
| Registration conversion | Completed registrations divided by valid registration starts, split free/paid | No email or free-text analytics properties |
| Payment success | Fulfilled successful payments divided by initialized payments | Reconcile with Paystack references and amount/currency |
| Fulfillment latency | Time from verified success to registration/enrollment grant | Alert on unfulfilled successful payments |
| Duplicate protection | Duplicate callbacks that reused existing fulfillment without duplicate grants | Must remain 100% idempotent |
| Check-in | Checked-in registrations divided by eligible registrations | Operational attendance only, not member scoring |
| Cancellation/refund | Cancellation and refund counts/status by event/product | Keep cancellation distinct from Paystack refund |
| Delivery health | Payment, webhook, email, and access-link failures | Email failure must not reverse fulfillment |

## Tutor

- Provider success, timeout, error, and limited rates.
- Grounding coverage and approved-source citation count.
- Unsupported-answer decline rate.
- Helpful/not-helpful feedback in aggregate by course.
- p50/p95 latency and token totals without full prompts or responses.

## Content Studio

- Generation success and invalid-output rate by draft kind.
- Candidate selection, rejection, edit, and explicit draft-save conversion.
- Saved draft versions and provenance.
- No publish metric exists because the product cannot auto-publish.

## Career Coach

- Deterministic match availability and explanation success.
- Evidence/gap presentation, conversation reliability, and latency.
- Confirmed goal/plan saves, reset, deletion, and aggregate feedback.
- Employment outcomes are not attributed to or promised by the Coach.

## Release interpretation

Internal release requires correct event shape, zero permission/cross-course violations, and owners for operational failures. Payment release additionally requires reconciliation and idempotency evidence. AI private beta requires monitored failure, decline, feedback, latency, quota, retention/deletion, and a tested rollback flag.
