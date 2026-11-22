import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { migrations } from "./index";

const step1 = "20261122_125035_phase_2e_cms_pages_category_value";
const step2 = "20261122_125036_phase_2e_category_rows";

// Prose comments and the `ON DELETE/UPDATE <action>` clauses of a foreign key are not removals.
const code = (name: string) =>
  readFileSync(new URL(`./${name}.ts`, import.meta.url), "utf8")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/^\s*(--|\/\/).*$/gm, "")
    .replace(/\bON\s+(DELETE|UPDATE)\s+(cascade|set\s+null|no\s+action)/gi, "");

describe("phase 2E migrations", () => {
  it("are registered last, in order, right after Phase 2D", () => {
    const names = migrations.map((migration) => migration.name);
    expect(names.slice(-3)).toEqual(["20261122_122558_phase_2d_page_editor", step1, step2]);
  });

  it("step 1 is additive and guarded", () => {
    const sql = code(step1);
    for (const word of ["DROP", "DELETE", "TRUNCATE", "RENAME", "UPDATE"]) {
      expect(sql, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
    }
    expect(sql).not.toMatch(/ALTER\s+COLUMN/i);
    expect(sql).not.toMatch(/SET\s+DATA\s+TYPE/i);
    const adds = sql.match(/ADD\s+COLUMN\b/gi) ?? [];
    expect(adds.length).toBeGreaterThan(0);
    expect(sql.match(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\b/gi)).toHaveLength(adds.length);
    const values = sql.match(/ADD\s+VALUE\b/gi) ?? [];
    expect(values).toHaveLength(2);
    expect(sql.match(/ADD\s+VALUE\s+IF\s+NOT\s+EXISTS\s+'Content Marketing and Planning'/gi)).toHaveLength(2);
    const types = sql.match(/CREATE\s+TYPE\b/gi) ?? [];
    expect(sql.match(/EXCEPTION WHEN duplicate_object THEN NULL/g)).toHaveLength(types.length);
  });

  it("step 2 only moves rows off the legacy '&' category value", () => {
    const sql = code(step2);
    for (const word of ["DROP", "DELETE", "TRUNCATE", "RENAME", "ALTER", "CREATE", "INSERT"]) {
      expect(sql, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
    }
    const updates = sql.match(/UPDATE\s+"[a-z_]+"[^;]*;/gi) ?? [];
    expect(updates).toHaveLength(2);
    for (const statement of updates) {
      expect(statement).toMatch(/^UPDATE\s+"(posts|resources)"\s+SET\s+"category"\s*=\s*'Content Marketing and Planning'\s+WHERE\s+"category"\s*=\s*'Content Marketing & Planning';$/i);
    }
  });
});
