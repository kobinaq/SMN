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

## Serving from the CMS (Phase 2E)

Outside production the public site renders a **published** CMS page when one exists, and today's code page otherwise. Production never reads the CMS.

- `src/lib/cms-pages.ts`: `getPublishedCmsPage(slug)` and `getPublishedChrome()` return `null` immediately (no Payload import, no database call) when `isPageEditorEnabled()` is false. Otherwise they read `_status = published` with `draft: false`, `overrideAccess: true`, depth 1, and return `null` on any error. They also return `null` when `shouldUseCms()` is false (`USE_SEED_CONTENT=true`, or a Vercel build without a remote database).
- Served from CMS: `/` (slug `home`) and `/about` (slug `about`). Metadata comes from the page's Share settings (`meta.title`, `meta.description`), falling back to today's metadata. A page with no blocks is ignored. Home keeps `revalidate = 60`; `/about` has no revalidate (as before), so outside production a newly published About page appears after the next build or revalidation of that route.
- Header and Footer: the `(site)` layout feeds a published Header (`navItems`) and Footer (`blurb`, `columns`) into the existing components, filtered by the Header's `showAgency` and `showEvents` toggles (`section-visibility.ts`). A global that is only a draft is ignored and the code chrome (`site.ts`, `pages/chrome.ts`) renders. The Header's button and the Footer's legal and social links are not rendered yet; the existing design keeps its own Privacy and Terms links. The Footer subscribe form stays in code.
- When the CMS home page is served, the header drops the dark-hero rule (`headerTone`) because CMS heroes are light.
- Production: unchanged. The pages, header and footer globals are closed there anyway.

### Importing today's copy

`npm run import:pages` creates the `home` and `about` pages, and fills the Header and Footer globals, from the code copy in `src/lib/pages/*`, `src/lib/site.ts` and `src/lib/pages/chrome.ts`. Strings are the same constants the code pages render (mapping in `src/lib/cms-import/`). Images are not uploaded; blocks use the built-in `imagePreset` allowlist (`src/lib/page-blocks/image-presets.ts`).

Seed a dev database:

```
cd web && ALLOW_DEMO_SEED=1 DATABASE_URL=<dev database url> npm run import:pages -- --publish
```

Flags:

- `--dry-run` prints the plan and writes nothing.
- `--publish` publishes. Without it everything is saved as a draft.
- `--overwrite` replaces CMS content that differs from the import. Without it a differing page or global is skipped with a warning.

Per page and global: missing -> created; same as the import (ids, timestamps and `_status` ignored) -> unchanged, no write and no new version, or published when `--publish` and it is still a draft; different -> skipped, or updated with `--overwrite`. The last line reads `created N, updated N, published N, unchanged N, skipped N`. A second identical run reports `created 0, updated 0`. Agency appears only when `NEXT_PUBLIC_AGENCY_ENABLED=true` at import time, and `sections.showAgency` is set to that value; `sections.showEvents` is `true` because today's footer shows Events.

Guards, all before any database connection: `ALLOW_DEMO_SEED=1` and not `VERCEL_ENV`/`NODE_ENV` production or a `PROD_DB_HOSTS` host (`scripts/lib/assert-non-prod.mjs`); `DATABASE_URL` must be Postgres on `localhost`, `127.0.0.1` or the Neon dev endpoint `ep-wispy-rice-abpfeozn`; the production endpoint is refused by name (`scripts/import-pages-lib.mjs`). The connection string is never printed. The script never pushes schema.

### Follow-ups

- `partnerships` and `agency` are not imported or served from the CMS: they mix enquiry forms and sequence layouts that the current blocks do not match cleanly.
- Sections of the code home page without a block match lose their photo and motion when served from CMS (audience, approach, resources and partner images, hero photo fan, scroll animation). Learner experiences stay off, as in code.
- `programs/*` is Phase 2F.
- `legalLinks`, `socialLinks` and the Header button are not imported or rendered.

## Agency and Events toggles

Header sections `showAgency` and `showEvents` hide nav and footer links under `/agency` and `/events` in the preview chrome and, when a Header is published, in the public site's chrome (`src/lib/page-blocks/section-visibility.ts`). Without a published Header the code chrome and `NEXT_PUBLIC_AGENCY_ENABLED` decide. The `/agency` page itself is still controlled by code.

## Migrations

New tables are needed for `pages`, `header`, `footer` and their versions. Create the migration separately; none is included here.

Phase 2E adds optional block fields: `hero.eyebrow`, `hero.imagePreset`, `card-grid` cards `meta`, `audience` and `imagePreset`, `founder-story.eyebrow`, `founder-story.imagePreset` and `founder-story.cta` (label, href). `imagePreset` is a select with GraphQL-safe slugs: `hero-community`, `about-mission`, `founder`, `cohort-spotlight`, `mentorship-talk`, `event-workshop`, `academy-group`, `philosophy`, `post-strategy`, `hire-conversation`.
