import { describe, expect, it } from "vitest";
import * as partner from "@/lib/pages/partner";
import { findCopyViolations } from "@/lib/pages/copy-rules";

describe("Partner page copy (T8)", () => {
  it("uses the Tab 4 hero", () => {
    expect(partner.partnerHero.title).toBe("Build with the next generation of marketers.");
    expect(partner.partnerHero.title).not.toMatch(/talent/i);
  });

  it("follows Tab 5 copy rules", () => {
    expect(findCopyViolations(partner)).toEqual([]);
  });

  it("keeps the three Tab 4 partnership areas with contact CTAs", () => {
    expect(partner.partnerAreas.map((area) => [area.title, area.ctaLabel, area.href])).toEqual([
      ["Sponsorship", "Discuss Sponsorship", "/contact?type=Sponsorship"],
      ["Events", "Partner on an Event", "/contact?type=Collaboration"],
      ["Simulations", "Create a Simulation", "/contact?type=Simulation%20waitlist"],
    ]);
  });

  it("labels simulations clearly (Tab 5 section 10)", () => {
    const simulations = partner.partnerAreas.find((area) => area.id === "simulations");
    expect(simulations?.note).toMatch(/clearly labelled simulations/);
  });

  it("presents the Agency as separate from the Academy, with a contact CTA", () => {
    expect(partner.agency.title).toBe("Social Media, Storytelling & Content");
    expect(partner.agency.focusAreas.map((area) => area.title)).toEqual(["Social Media", "Storytelling", "Content"]);
    expect(partner.agency.body).toMatch(/separately from the Academy/);
    expect(partner.agency.ctaLabel).toBe("Work With Think Social Agency");
    expect(partner.agency.href).toMatch(/^\/contact\?type=/);
  });
});
