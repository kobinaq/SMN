import { describe, expect, it } from "vitest";
import * as programs from "@/lib/pages/programs";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("Programs copy", () => {
  it("keeps the three offers and their public URLs", () => {
    expect(programs.programs.map((program) => [program.title, program.href])).toEqual([
      ["Social Media Marketing Program", "/programs/social-media-marketing"],
      ["Specialised One-on-One Training", "/programs/one-on-one-training"],
      ["Organisational Training", "/programs/organisational-training"],
    ]);
  });

  it("does not publish fees, dates, or a universal duration", () => {
    const text = JSON.stringify(programs);
    expect(text).not.toMatch(/GH₵|GHS|\bweeks?\b|\$\d|cohort date|\bfees?\b/i);
  });

  it("keeps both one-on-one leave-with lists from the document", () => {
    const headings = programs.oneOnOneProgram.sections.map((section) => section.heading);
    expect(headings).toContain("What you leave with");
    expect(headings).toContain("What you'll leave with");
  });

  it("follows the public copy rules", () => {
    expect(findCopyViolations(programs)).toEqual([]);
  });
});
