import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { migrations } from "./index";

const name = "20261122_122558_phase_2d_page_editor";
const source = readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8");

// Prose comments and the `ON DELETE/UPDATE <action>` clauses of a foreign key are not removals.
const code = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*(--|\/\/).*$/gm, "")
  .replace(/\bON\s+(DELETE|UPDATE)\s+(cascade|set\s+null|no\s+action)/gi, "");

const existingTables = [
  "users",
  "media",
  "courses",
  "cohorts",
  "enrollments",
  "payments",
  "enquiries",
  "site_settings",
  "one_on_one",
  "payload_locked_documents",
  "payload_locked_documents_rels",
];

describe("phase_2d_page_editor migration", () => {
  it("is registered last, right after Phase 1C", () => {
    expect(migrations.at(-1)?.name).toBe(name);
    expect(migrations.at(-2)?.name).toBe("20261122_115410_phase_1c_enrollments_payments_enquiries");
  });

  it("contains no destructive keywords", () => {
    for (const word of ["DROP", "DELETE", "TRUNCATE", "RENAME", "UPDATE"]) {
      expect(code, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
    }
    expect(code).not.toMatch(/ALTER\s+COLUMN/i);
    expect(code).not.toMatch(/ADD\s+COLUMN/i);
    expect(code).not.toMatch(/ALTER\s+TYPE/i);
  });

  it("guards every table, index, type and constraint", () => {
    expect(code.match(/CREATE\s+TABLE\b/gi)?.length).toBeGreaterThan(0);
    expect(code.match(/CREATE\s+TABLE\b(?!\s+IF\s+NOT\s+EXISTS)/gi)).toBeNull();
    expect(code.match(/CREATE\s+(UNIQUE\s+)?INDEX\b(?!\s+IF\s+NOT\s+EXISTS)/gi)).toBeNull();
    const risky = code.match(/CREATE\s+TYPE\b|ADD\s+CONSTRAINT\b/gi) ?? [];
    const guarded = code.match(/EXCEPTION WHEN duplicate_object THEN NULL/g) ?? [];
    expect(risky.length).toBeGreaterThan(0);
    expect(guarded.length).toBe(risky.length);
  });

  it("only alters tables it creates", () => {
    const altered = [...code.matchAll(/ALTER\s+TABLE\s+"([a-z_]+)"/gi)].map((match) => match[1]);
    expect(altered.length).toBeGreaterThan(0);
    for (const table of altered) {
      expect(table, table).toMatch(/^(_?pages|_?header|_?footer)(_|$)/);
      expect(existingTables).not.toContain(table);
    }
  });
});
