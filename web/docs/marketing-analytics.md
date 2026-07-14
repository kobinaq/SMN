# Marketing conversion analytics

Privacy-conscious events for the public marketing site. Do not attach emails, phone numbers, goals text, or other sensitive free-text fields.

## Event names

| Event | When |
|---|---|
| `primary_cta_click` | Primary cohort application CTA clicked |
| `secondary_cta_click` | Secondary CTA (e.g. explore programmes) |
| `programme_page_view` | Programme page viewed (optional future hook) |
| `application_start` | Application form mounted |
| `application_complete` | Application submitted successfully |
| `application_error` | Application submit failed |
| `employer_enquiry_start` | Employer/talent contact form mounted |
| `employer_enquiry_complete` | Employer enquiry sent |
| `whatsapp_click` | WhatsApp invite / community CTA |
| `course_purchase_click` | Selar purchase link clicked |
| `member_signin_click` | Member sign-in CTA |
| `portfolio_view` | Public portfolio viewed |
| `certificate_verify_view` | Certificate verification viewed |

## Allowed properties

- `location` — UI placement (`header`, `hero`, `apply_page`, …)
- Non-PII identifiers such as `programme` slug when needed

## Transport

`trackEvent` in `web/src/lib/analytics.ts` forwards to:

1. `window.dataLayer` (GTM-compatible)
2. `window.gtag` when present
3. `window.plausible` when present

Configure the production analytics property via the client’s preferred vendor. No secrets belong in the client bundle.
