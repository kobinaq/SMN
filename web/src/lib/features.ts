/**
 * Public feature flags.
 *
 * Agency (`/agency`) is built and reachable by URL, but stays out of the
 * primary nav, footer, homepage secondary CTA, and sitemap until this is on.
 * While off, the page sends `noindex`.
 *
 * Set `NEXT_PUBLIC_AGENCY_ENABLED=true` to publish it. Any other value, or an
 * unset variable, keeps it hidden. The variable is public because the header
 * is a client component and reads the nav at build time.
 */
export const agencyEnabled = process.env.NEXT_PUBLIC_AGENCY_ENABLED === "true";

/**
 * Home "Learner experiences" stays off until TSA approves testimonials.
 * The stories collection is unchanged. Set this to true to render the section.
 */
export const learnerExperiencesEnabled = false;
