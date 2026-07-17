/** Prefer env override; falls back to the site Ahrefs property key. */
const AHREFS_KEY =
  process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY?.trim() || "tENe1IHgufDvRyXCpH6hng";

/**
 * Cookie-free Ahrefs Web Analytics.
 * Renders the official snippet in <head> for installation verification.
 */
export function AhrefsAnalytics() {
  if (!AHREFS_KEY) return null;

  return (
    <script
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_KEY}
      async
    />
  );
}
