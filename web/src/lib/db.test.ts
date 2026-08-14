import { afterEach, describe, expect, it } from "vitest";
import { shouldRunProdMigrations } from "@/lib/db";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("shouldRunProdMigrations", () => {
  it("stays off during a local production compile", () => {
    delete process.env.VERCEL_ENV;
    delete process.env.PAYLOAD_MIGRATING;
    delete process.env.PAYLOAD_SKIP_PROD_MIGRATIONS;
    expect(shouldRunProdMigrations()).toBe(false);
  });

  it("runs on Vercel production", () => {
    process.env.VERCEL_ENV = "production";
    delete process.env.PAYLOAD_MIGRATING;
    delete process.env.PAYLOAD_SKIP_PROD_MIGRATIONS;
    expect(shouldRunProdMigrations()).toBe(true);
  });

  it("runs when the migrate script sets PAYLOAD_MIGRATING", () => {
    delete process.env.VERCEL_ENV;
    process.env.PAYLOAD_MIGRATING = "true";
    delete process.env.PAYLOAD_SKIP_PROD_MIGRATIONS;
    expect(shouldRunProdMigrations()).toBe(true);
  });
});
