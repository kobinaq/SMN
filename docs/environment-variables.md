# Environment Variables

Production validation runs when `VERCEL_ENV=production` or `SMN_VALIDATE_PROD_ENV=true`.

| Variable | Required | Purpose | Development format | Production format | Used by | Missing behavior |
|---|---:|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Yes in production | Canonical app origin for Payload, cookies, CSRF, links | `http://localhost:3000` | `https://yourdomain.com` | `server-url`, Payload config | Production validation fails |
| `PAYLOAD_SECRET` | Yes | JWT/signing secret for staff and member Payload auth | Long random string | Long random string, same across deploys | Payload auth | Production validation fails if missing/default |
| `DATABASE_URL` | Yes in production | Persistent database | `file:./payload.db` or Postgres URL | Neon/Supabase Postgres URL | DB adapter | Production validation fails |
| `PAYLOAD_DB_PUSH` | No | Enables schema push for `npm run db:push` | `true` only when pushing schema | Usually unset | DB adapter | No automatic schema push |
| `USE_SEED_CONTENT` | No | Forces public pages to use static seed content | `true` or unset | Usually unset | CMS helpers | CMS queried when DB exists |
| `NEXT_PUBLIC_WHATSAPP_INVITE` | Recommended | Public WhatsApp invite link | Test invite URL | Real invite URL | Site/settings links | Falls back to placeholder from seed content |
| `OPS_EMAIL` | Recommended | Operations notification recipient | `hello@example.com` | Real ops inbox | forms, mentorship | Falls back to site email in some routes |
| `RESEND_API_KEY` | Optional until email live | Email sending | Empty or Resend key | Resend key | forms, mentor emails, Payload email later | Emails are skipped or logged |
| `RESEND_FROM` | Optional until email live | Sender identity | `SMN <onboarding@resend.dev>` | Verified domain sender | email sends | Fallback sender used |
| `MAILCHIMP_API_KEY` | Optional | Newsletter subscription | Empty or key | Mailchimp key | newsletter route | Newsletter route logs/skips external subscribe |
| `MAILCHIMP_AUDIENCE_ID` | Optional | Mailchimp list ID | Empty or list ID | Real audience ID | newsletter route | Subscribe skipped |
| `MAILCHIMP_SERVER_PREFIX` | Optional | Mailchimp data center prefix | `us1` | Real prefix | newsletter route | Subscribe skipped |
| `CRON_SECRET` | Required for cron use | Protects opportunity import cron | Random 16+ chars | Random 16+ chars | `/api/cron/sync-opportunities` | Cron rejects requests without matching bearer token |
| `R2_BUCKET` | Required when R2 enabled | Cloudflare R2 bucket | Empty locally or bucket | Real bucket | Payload S3 storage | If any R2 key is present, production validation requires all R2 keys |
| `R2_ACCESS_KEY_ID` | Required when R2 enabled | R2 access key | Empty locally or key | Real key | Payload S3 storage | R2 disabled if incomplete locally |
| `R2_SECRET_ACCESS_KEY` | Required when R2 enabled | R2 secret | Empty locally or secret | Real secret | Payload S3 storage | R2 disabled if incomplete locally |
| `R2_ENDPOINT` | Required when R2 enabled | R2 S3 endpoint | `https://<accountid>.r2.cloudflarestorage.com` | Same | Payload S3 storage | R2 disabled if incomplete locally |
| `R2_REGION` | Required when R2 enabled | R2 region | `auto` | `auto` | Payload S3 storage | R2 disabled if incomplete locally |
| `R2_PUBLIC_URL` | Optional | Public media CDN URL | Empty or public URL | Custom media domain or r2.dev URL | Storage URL generator | Media falls back to `/api/media/file/<name>` |
| `SMN_VALIDATE_PROD_ENV` | No | Forces production env validation outside Vercel | `true` for checks | Usually unset | env validator | No effect when unset |
| `ALLOW_PRODUCTION_SEED` | No | Allows demo seeding in production deliberately | Unset | Only `true` for explicit one-off seed | seed script | Production seeding is blocked |
| `PLAYWRIGHT_BASE_URL` | No | Runs E2E against an existing server | `http://127.0.0.1:3000` | Preview URL if desired | Playwright | Playwright starts local dev server when unset |
| `STAFF_LEGACY_ADMIN` | No | Emergency kill-switch restoring Payload admin chrome at `/admin` | unset / `true` | Usually unset | Admin catch-all | `/admin` redirects to `/staff` |
| `AI_PROVIDER` | No | Provider adapter: `disabled`, `mock`, or `groq` | `mock` for isolated tests | `groq` only after beta approval | AI runtime | Disabled/unavailable when unset without a Groq key |
| `GROQ_API_KEY` | Required for Groq | Server-only Groq credential | Empty | Secret key | Groq adapter | Groq provider unavailable |
| `AI_TEXT_MODEL` | No | Quality text model alias | `llama-3.3-70b-versatile` | Reviewed supported model | AI runtime | Documented default used |
| `AI_FAST_MODEL` | No | Fast model alias | `llama-3.1-8b-instant` | Reviewed supported model | AI runtime/tests | Documented default used |
| `AI_STRUCTURED_MODEL` | No | Strict structured-output alias | `openai/gpt-oss-20b` | Reviewed supported model | Content Studio | Documented default used |
| `AI_TIMEOUT_MS` | No | Per-provider-call timeout | `20000` | Monitored bounded value | AI runtime | 20 seconds |
| `AI_MAX_INPUT_CHARS` | No | Validated request input ceiling | `12000` | Reviewed bounded value | AI runtime | 12,000 characters |
| `AI_HOURLY_REQUESTS` | No | Per-opaque-actor hourly quota | `30` | Capacity-based value | AI runtime | 30 |
| `AI_USAGE_RETENTION_DAYS` | No | Usage event expiry | `30` | Privacy-approved value | AI records/cleanup | 30 days |
| `AI_TUTOR_ENABLED` | No | Tutor rollback flag | `false` | Enable only after gate | Tutor | Tutor unavailable |
| `AI_CONTENT_STUDIO_ENABLED` | No | Content Studio rollback flag | `false` | Enable only after gate | Admin | Studio unavailable |
| `AI_CAREER_COACH_ENABLED` | No | Career Coach rollback flag | `false` | Enable only after gate | Portal | Coach coming-soon state |
| `RUN_GROQ_INTEGRATION` | No | Explicitly opts the optional live-provider test in | Unset | CI should remain unset | Vitest integration test | Live test skipped |
| `ALLOW_MIGRATION_BASELINE` | No | One-time guard for an existing DB baseline adoption | Unset | Temporary `true` only during runbook step | migration adoption | Adoption refused |

Do not commit real secrets.

AI keys and model configuration are server-only; never prefix them with `NEXT_PUBLIC_`. Keep all AI feature flags false during schema deployment and baseline adoption. See `docs/database-migrations.md`.
