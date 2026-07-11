/**
 * Cloudflare R2 is configured when these env vars are present.
 * Without them, Media uses local disk (or disableLocalStorage on Vercel).
 */
export function isR2Configured() {
  return Boolean(
    process.env.R2_BUCKET &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_ENDPOINT,
  );
}

export function getR2PublicUrl() {
  return process.env.R2_PUBLIC_URL || "";
}
