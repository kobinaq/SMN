import { describe, expect, it } from "vitest";
import { describeDataFailure, loadOrDescribe } from "@/lib/staff/data-health";

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
