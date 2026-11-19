import { describe, expect, it } from "vitest";
import * as about from "@/lib/pages/about";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("About page copy", () => {
  it("uses the document hero", () => {
    expect(about.aboutHero.title).toBe("Building stronger social media marketing capabilities.");
    expect(about.aboutHero.ctaHref).toBe("/programs");
  });

  it("keeps the founder biography as written, including the source typos", () => {
    expect(about.aboutFounder.paragraphs[0]).toContain("social mediaategist");
    expect(about.aboutFounder.paragraphs[0]).toContain("lifestyle and consumer and brands");
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
