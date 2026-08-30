import { describe, expect, it } from "vitest";
import { normalizeApplyTarget } from "./normalize";

describe("normalizeApplyTarget", () => {
  it("turns an email into a mailto link", () => {
    expect(normalizeApplyTarget("Jobs@Company.com")).toBe("mailto:jobs@company.com");
  });

  it("keeps an http(s) url as-is", () => {
    expect(normalizeApplyTarget("https://careers.acme.com/role")).toBe("https://careers.acme.com/role");
    expect(normalizeApplyTarget("http://acme.com/apply")).toBe("http://acme.com/apply");
  });

  it("assumes https for a bare domain", () => {
    expect(normalizeApplyTarget("careers.acme.com/role")).toBe("https://careers.acme.com/role");
  });

  it("rejects anything that is neither a link nor an email", () => {
    expect(normalizeApplyTarget("email me")).toBeNull();
    expect(normalizeApplyTarget("call the office")).toBeNull();
    expect(normalizeApplyTarget("")).toBeNull();
  });
});
