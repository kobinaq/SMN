import Script from "next/script";

/** Prefer env override; falls back to the site Ahrefs property key. */
const AHREFS_KEY =
  process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY?.trim() || "tENe1IHgufDvRyXCpH6hng";

/** Cookie-free Ahrefs Web Analytics, loaded through the App Router script pipeline. */
export function AhrefsAnalytics() {
  if (!AHREFS_KEY) return null;

  return (
    <Script
      id="ahrefs-analytics"
      src="https://analytics.ahrefs.com/analytics.js"
      data-key={AHREFS_KEY}
      strategy="afterInteractive"
    />
  );
}
