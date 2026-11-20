# Public enquiries

One endpoint accepts every public form, including newsletter signup.

`POST /api/enquiries`

`Content-Type: application/json`

There is no captcha. Unknown JSON fields are ignored.

## Body

| Field | Required | Limits |
| --- | --- | --- |
| `type` | yes | `programme-social-media-marketing`, `one-on-one-training`, `organisational-training`, `partnership`, `contact`, `newsletter` |
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
- `ENQUIRY_NOTIFY_EMAIL_ONE_ON_ONE_TRAINING`
- `ENQUIRY_NOTIFY_EMAIL_ORGANISATIONAL_TRAINING`
- `ENQUIRY_NOTIFY_EMAIL_PARTNERSHIP`
- `ENQUIRY_NOTIFY_EMAIL_CONTACT`
- `ENQUIRY_NOTIFY_EMAIL_NEWSLETTER`

All of those are optional. If neither the shared variable nor the type override is set, the enquiry is still stored and the server logs a warning.

`type: "newsletter"` also calls the existing Mailchimp subscribe helper when `MAILCHIMP_API_KEY`, `MAILCHIMP_AUDIENCE_ID`, and `MAILCHIMP_SERVER_PREFIX` are all set. If they are not set, Mailchimp is skipped and the `201` still stands.

Payload's own REST and GraphQL APIs cannot create enquiries. Staff with the content or support role can read and update them at `/staff/enquiries`. Analysts can read them.

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
