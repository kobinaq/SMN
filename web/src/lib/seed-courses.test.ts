import { describe, expect, it } from "vitest";
import {
  PREVIEW_DB_ENDPOINT_ID,
  PRODUCTION_DB_ENDPOINT_ID,
} from "../../scripts/deploy-migrate-guard.mjs";
import { decideSeedTarget, smmCourse, smmSeedSql } from "../../scripts/seed-courses-lib.mjs";
import { socialMediaProgram } from "@/lib/pages/programs";

const password = "s3cret-password";
const url = (host: string) => `postgresql://app:${password}@${host}/neondb?sslmode=require`;
const env = (host: string) => ({ DATABASE_URL: url(host) });

describe("decideSeedTarget", () => {
  it("accepts the dev direct and pooler hosts", () => {
    for (const host of [
      `${PREVIEW_DB_ENDPOINT_ID}.eu-west-2.aws.neon.tech`,
      `${PREVIEW_DB_ENDPOINT_ID}-pooler.eu-west-2.aws.neon.tech`,
    ]) {
      expect(decideSeedTarget(env(host))).toEqual({ ok: true, endpointId: PREVIEW_DB_ENDPOINT_ID });
    }
  });

  it("refuses production, other endpoints, localhost, missing and garbage", () => {
    const refused = [
      env(`${PRODUCTION_DB_ENDPOINT_ID}.eu-west-2.aws.neon.tech`),
      env(`${PRODUCTION_DB_ENDPOINT_ID}-pooler.eu-west-2.aws.neon.tech`),
      env("ep-other-name-123456.eu-west-2.aws.neon.tech"),
      env("localhost:5432"),
      env("ep-wispy-rice-abpfeozn-extra.eu-west-2.aws.neon.tech"),
      {},
      { DATABASE_URL: "   " },
      { DATABASE_URL: "not a url" },
      { DATABASE_URL: "file:./local.db" },
    ];
    for (const e of refused) {
      const decision = decideSeedTarget(e);
      expect(decision.ok).toBe(false);
      expect(JSON.stringify(decision)).not.toContain(password);
    }
  });
});

describe("smmSeedSql", () => {
  const text = smmSeedSql();

  it("is one guarded DO block with upserts", () => {
    expect(text.startsWith("DO $$")).toBe(true);
    expect(text.trimEnd().endsWith("END $$;")).toBe(true);
    expect(text).toContain(`current_setting('neon.endpoint_id', true) = '${PREVIEW_DB_ENDPOINT_ID}'`);
    expect(text.indexOf("RAISE EXCEPTION")).toBeLessThan(text.indexOf('INSERT INTO "courses"'));
    expect(text).toContain('ON CONFLICT ("slug") DO UPDATE');
    expect(text).toContain('ON CONFLICT ("id") DO UPDATE');
    expect(text).toContain("'seed-smm-outcome-01'");
    expect(text).toContain("'seed-smm-who-04'");
  });

  it("never removes data and never sets a price or cohort", () => {
    expect(text).not.toMatch(/\b(DELETE|DROP|TRUNCATE)\b/i);
    expect(text).not.toMatch(/"amount"|cohorts/i);
    expect(text).toContain("'published', 'GHS', true");
  });

  it("matches the site copy word for word", () => {
    const section = (heading: string) =>
      socialMediaProgram.sections.find((s) => s.heading === heading)?.items ?? [];
    expect(smmCourse.summary).toBe(socialMediaProgram.paragraphs[0]);
    expect(smmCourse.outcomes).toEqual(section("What you'll develop"));
    expect(smmCourse.whoItsFor).toEqual(section("Who it's for"));
    for (const line of [smmCourse.summary, ...smmCourse.outcomes, ...smmCourse.whoItsFor]) {
      expect(text).toContain(line);
    }
  });

  it("keeps apostrophes safe inside dollar quotes", () => {
    const sql = smmSeedSql({ ...smmCourse, summary: "It's a learner's course.", outcomes: ["Don't stop"], whoItsFor: ["Who it's for"] });
    expect(sql).toContain("$seed$It's a learner's course.$seed$");
    expect(sql).toContain("$seed$Don't stop$seed$");
    expect(() => smmSeedSql({ ...smmCourse, summary: "bad $seed$ text" })).toThrow();
  });
});
