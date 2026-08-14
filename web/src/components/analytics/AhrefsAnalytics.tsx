import Script from "next/script";

const AHREFS_KEY = process.env.NEXT_PUBLIC_AHREFS_ANALYTICS_KEY?.trim() || "";

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
