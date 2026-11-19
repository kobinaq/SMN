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

  it("uses one deduplicated one-on-one leave-with list", () => {
    const leave = programs.oneOnOneProgram.sections.find((section) => section.heading === "What you leave with");
    expect(programs.oneOnOneProgram.sections.filter((section) => /leave with/i.test(section.heading))).toHaveLength(1);
    expect(leave?.items).toEqual([
      "A certificate",
      "A 30-day content calendar",
      "Mentorship for your next opportunity",
      "Practical skills relevant to your role, industry and objectives.",
      "Industry-specific social media strategies tailored to your business or organizational needs.",
      "Platform knowledge and the ability to use relevant social media platforms effectively.",
      "Practical resources including templates, guides, kits and implementation materials to support continued application.",
    ]);
  });

  it("follows the public copy rules", () => {
    expect(findCopyViolations(programs)).toEqual([]);
  });
});
