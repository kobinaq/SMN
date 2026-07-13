# SMN AI Architecture

Status: implementation complete and awaiting final verification/private-beta approval. AI surfaces remain independently disabled unless their feature flag and `AI_PROVIDER` are configured.

## Boundaries

Features call the provider-independent contracts in `web/src/lib/ai`. Only `groq-provider.ts` knows Groq's HTTP shape. Runtime code owns authentication context, validation, per-actor limits, timeouts, privacy-minimized usage records, and policy decisions. Retrieval is deterministic and restricted to published material in one entitled course.

AI may draft or explain. It may not publish, issue credentials, grade, decide mentor eligibility, apply for opportunities, make employment decisions, or change protected member data. Goal and plan saves require a separate explicit confirmation.

## Current model aliases

Model IDs are environment configuration, never feature constants:

| Alias | Default | Rationale |
|---|---|---|
| `AI_TEXT_MODEL` | `llama-3.3-70b-versatile` | Groq production model for higher-quality grounded explanation and drafting. |
| `AI_FAST_MODEL` | `llama-3.1-8b-instant` | Groq production model for short, latency-sensitive work. |
| `AI_STRUCTURED_MODEL` | `openai/gpt-oss-20b` | Groq production model with strict JSON-schema structured output support. |

Verified 2026-07-13 against Groq's official [supported models](https://console.groq.com/docs/models), [structured outputs](https://console.groq.com/docs/structured-outputs), and [API reference](https://console.groq.com/docs/api-reference). Groq currently documents `openai/gpt-oss-20b` and `openai/gpt-oss-120b` for strict structured outputs. Structured outputs cannot be combined with streaming or tool use, so SMN uses separate flows. Preview model IDs are not defaults. Review the official model and deprecation pages before changing production aliases.

## Data and retention

`ai-usage-records` stores an opaque actor key, feature/operation, model/provider, counts, latency, status, prompt hash, error code, and expiry. Full prompts and responses are not stored. `AI_USAGE_RETENTION_DAYS` controls retention (30 days by default); an expiry cleanup operation removes elapsed records. Feedback is stored separately and comments are bounded.

Provider context uses explicit field allowlists. Career Coach receives only the member's opted-in profile and related SMN records required for the current task. Tutor context is selected only from the active entitled course. Retrieved text is treated as untrusted data, screened for instruction overrides, delimited as sources, and cited.

## Retrieval

The initial retriever uses approved Payload content and deterministic lexical ranking. This avoids assuming that Groq supplies embeddings and avoids adding a paid vector database before scale or quality evidence justifies one. Course, lesson, transcript, note, resource, FAQ, and attachment text can be indexed through `ai-knowledge-sources`; only approved rows and published lessons are eligible.

## Operations

- `AI_PROVIDER=disabled` is the safe default without credentials.
- `AI_PROVIDER=mock` supports deterministic tests without network access.
- `AI_PROVIDER=groq` requires `GROQ_API_KEY`.
- Every surface has a feature flag and a recoverable unavailable state.
- Provider calls have a bounded timeout, completion size, input size, and hourly per-actor quota.
- Normal CI never calls Groq. A separately enabled integration check may do so.
- A provider failure does not fabricate a response or bypass the policy layer.
- Tutor, feedback, and Career Coach authenticate through the member-cookie bridge; Content Studio requires a staff session plus learning permission.
- Confirmed saves, draft lifecycle transitions, grounded declines, provider results, limits, and failures produce privacy-minimized events.
- See `docs/success-metrics.md` for definitions and `docs/staff-guide.md` for incident handling.

## Implemented surfaces

- **Tutor:** nine grounded learning modes, strict course entitlement/isolation, approved-source citations, unsupported-answer decline, feedback, reset, mobile drawer, and per-course controls/reporting.
- **Content Studio:** course/lesson-aware text and separately validated quiz/rubric/outline generation, controls, candidate comparison, explicit selection/rejection/edit/save, provenance, and versions. It never publishes.
- **Career Coach:** deterministic opportunity ranking before LLM explanation, evidence/gaps/learning, minimized authenticated context, conversation, explicit goal/plan persistence, feedback, reset, and retained-data deletion. It never auto-applies or guarantees employment.

Provider streaming is available through the provider-independent interface. Current product routes return bounded JSON responses so citations, policy state, and errors arrive atomically; streaming may be enabled per surface after accessibility and partial-response safety verification.

## Privacy message

Every member AI surface must state: “AI can be wrong. SMN sends only the information needed for this request, does not store full prompts or answers in usage logs, and requires you to review recommendations before acting.” Members can reset feature state and request deletion of retained feedback/career state.
