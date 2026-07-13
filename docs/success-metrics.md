# Admin and AI Success Metrics

Metrics use `audit-events`, `ai-usage-records`, `ai-feedback`, draft/state records, and existing workflow timestamps. AI events contain opaque actor keys and operational metadata only; full prompts and responses are excluded.

## Admin operations

| Metric | Definition | Source |
|---|---|---|
| Queue resolution | Median time from record creation/pending state to audited terminal action by workflow | entity timestamps + `audit-events` |
| Course readiness | Share of courses passing every publication readiness check | LMS course/module/lesson state |
| Override rate | Audited progress overrides per 100 active enrollments | `learning.progress.override` events |
| Mentorship throughput | Approvals, introductions, completions, declines, and active-capacity utilization | mentorship records + audit events |
| Opportunity health | Pending age, expiry actions, duplicate groups, source failures, moderation outcomes | opportunity records + audit events |
| Credential integrity | Eligible-to-issued conversion, duplicate blocks, reissues, revocations, notification status | certificates + audit events |

## Tutor

- Success rate: successful `feature=tutor` provider events / all Tutor events.
- Grounding coverage: successful Tutor events with `sourceCount > 0` / successful Tutor events.
- Unsupported decline rate: `status=declined` and `errorCode=insufficient_sources` / Tutor questions.
- Quality: helpful and not-helpful feedback counts/rate, reviewed in aggregate by course context key.
- Reliability: p50/p95 latency, timeout/error/limited rates, input/output token totals.

## Content Studio

- Generation success and invalid-output rate by draft kind.
- Review conversion: `draft-saved:*` events / successful `generate:*` events.
- Selection/rejection/save counts and saved draft versions; no publish event exists by design.
- Reliability and usage: latency, timeouts, errors, limits, and token totals.

## Career Coach

- Deterministic match availability and explanation success.
- Conversation success, error, timeout, and limit rates.
- Explicit goal/plan save counts; reset counts; deletion is intentionally not recreated as a post-deletion event.
- Helpful/not-helpful feedback rate. Employment outcomes are not attributed to or promised by the Coach.

## Release interpretation

Internal testing looks for correct event shape and zero cross-course/permission violations. Private AI beta additionally requires monitored failure, decline, feedback, latency, and quota trends with an assigned owner and rollback flag. Metrics are diagnostic—not employee, mentor, learner, or applicant scoring—and low-volume segments must not be used to infer individual behavior.
