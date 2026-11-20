import { describe, expect, it } from "vitest";
import * as about from "@/lib/pages/about";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("About page copy", () => {
  it("uses the document hero", () => {
    expect(about.aboutHero.title).toBe("Building stronger social media marketing capabilities.");
    expect(about.aboutHero.ctaHref).toBe("/programs");
  });

  it("uses the corrected founder biography", () => {
    expect(about.aboutFounder.paragraphs[0]).toContain("social media strategist");
    expect(about.aboutFounder.paragraphs[0]).toContain("lifestyle and consumer brands");
    expect(about.aboutFounder.paragraphs[0]).not.toContain("mediaategist");
    expect(about.aboutFounder.role).toBe("Founder, Think Social Academy");
  });

  it("lists the five approach principles and four audiences", () => {
    expect(about.aboutApproach.items.map((item) => item.title)).toEqual([
      "Relevance",
      "Application",
      "Excellence",
      "Adaptability",
      "Opportunity",
    ]);
    expect(about.aboutAudience.items).toHaveLength(4);
  });

  it("follows the public copy rules", () => {
    expect(findCopyViolations(about)).toEqual([]);
  });
});
