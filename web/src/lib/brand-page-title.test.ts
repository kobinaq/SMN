import { describe, expect, it } from "vitest";
import { pageTitle } from "@/lib/brand";
import { site } from "@/lib/site";

describe("pageTitle", () => {
  it("builds portal titles from the short brand name", () => {
    expect(pageTitle("Event ticket")).toEqual({
      absolute: `Event ticket | ${site.shortName}`,
    });
  });

  it("builds staff titles with the Staff suffix", () => {
    expect(pageTitle("People", { staff: true })).toEqual({
      absolute: `People | ${site.shortName} Staff`,
    });
  });
});
