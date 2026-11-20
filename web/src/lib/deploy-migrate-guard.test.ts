import { describe, expect, it } from "vitest";
import {
  PREVIEW_DB_ENDPOINT_ID,
  PRODUCTION_DB_ENDPOINT_ID,
  decideDeployMigration,
} from "../../scripts/deploy-migrate-guard.mjs";

const password = "s3cret-password";

function url(host: string) {
  return `postgresql://app:${password}@${host}/neondb?sslmode=require`;
}

const devHost = `${PREVIEW_DB_ENDPOINT_ID}.eu-west-2.aws.neon.tech`;
const devPooler = `${PREVIEW_DB_ENDPOINT_ID}-pooler.eu-west-2.aws.neon.tech`;
const prodHost = `${PRODUCTION_DB_ENDPOINT_ID}.eu-west-2.aws.neon.tech`;
const prodPooler = `${PRODUCTION_DB_ENDPOINT_ID}-pooler.eu-west-2.aws.neon.tech`;

function assertNoSecret(message: string) {
  expect(message).not.toContain(password);
  expect(message).not.toContain("postgresql://");
}

describe("decideDeployMigration preview guard", () => {
  it("allows the Neon dev host", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview", DATABASE_URL: url(devHost) });
    expect(decision.action).toBe("migrate");
    expect(decision.message).toContain(PREVIEW_DB_ENDPOINT_ID);
    assertNoSecret(decision.message);
  });

  it("allows the Neon dev pooler host", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview", DATABASE_URL: url(devPooler) });
    expect(decision.action).toBe("migrate");
    expect(decision.message).toContain(PREVIEW_DB_ENDPOINT_ID);
    assertNoSecret(decision.message);
  });

  it("refuses the production host", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview", DATABASE_URL: url(prodHost) });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain(PRODUCTION_DB_ENDPOINT_ID);
    expect(decision.message).toContain("production");
    assertNoSecret(decision.message);
  });

  it("refuses the production pooler host", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview", DATABASE_URL: url(prodPooler) });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain(PRODUCTION_DB_ENDPOINT_ID);
    assertNoSecret(decision.message);
  });

  it("refuses an unknown host", () => {
    const decision = decideDeployMigration({
      VERCEL_ENV: "preview",
      DATABASE_URL: url("ep-other-branch-ab999999.eu-west-2.aws.neon.tech"),
    });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain("ep-other-branch-ab999999");
    assertNoSecret(decision.message);
  });

  it("refuses a host that only shares the dev endpoint prefix", () => {
    const decision = decideDeployMigration({
      VERCEL_ENV: "preview",
      DATABASE_URL: url(`${PREVIEW_DB_ENDPOINT_ID}extra.eu-west-2.aws.neon.tech`),
    });
    expect(decision.action).toBe("fail");
  });

  it("refuses a missing connection string", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview" });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain("missing");
    assertNoSecret(decision.message);
  });

  it("refuses a blank connection string", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "preview", DATABASE_URL: "   " });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain("missing");
  });

  it("refuses an unparseable connection string", () => {
    const decision = decideDeployMigration({
      VERCEL_ENV: "preview",
      DATABASE_URL: "not a url",
    });
    expect(decision.action).toBe("fail");
    expect(decision.message).toContain("could not be parsed");
    assertNoSecret(decision.message);
  });
});

describe("decideDeployMigration production and other environments", () => {
  it("migrates production against any host, including production", () => {
    const decision = decideDeployMigration({
      VERCEL_ENV: "production",
      DATABASE_URL: url(prodHost),
    });
    expect(decision.action).toBe("migrate");
    expect(decision.message).toBe(
      "[deploy] Production deploy — running Payload migrations before the build.",
    );
  });

  it("migrates production even when the URL is the dev endpoint", () => {
    const decision = decideDeployMigration({
      VERCEL_ENV: "production",
      DATABASE_URL: url(devHost),
    });
    expect(decision.action).toBe("migrate");
  });

  it("still fails a production build that has no DATABASE_URL", () => {
    const decision = decideDeployMigration({ VERCEL_ENV: "production" });
    expect(decision.action).toBe("fail");
    expect(decision.message).toBe(
      "[deploy] Production build has no DATABASE_URL; refusing to continue.",
    );
  });

  it("skips development and an unset VERCEL_ENV", () => {
    expect(decideDeployMigration({ VERCEL_ENV: "development", DATABASE_URL: url(devHost) }).action).toBe(
      "skip",
    );
    expect(decideDeployMigration({ DATABASE_URL: url(prodHost) }).action).toBe("skip");
  });
});
