import { describe, expect, it } from "vitest";
import * as copy from "@/lib/community-copy";
import { cta } from "@/lib/cta";

function allStrings(value: unknown): string[] {
  if (typeof value === "string") return [value];
  if (Array.isArray(value)) return value.flatMap(allStrings);
  if (value && typeof value === "object") return Object.values(value).flatMap(allStrings);
  return [];
}

const text = allStrings(copy).join("\n");

describe("community copy (T7)", () => {
  it("has no em dashes", () => {
    expect(text).not.toMatch(/\u2014|&mdash;/);
  });

  it("does not promise jobs, internships, placements or income", () => {
    expect(text).not.toMatch(/\b(jobs?|internships?|placements?|income|hire|hiring|guarantee\w*)\b/i);
  });

  it("does not describe TSA as a professional network or a WhatsApp group", () => {
    expect(text).not.toMatch(/professional network|whatsapp/i);
    expect(text).not.toMatch(/\bSMN\b|Social Marketers/);
  });

  it("joins through signup, with WhatsApp as a secondary updates link", () => {
    expect(cta.joinCommunity.href).toBe("/signup");
    expect(cta.whatsapp.communityLabel).toBe("Also get TSA updates on WhatsApp");
    expect(copy.communityMentors.href).toBe("/community/mentors");
  });
});
