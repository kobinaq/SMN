import { describe, expect, it } from "vitest";
import { filterBySections, isHiddenBySections } from "./section-visibility";

describe("section visibility", () => {
  const links = [
    { label: "About", href: "/about" },
    { label: "Agency", href: "/agency" },
    { label: "Brief", href: "/agency/brief?x=1" },
    { label: "Events", href: "/events" },
    { label: "Event", href: "/events/launch" },
    { label: "Agencyish", href: "/agencyish" },
    { label: "Mail", href: "mailto:hi@example.com" },
  ];

  it("hides both when toggles are off or missing", () => {
    expect(filterBySections(links, {}).map((l) => l.label)).toEqual(["About", "Agencyish", "Mail"]);
    expect(filterBySections(links, null).map((l) => l.label)).toEqual(["About", "Agencyish", "Mail"]);
  });

  it("shows each section independently", () => {
    expect(filterBySections(links, { showAgency: true }).map((l) => l.label)).toEqual([
      "About", "Agency", "Brief", "Agencyish", "Mail",
    ]);
    expect(filterBySections(links, { showEvents: true }).map((l) => l.label)).toEqual([
      "About", "Events", "Event", "Agencyish", "Mail",
    ]);
  });

  it("shows everything when both are on", () => {
    expect(filterBySections(links, { showAgency: true, showEvents: true })).toHaveLength(links.length);
  });

  it("handles empty input and absolute URLs", () => {
    expect(filterBySections(undefined, {})).toEqual([]);
    expect(isHiddenBySections("https://example.com/agency", {})).toBe(false);
  });
});
