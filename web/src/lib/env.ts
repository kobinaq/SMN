function missing(name: string) {
  const value = process.env[name];
  return !value || value.trim() === "";
}

function warn(message: string) {
  console.warn(`[env] ${message}`);
}

export function validateProductionEnv() {
  const productionValidationEnabled =
    process.env.VERCEL_ENV === "production" || process.env.SMN_VALIDATE_PROD_ENV === "true";

  if (!productionValidationEnabled) return;

  const required = ["DATABASE_URL", "PAYLOAD_SECRET", "NEXT_PUBLIC_SITE_URL"];
  const absent = required.filter(missing);

  if (
    process.env.PAYLOAD_SECRET === "smn-dev-secret-change-me-in-production" ||
    process.env.PAYLOAD_SECRET === "change-me-to-a-long-random-string"
  ) {
    absent.push("PAYLOAD_SECRET(non-default)");
  }

  const r2Keys = ["R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ENDPOINT", "R2_REGION"];
  const anyR2 = r2Keys.some((name) => !missing(name));
  const missingR2 = anyR2 ? r2Keys.filter(missing) : [];

  const allMissing = [...absent, ...missingR2];
  if (allMissing.length) {
    throw new Error(`Missing required production environment variables: ${allMissing.join(", ")}`);
  }

  // Soft checks: do not crash boot, but make ops gaps visible in logs.
  if (missing("RESEND_API_KEY") || missing("RESEND_FROM")) {
    warn("RESEND_API_KEY/RESEND_FROM incomplete — transactional email (password reset) will be skipped.");
  }
  if (missing("CRON_SECRET") || String(process.env.CRON_SECRET || "").length < 16) {
    warn("CRON_SECRET missing or shorter than 16 characters — opportunity import cron is not hardened.");
  }
  if (process.env.STAFF_LEGACY_ADMIN === "true") {
    warn("STAFF_LEGACY_ADMIN=true restores Payload /admin — emergency only.");
  }
}
