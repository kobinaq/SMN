import { describe, expect, it } from "vitest";
import { validateHref, validateHttpsUrl, validateOptionalHref, validatePageSlug } from "./link-validation";

describe("validateHref", () => {
  it.each(["/", "/about", "/contact?type=x", "#faq", "mailto:a@b.co", "tel:+233201234567", "https://example.com/x"])(
    "accepts %s",
    (v) => expect(validateHref(v)).toBe(true),
  );
  it.each([
    "", "  ", "//evil.com", "javascript:alert(1)", " javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,x",
    "http://example.com", "about", "#", "ftp://x.com", "/a b", "https://", "mailto:", "tel:abc",
  ])("rejects %j", (v) => expect(validateHref(v)).not.toBe(true));
});

describe("optional and https", () => {
  it("optional allows empty", () => {
    expect(validateOptionalHref("")).toBe(true);
    expect(validateOptionalHref(undefined)).toBe(true);
    expect(validateOptionalHref("http://x.com")).not.toBe(true);
  });
  it("https only", () => {
    expect(validateHttpsUrl("https://instagram.com/x")).toBe(true);
    expect(validateHttpsUrl("/relative")).not.toBe(true);
    expect(validateHttpsUrl("mailto:a@b.co")).not.toBe(true);
  });
});

describe("validatePageSlug", () => {
  it.each(["home", "about-us", "a1"])("accepts %s", (v) => expect(validatePageSlug(v)).toBe(true));
  it.each(["", "About", "a_b", "a--b", "-a", "a-", "a/b", "a b"])("rejects %j", (v) =>
    expect(validatePageSlug(v)).not.toBe(true),
  );
});
