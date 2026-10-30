import { describe, expect, it } from "vitest";
import * as about from "@/lib/pages/about";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("About page copy (T10)", () => {
  it("uses the Tab 4 hero belief", () => {
    expect(about.aboutHero.title).toBe(
      "We believe people should learn how to think, not just what to post.",
    );
  });

  it("follows Tab 5 copy rules", () => {
    expect(findCopyViolations(about)).toEqual([]);
  });

  it("keeps the six Why choose TSA reasons and the four-stage framework", () => {
    expect(about.aboutWhyChoose).toHaveLength(6);
    expect(about.aboutPhilosophy.map((stage) => stage.title)).toEqual(["Learn", "Apply", "Grow", "Connect"]);
  });

  it("does not make confidence the central promise in the mission", () => {
    expect(about.aboutMission.toLowerCase()).not.toContain("confidence");
  });

  it("presents the Agency as separate from the Academy", () => {
    const agency = about.aboutEcosystem.find((item) => item.title === "Think Social Agency");
    expect(agency?.body).toMatch(/not an Academy programme/);
    expect(agency?.href).toBe("/partner#agency");
  });

  it("credits the founder under the TSA name", () => {
    expect(about.aboutFounder.role).toBe("Founder, Think Social Academy");
    expect(about.aboutFounder.story.join(" ")).toContain("founded Think Social Academy");
  });
});
