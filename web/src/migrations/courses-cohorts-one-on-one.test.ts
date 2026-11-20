import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const source = readFileSync(
  new URL("./20261120_140000_courses_cohorts_one_on_one.ts", import.meta.url),
  "utf8",
);

// Comments are prose and the `ON DELETE <action>` clause of a foreign key is
// not a row removal, so neither counts as a keyword.
const code = source
  .replace(/\/\*[\s\S]*?\*\//g, "")
  .replace(/^\s*(--|\/\/).*$/gm, "")
  .replace(/\bON\s+DELETE\s+(cascade|set\s+null|no\s+action)/gi, "");

describe("courses_cohorts_one_on_one migration", () => {
  it("contains no destructive keywords", () => {
    for (const word of ["DROP", "DELETE", "TRUNCATE", "RENAME"]) {
      expect(code, word).not.toMatch(new RegExp(`\\b${word}\\b`, "i"));
    }
    expect(code).not.toMatch(/ALTER\s+COLUMN/i);
  });

  it("creates every table with IF NOT EXISTS", () => {
    const creates = code.match(/CREATE\s+TABLE\b/gi) ?? [];
    const safe = code.match(/CREATE\s+TABLE\s+IF\s+NOT\s+EXISTS\b/gi) ?? [];
    expect(creates.length).toBeGreaterThan(0);
    expect(safe).toHaveLength(creates.length);
  });

  it("adds every column with IF NOT EXISTS", () => {
    const adds = code.match(/ADD\s+COLUMN\b/gi) ?? [];
    const safe = code.match(/ADD\s+COLUMN\s+IF\s+NOT\s+EXISTS\b/gi) ?? [];
    expect(adds.length).toBeGreaterThan(0);
    expect(safe).toHaveLength(adds.length);
  });

  it("creates every index with IF NOT EXISTS and guards types and constraints", () => {
    expect(code.match(/CREATE\s+INDEX\b(?!\s+IF\s+NOT\s+EXISTS)/gi)).toBeNull();
    const guarded = code.match(/EXCEPTION WHEN duplicate_object THEN NULL/g) ?? [];
    const risky = code.match(/CREATE\s+TYPE\b|ADD\s+CONSTRAINT\b/gi) ?? [];
    expect(guarded.length).toBeGreaterThanOrEqual(risky.length);
  });
});
