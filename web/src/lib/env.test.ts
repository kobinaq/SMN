import { afterEach, describe, expect, it } from "vitest";
import { validateProductionEnv } from "@/lib/env";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("validateProductionEnv", () => {
  it("does not require production variables during local development", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.SMN_VALIDATE_PROD_ENV;
    expect(() => validateProductionEnv()).not.toThrow();
  });

  it("throws when production validation is enabled and required values are missing", () => {
    process.env.SMN_VALIDATE_PROD_ENV = "true";
    delete process.env.DATABASE_URL;
    delete process.env.PAYLOAD_SECRET;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    expect(() => validateProductionEnv()).toThrow(/DATABASE_URL/);
  });

  it("requires complete R2 configuration when any R2 variable is present", () => {
    process.env.SMN_VALIDATE_PROD_ENV = "true";
    process.env.DATABASE_URL = "postgresql://user:pass@example.com/db";
    process.env.PAYLOAD_SECRET = "a-long-production-secret";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    process.env.R2_BUCKET = "smn-media";
    delete process.env.R2_ACCESS_KEY_ID;

    expect(() => validateProductionEnv()).toThrow(/R2_ACCESS_KEY_ID/);
  });

  it("accepts complete required env even when Resend/CRON soft checks warn", () => {
    process.env.SMN_VALIDATE_PROD_ENV = "true";
    process.env.DATABASE_URL = "postgresql://user:pass@example.com/db";
    process.env.PAYLOAD_SECRET = "a-long-production-secret";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.com";
    delete process.env.RESEND_API_KEY;
    delete process.env.CRON_SECRET;
    delete process.env.R2_BUCKET;

    expect(() => validateProductionEnv()).not.toThrow();
  });
});
