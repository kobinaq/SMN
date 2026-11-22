import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { migrations } from "./index";

const name = "20261122_115410_phase_1c_enrollments_payments_enquiries";
const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");

// Prose comments and the `ON DELETE <action>` clause of a foreign key are not removals.
const code = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*(--|\/\/).*$/gm, "")
  .replace(/\bON\s+DELETE\s+(cascade|set\s+null|no\s+action)/gi, "");

describe("phase_1c_enrollments_payments_enquiries migration", () => {
  it("is registered right after the courses and cohorts migration", () => {
    const names = migrations.map((migration) => migration.name);
    expect(names[names.indexOf(name) - 1]).toBe("20261120_140000_courses_cohorts_one_on_one");
  });

  it("contains no destructive keywords", () => {
    for (const word of ["DROP", "DELETE", "TRUNCATE", "RENAME"]) {
      expect(code, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
    }
    expect(code).not.toMatch(/ALTER\s+COLUMN/i);
    expect(code).not.toMatch(/SET\s+DATA\s+TYPE/i);
  });

  it("guards every column, index, enum value, type and constraint", () => {
    const adds = code.match(/ADD\s+COLUMN\b/gi) ?? [];
    expect(adds.length).toBeGreaterThan(0);
    expect(code.match(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\b/gi)).toHaveLength(adds.length);

    expect(code.match(/CREATE\s+INDEX\b(?!\s+IF\s+NOT\s+EXISTS)/gi)).toBeNull();

    const values = code.match(/ADD\s+VALUE\b/gi) ?? [];
    expect(values.length).toBeGreaterThan(0);
    expect(code.match(/ADD\s+VALUE\s+IF\s+NOT\s+EXISTS\b/gi)).toHaveLength(values.length);

    const risky = code.match(/CREATE\s+TYPE\b|ADD\s+CONSTRAINT\b/gi) ?? [];
    const guarded = code.match(/EXCEPTION WHEN duplicate_object THEN NULL/g) ?? [];
    expect(guarded.length).toBeGreaterThanOrEqual(risky.length);
  });

  it("only fills missing One-on-One values when updating rows", () => {
    const updates = code.match(/UPDATE\s+"[a-z_]+"[^;]*;/gi) ?? [];
    expect(updates.length).toBe(3);
    for (const statement of updates) {
      expect(statement).toMatch(/^UPDATE\s+"one_on_one"/i);
      expect(statement).toMatch(/WHERE\s+"[a-z_]+"\s+IS\s+NULL/i);
    }
  });

  it("does not touch enum_payments_kind unless it exists", () => {
    expect(code).toMatch(/IF to_regtype\('public\.enum_payments_kind'\) IS NOT NULL THEN[\s\S]*enum_payments_kind[\s\S]*END IF;/);
  });
});
