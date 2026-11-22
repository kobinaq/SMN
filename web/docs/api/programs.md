# Public programs catalog

`GET /api/programs`

Read-only. No authentication. The response is cached for 60 seconds, then served stale for up to 300 seconds while it refreshes:

`Cache-Control: public, s-maxage=60, stale-while-revalidate=300`

## Response

Illustrative values only; no real prices or dates are set yet.

```json
{
  "ok": true,
  "courses": [
    {
      "course": {
        "id": "1",
        "slug": "social-media-marketing",
        "title": "Social Media Marketing",
        "summary": "Build the skills to plan, manage and deliver results for any brand or business.",
        "defaultPrice": 80000,
        "currency": "GHS"
      },
      "nextCohort": {
        "id": "10",
        "name": "January 2027",
        "startsAt": "2027-01-10T09:00:00.000Z",
        "endsAt": "2027-03-10T09:00:00.000Z",
        "applicationDeadline": "2027-01-03T23:59:00.000Z",
        "price": 50000,
        "currency": "GHS",
        "seatsLeft": 20
      }
    }
  ],
  "oneOnOne": {
    "price": null,
    "currency": "GHS",
    "durationWeeks": 2,
    "daysPerWeek": 4,
    "sessionCount": 8,
    "included": ["A certificate"]
  }
}
```

`nextCohort` is `null` when the course has no next open cohort. `endsAt` and `applicationDeadline` are `null` when not set. Ids are strings and dates are ISO 8601 strings in UTC.

## Which courses appear

Only courses with status `published`, sorted by title. `coming-soon` courses are not listed.

## Next open cohort

The earliest cohort, by `startsAt`, that meets all of these:

- status is `open` (never `draft`, `full`, `running` or `finished`)
- `startsAt` is strictly after the time of the request
- `seatsLeft` is greater than 0

## Seats left

`seatsLeft` is the cohort's seat total until phase 1C. Phase 1C subtracts active enrollments inside `seatsLeft()` in `src/lib/programs/next-open-cohort.ts`, the only place it is computed. The seat total itself is never returned.

## Money

Amounts are integers in minor units, pesewas (GH₵1 = 100). `currency` is a code such as `GHS`. `null` means not yet priced. `0` means free.

Effective price of a cohort:

- `price` is the cohort override if set, else the course default price, else `null`.
- `currency` is the cohort currency, else the course currency, else `GHS`.

`course.defaultPrice` is the course default only (`courses.amount`). `oneOnOne.price` comes from the One-on-One global.

## Hidden

These never appear: seat totals, `meetingUrl`, trainers, resources, `programKey`, draft or other non-open cohorts, and any other staff field. Output fields are picked one by one, so a new field on a collection is not exposed by accident.

## Errors

`500` with `{ "ok": false, "error": "server_error" }` and `Cache-Control: no-store`. The server log records the failure without the data.
