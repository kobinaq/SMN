# Authentication

SMN uses Payload auth for both account types, but the browser cookies are now separated.

## Account Types

- Staff users live in the `users` collection and access Payload at `/admin`.
- Members live in the `members` collection and access the portal at `/app`.

## Cookie Strategy

Payload is configured with `cookiePrefix: "smn-admin"`, so native Payload admin auth uses:

- `smn-admin-token`

Member auth is handled by custom routes under `/api/member-auth/*`, which store:

- `smn-member-token`

Portal server code uses `memberAuthHeaders()` from `src/lib/auth/member.ts`. That helper maps `smn-member-token` into Payload's expected token name only for the current server-side auth check and removes any staff token from that check.

This means:

- Staff login does not overwrite member login.
- Member login does not overwrite staff login.
- Staff cookies are ignored on member routes.
- Member cookies are ignored by Payload admin.
- Member logout clears only `smn-member-token`.

## Routes

- `POST /api/member-auth/signup`
- `POST /api/member-auth/login`
- `POST /api/member-auth/logout`
- `POST /api/member-auth/forgot-password`
- `PATCH /api/member-auth/profile`

## Admin Access

`users.access.admin` must remain staff-only and return a boolean. Returning `true` for logged-out users can make Payload render a blank dashboard instead of redirecting to login.

## Known Limitations

Member logout currently clears the member browser cookie. Payload session revocation for that individual token should be added if forced server-side token invalidation becomes a requirement.
