# Public enquiries

One endpoint accepts every public form, including newsletter signup.

`POST /api/enquiries`

`Content-Type: application/json`

There is no captcha. Unknown JSON fields are ignored.

## Body

| Field | Required | Limits |
| --- | --- | --- |
| `type` | yes | `programme-social-media-marketing`, `cohort-application`, `one-on-one-training`, `organisational-training`, `partnership`, `contact`, `newsletter` |
| `email` | yes | valid email, max 254 characters. Stored lowercased. |
| `name` | yes, except `newsletter` | max 120. Optional for `newsletter`. |
| `phone` | no | max 40 |
| `organisation` | no | max 160 |
| `message` | yes, except `newsletter` | max 5000. Optional for `newsletter`. |
| `sourcePage` | no | max 300. Example: `/resources` |
| `website` | honeypot | Must be empty or absent. |

Blank strings for optional fields are treated as absent.

### Honeypot

The field name is `website`. If it contains anything other than empty text, the response is `200` with `{ "ok": true }`. Nothing is stored, emailed, or sent to Mailchimp.

## Responses

Success, new row:

```json
201
{ "ok": true, "id": "42" }
```

Newsletter signup for an email that already has a `newsletter` row. No new row is inserted. Mailchimp is still attempted when it is configured, because that call is idempotent. No second staff email is sent.

```json
200
{ "ok": true }
```

Validation failure. `fieldErrors` maps each field to one or more messages.

```json
400
{ "ok": false, "error": "validation_error", "fieldErrors": { "email": ["Enter a valid email address."] } }
```

Malformed JSON:

```json
400
{ "ok": false, "error": "invalid_json", "fieldErrors": {} }
```

Rate limit. The `Retry-After` header is the wait in seconds. The limit is 8 requests per 15 minutes per client address, using the same in-memory limiter as the other public forms (`x-forwarded-for`, then `x-real-ip`).

```json
429
{ "ok": false, "error": "rate_limited" }
```

Anything else after the body was accepted, including a failed database write:

```json
500
{ "ok": false, "error": "server_error" }
```

A failed notification email or a failed Mailchimp call does not change a successful `201`. The row is already stored.

## Side effects

Every accepted submission is stored in the Payload `enquiries` collection with `status` `new`.

A notification email is sent with the existing Resend helper. The recipient is `ENQUIRY_NOTIFY_EMAIL`, unless the matching per-type variable is set:

- `ENQUIRY_NOTIFY_EMAIL_PROGRAMME_SOCIAL_MEDIA_MARKETING`
- `ENQUIRY_NOTIFY_EMAIL_COHORT_APPLICATION`
- `ENQUIRY_NOTIFY_EMAIL_ONE_ON_ONE_TRAINING`
- `ENQUIRY_NOTIFY_EMAIL_ORGANISATIONAL_TRAINING`
- `ENQUIRY_NOTIFY_EMAIL_PARTNERSHIP`
- `ENQUIRY_NOTIFY_EMAIL_CONTACT`
- `ENQUIRY_NOTIFY_EMAIL_NEWSLETTER`

All of those are optional. If neither the shared variable nor the type override is set, the enquiry is still stored and the server logs a warning.

### Sender confirmation

Every stored enquiry also sends a plain-text confirmation to the sender's `email`, alongside the notification above. It thanks them by name when one was given and restates what they asked about:

- `programme-social-media-marketing`: the Social Media Marketing cohort
- `cohort-application`: their cohort application
- `one-on-one-training`: One-on-One Training
- `organisational-training`: Specialized Marketing Workshops
- `partnership`: partnering with us
- `contact`: their message

It promises a reply within 48 hours, quotes their message back (each line prefixed with `> `) and signs off with the site name. `newsletter` gets a short "you're subscribed" note with no 48-hour promise.

The quoted message leaves out the leading `Enquiry type: ...` line (and the blank lines after it) that the contact form adds, so it shows only what the sender wrote. If nothing else remains, the quote is omitted. The admin notification and the stored message keep the full text.

The subject is a fixed string and the greeting name is collapsed to a single line. Confirmations carry a `Reply-To` header set to the address the notification goes to for that type (`ENQUIRY_NOTIFY_EMAIL_<TYPE>`, else `ENQUIRY_NOTIFY_EMAIL`), so replies reach the team. With neither set, no `Reply-To` is added. `sendEmail` refuses any `to`, `replyTo` or `subject` that contains a line break.

Confirmations are on by default. Set the matching variable to `false`, `0`, `off` or `no` (case-insensitive) to turn one type off:

- `ENQUIRY_CONFIRM_PROGRAMME_SOCIAL_MEDIA_MARKETING`
- `ENQUIRY_CONFIRM_COHORT_APPLICATION`
- `ENQUIRY_CONFIRM_ONE_ON_ONE_TRAINING`
- `ENQUIRY_CONFIRM_ORGANISATIONAL_TRAINING`
- `ENQUIRY_CONFIRM_PARTNERSHIP`
- `ENQUIRY_CONFIRM_CONTACT`
- `ENQUIRY_CONFIRM_NEWSLETTER`

Confirmations need both `RESEND_API_KEY` and `RESEND_FROM`. If either is missing, nothing is sent and the server logs a warning (id, type and reason only). They are never sent from the fallback onboarding address.

The notification and the confirmation run independently. If either fails, the other still goes out and the `201` stands. Honeypot hits, rate-limited requests, invalid JSON, validation errors and duplicate newsletter signups send neither email.

`type: "newsletter"` also calls the existing Mailchimp subscribe helper when `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, and `MAILCHIMP_SERVER_PREFIX` are all set. If they are not set, Mailchimp is skipped and the `201` still stands.

Payload's own REST and GraphQL APIs cannot create enquiries. Staff with the content or support role can read and update them at `/staff/enquiries`. Analysts can read them.

## Types and statuses

Stored values are unchanged; labels follow the plan. The legacy British slugs are kept until the spelling task (T3).

| Stored value | Label |
| --- | --- |
| `programme-social-media-marketing` | Course interest |
| `cohort-application` | Cohort application |
| `one-on-one-training` | One-on-One |
| `organisational-training` | Workshop sales |
| `partnership` | Partnership |
| `contact` | Contact |
| `newsletter` | Newsletter |

Statuses: `new`, `contacted`, `qualified`, `converted`, `closed`. `in-progress` is legacy ("In progress (legacy)"): it stays valid for existing rows but is not offered in pickers.

## Staff-only fields

`owner` (user), `notes` (internal text) and `enrollment` (linked enrollment) are set by staff only. The public endpoint builds the stored row from an explicit list of fields and always sets `status` to `new`, so these fields and `status` in a request body are ignored. They are never returned publicly or emailed.

## Example

```json
{
  "type": "one-on-one-training",
  "name": "Ama Mensah",
  "email": "ama@example.com",
  "phone": "+233200000000",
  "message": "I want help with a content calendar.",
  "sourcePage": "/programs/one-on-one-training",
  "website": ""
}
```
