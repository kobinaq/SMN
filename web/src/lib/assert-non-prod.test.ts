import { describe, expect, it } from "vitest";
import { assertNonProd, decideDemoSeed } from "../../scripts/lib/assert-non-prod.mjs";

const pw = "hunter2-pass";
const prodHost = "ep-prod-123.eu-west-2.aws.neon.tech";
const prodUrl = `postgresql://user:${pw}@${prodHost}/db`;
const prodPooler = `postgresql://user:${pw}@ep-prod-123-pooler.eu-west-2.aws.neon.tech/db`;
const base = { ALLOW_DEMO_SEED: "1", VERCEL_ENV: "preview", NODE_ENV: "development" };

describe("decideDemoSeed", () => {
  it.each([undefined, "true", "0", ""])("refuses ALLOW_DEMO_SEED=%j", (flag) => {
    const env: Record<string, string> = { ...base };
    if (flag === undefined) delete env.ALLOW_DEMO_SEED;
    else env.ALLOW_DEMO_SEED = flag;
    expect(decideDemoSeed(env).ok).toBe(false);
  });

  it("refuses VERCEL_ENV=production", () => {
    expect(decideDemoSeed({ ...base, VERCEL_ENV: "production" }).ok).toBe(false);
  });

  it("refuses NODE_ENV=production", () => {
    expect(decideDemoSeed({ ...base, NODE_ENV: "production" }).ok).toBe(false);
    expect(() => assertNonProd({ ...base, NODE_ENV: "production" })).toThrow();
  });

  it.each([
    ["direct host", prodUrl, prodHost],
    ["endpoint id", prodUrl, "ep-prod-123"],
    ["pooler form", prodPooler, "ep-prod-123"],
    ["case-insensitive", prodUrl.toUpperCase(), "EP-PROD-123"],
  ])("refuses denylisted host (%s) without leaking secrets", (_n, url, entry) => {
    const result = decideDemoSeed({ ...base, DATABASE_URL: url, PROD_DB_HOSTS: `other.example, ${entry}` });
    expect(result.ok).toBe(false);
    expect(result.reason).not.toContain(pw);
    expect(result.reason).not.toContain("postgresql://");
  });

  it("refuses an unparseable URL when a denylist is set, without echoing it", () => {
    const result = decideDemoSeed({ ...base, DATABASE_URL: `not a url ${pw}`, PROD_DB_HOSTS: "x" });
    expect(result.ok).toBe(false);
    expect(result.reason).not.toContain(pw);
  });

  it("allows non-prod env with sqlite, localhost and unlisted hosts", () => {
    const hosts = { PROD_DB_HOSTS: "ep-prod-123" };
    expect(decideDemoSeed({ ...base, DATABASE_URL: "file:./payload.db", ...hosts }).ok).toBe(true);
    expect(decideDemoSeed({ ...base, DATABASE_URL: "postgresql://u:p@localhost:5432/d", ...hosts }).ok).toBe(true);
    expect(decideDemoSeed({ ...base, DATABASE_URL: "postgresql://u:p@127.0.0.1/d", ...hosts }).ok).toBe(true);
    expect(
      decideDemoSeed({ ...base, DATABASE_URL: "postgresql://u:p@ep-dev-999.example.test/d", ...hosts }).ok,
    ).toBe(true);
  });

  it("allows unset VERCEL_ENV / NODE_ENV and an unset denylist", () => {
    expect(decideDemoSeed({ ALLOW_DEMO_SEED: "1", DATABASE_URL: prodUrl }).ok).toBe(true);
    expect(() => assertNonProd({ ALLOW_DEMO_SEED: "1" })).not.toThrow();
  });
});
