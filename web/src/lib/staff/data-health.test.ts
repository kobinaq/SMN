import { describe, expect, it } from "vitest";
import { describeDataFailure, loadOrDescribe, probeSchema, resetSchemaProbe } from "@/lib/staff/data-health";

describe("describeDataFailure", () => {
  it("names the missing table on Postgres", () => {
    const failure = describeDataFailure(
      new Error('Failed query: select * from "lms_sessions" — relation "lms_sessions" does not exist'),
      "the course catalogue",
    );
    expect(failure.message).toContain("lms_sessions");
    expect(failure.hint).toContain("db:migrate");
  });

  it("names the missing table on SQLite", () => {
    const failure = describeDataFailure(new Error("SQLITE_ERROR: no such table: users"), "the staff list");
    expect(failure.message).toContain("users");
    expect(failure.hint).toContain("db:migrate");
  });

  it("distinguishes an unreachable database from a schema gap", () => {
    const failure = describeDataFailure(new Error("connect ECONNREFUSED 10.0.0.1:5432"), "the course catalogue");
    expect(failure.message).toContain("did not answer");
    expect(failure.hint).toContain("DATABASE_URL");
  });

  it("falls back without inventing a cause", () => {
    const failure = describeDataFailure(new Error("something else entirely"), "the course catalogue");
    expect(failure.message).toBe("the course catalogue could not load.");
    expect(failure.hint).toBeUndefined();
    expect(failure.detail).toContain("something else entirely");
  });
});

describe("loadOrDescribe", () => {
  it("passes data through untouched when the load succeeds", async () => {
    const result = await loadOrDescribe("x", async () => ({ ok: 1 }));
    expect(result.failure).toBeNull();
    expect(result.data).toEqual({ ok: 1 });
  });

  it("reports rather than throws when the load fails", async () => {
    const result = await loadOrDescribe("the course catalogue", async () => {
      throw new Error('relation "lms_sessions" does not exist');
    });
    expect(result.data).toBeNull();
    expect(result.failure?.message).toContain("lms_sessions");
  });
});


describe("probeSchema", () => {
  function client(missing: string[], other: string[] = []) {
    const calls: string[] = [];
    return {
      calls,
      payload: {
        config: { collections: [...missing, ...other, "users"].map((slug) => ({ slug })) },
        async find({ collection }: { collection: string }) {
          calls.push(collection);
          if (missing.includes(collection)) throw new Error(`relation "${collection}" does not exist`);
          if (other.includes(collection)) throw new Error("permission denied for something else");
          return { docs: [] };
        },
      },
    };
  }

  it("reports only the collections whose table is missing", async () => {
    resetSchemaProbe();
    const { payload } = client(["lms-sessions", "lms-attendance"]);
    expect(await probeSchema(payload)).toEqual(["lms-sessions", "lms-attendance"]);
  });

  it("ignores failures that are not schema drift", async () => {
    resetSchemaProbe();
    const { payload } = client([], ["enrollments"]);
    expect(await probeSchema(payload)).toEqual([]);
  });

  it("probes once and serves the cached answer after that", async () => {
    resetSchemaProbe();
    const { payload, calls } = client(["lms-sessions"]);
    await probeSchema(payload);
    const afterFirst = calls.length;
    await probeSchema(payload);
    expect(calls.length).toBe(afterFirst);
  });

  it("returns nothing rather than throwing when the config has no collections", async () => {
    resetSchemaProbe();
    expect(await probeSchema({} as unknown)).toEqual([]);
  });
});
