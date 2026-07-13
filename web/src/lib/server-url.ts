/**
 * Public origin for Payload (API cookies, CSRF, admin client).
 * Prefer runtime SITE_URL (not inlined at build) so disposable E2E ports work.
 * Then NEXT_PUBLIC_SITE_URL; fall back to Vercel deployment URL.
 */
export function getServerURL() {
  if (process.env.SITE_URL) {
    return process.env.SITE_URL.replace(/\/$/, "");
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "http://localhost:3000";
}
