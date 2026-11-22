# Page editor (Phase 2D)

Staff with the content role build pages from blocks in Payload, with drafts, versions and a live preview. It exists everywhere except production.

## Production gate

One helper decides: `isPageEditorEnabled()` in `src/lib/page-editor.ts`. It returns `false` only when `VERCEL_ENV === "production"` and reads the env at call time.

It covers:

- Payload access on the `pages` collection and the `header` and `footer` globals (read, create, update, delete, read versions). Closed for everyone, super-admin included, so REST and GraphQL are closed too.
- `admin.hidden` on all three, so they vanish from the admin nav.
- The `/admin` route: it still redirects to `/staff` unless `STAFF_LEGACY_ADMIN=true`, and additionally renders Payload only for `/admin/collections/pages/**` and `/admin/globals/(header|footer)/**` when the editor is enabled.
- The "Page editor" link in the staff menu.
- The preview route `/preview/pages/[slug]`, which returns 404.

Outside production only content staff and super-admin pass. Staff sign in at `/staff/login`; the session cookie is shared with Payload admin.

## Blocks

hero, text-section, card-grid, founder-story, steps, faqs, cta-band, partner-logos (approved logos only), newsletter, enquiry-form (any enquiry type except newsletter; cohort applications use /apply instead), course-list, price-panel.

There is no raw HTML, code, custom CSS, layout, column or embed block. Rich text uses a restricted editor (`src/fields/rich-text.ts`). Links (`src/fields/link.ts`) accept a `/path`, `#anchor`, `mailto:`, `tel:` or `https://` only.

Price panel rules live in `src/lib/page-blocks/price-cta.ts`: price is always staff-set; a course with an open cohort shows Apply, otherwise Register interest; One-on-One shows a disabled Pay button ("Online payment is coming soon", checkout is Phase 3H); Workshops always show Contact sales and never a price.

## Drafts, versions, rollback

Pages autosave drafts every 800 ms and keep 50 versions per document. Header and Footer keep 50 versions. Use the Versions tab to compare and restore.

## Live preview

Phone (390x844) and Desktop (1440x900). The preview route has its own layout in `src/app/(preview)` so it shows the CMS header and footer, not the code ones. It loads drafts and refreshes on save. Header and Footer previews open `/preview/pages/home`; with no home page it shows the chrome with an empty body and a note.

## Agency and Events toggles

Header sections `showAgency` and `showEvents` (both off by default) hide nav and footer links under `/agency` and `/events` in the preview chrome (`src/lib/page-blocks/section-visibility.ts`). They do not affect the public site yet. `src/lib/pages/*`, `chrome.ts`, `site.ts`, `features.ts` and `NEXT_PUBLIC_AGENCY_ENABLED` stay the source of truth until Phase 2E.

## Phase 2E

Will switch the public site to render CMS pages, Header and Footer, and read the toggles instead of `NEXT_PUBLIC_AGENCY_ENABLED`.

## Migrations

New tables are needed for `pages`, `header`, `footer` and their versions. Create the migration separately; none is included here.
