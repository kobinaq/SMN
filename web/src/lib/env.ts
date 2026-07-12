function missing(name: string) {
  const value = process.env[name];
  return !value || value.trim() === "";
}

export function validateProductionEnv() {
  const productionValidationEnabled =
    process.env.VERCEL_ENV === "production" || process.env.SMN_VALIDATE_PROD_ENV === "true";

  if (!productionValidationEnabled) return;

  const required = ["DATABASE_URL", "PAYLOAD_SECRET", "NEXT_PUBLIC_SITE_URL"];
  const absent = required.filter(missing);

  if (process.env.PAYLOAD_SECRET === "smn-dev-secret-change-me-in-production") {
    absent.push("PAYLOAD_SECRET(non-default)");
  }

  const r2Keys = ["R2_BUCKET", "R2_ACCESS_KEY_ID", "R2_SECRET_ACCESS_KEY", "R2_ENDPOINT", "R2_REGION"];
  const anyR2 = r2Keys.some((name) => !missing(name));
  const missingR2 = anyR2 ? r2Keys.filter(missing) : [];

  const allMissing = [...absent, ...missingR2];
  if (allMissing.length) {
    throw new Error(`Missing required production environment variables: ${allMissing.join(", ")}`);
  }
}
