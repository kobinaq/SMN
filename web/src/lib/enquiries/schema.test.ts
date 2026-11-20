import { describe, expect, it } from "vitest";
import { isHoneypotFilled, parseEnquiryBody } from "@/lib/enquiries/schema";

const contact = {
  type: "contact",
  email: "Ada@Example.com",
  name: "Ada Lovelace",
  message: "I would like to talk about a workshop.",
};

describe("parseEnquiryBody", () => {
  it("accepts a contact enquiry and lowercases the email", () => {
    const parsed = parseEnquiryBody({ ...contact, extra: "ignored", website: "" });
    expect(parsed).toEqual({
      ok: true,
      data: {
        type: "contact",
        email: "ada@example.com",
        name: "Ada Lovelace",
        message: "I would like to talk about a workshop.",
      },
    });
  });

  it("allows newsletter signups without a name or message", () => {
    const parsed = parseEnquiryBody({ type: "newsletter", email: "reader@example.com" });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.name).toBeUndefined();
      expect(parsed.data.message).toBeUndefined();
    }
  });

  it("requires name and message for every type except newsletter", () => {
    const parsed = parseEnquiryBody({ type: "partnership", email: "ada@example.com", name: "   " });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.name).toEqual(["Name is required."]);
      expect(parsed.fieldErrors.message).toEqual(["Message is required."]);
    }
  });

  it("rejects an unknown type, a bad email, and over-long fields", () => {
    const parsed = parseEnquiryBody({
      type: "agency",
      email: "not-an-email",
      name: "A".repeat(121),
      phone: "1".repeat(41),
      organisation: "O".repeat(161),
      message: "M".repeat(5001),
      sourcePage: "/".repeat(301),
    });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) {
      expect(parsed.fieldErrors.type?.[0]).toMatch(/type/i);
      expect(parsed.fieldErrors.email?.[0]).toMatch(/email/i);
      expect(parsed.fieldErrors.name?.[0]).toMatch(/120/);
      expect(parsed.fieldErrors.phone?.[0]).toMatch(/40/);
      expect(parsed.fieldErrors.organisation?.[0]).toMatch(/160/);
      expect(parsed.fieldErrors.message?.[0]).toMatch(/5000/);
      expect(parsed.fieldErrors.sourcePage?.[0]).toMatch(/300/);
    }
  });

  it("rejects an email longer than 254 characters", () => {
    const parsed = parseEnquiryBody({
      ...contact,
      email: `${"a".repeat(250)}@example.com`,
    });
    expect(parsed.ok).toBe(false);
    if (!parsed.ok) expect(parsed.fieldErrors.email?.[0]).toMatch(/254/);
  });

  it("treats blank optional fields as absent", () => {
    const parsed = parseEnquiryBody({ ...contact, phone: "  ", organisation: "", sourcePage: "" });
    expect(parsed.ok).toBe(true);
    if (parsed.ok) {
      expect(parsed.data.phone).toBeUndefined();
      expect(parsed.data.organisation).toBeUndefined();
      expect(parsed.data.sourcePage).toBeUndefined();
    }
  });
});

describe("isHoneypotFilled", () => {
  it("is false when website is missing, blank, or null", () => {
    expect(isHoneypotFilled({ email: "a@b.co" })).toBe(false);
    expect(isHoneypotFilled({ website: "" })).toBe(false);
    expect(isHoneypotFilled({ website: "   " })).toBe(false);
    expect(isHoneypotFilled({ website: null })).toBe(false);
  });

  it("is true when website has any value", () => {
    expect(isHoneypotFilled({ website: "https://spam.test" })).toBe(true);
    expect(isHoneypotFilled({ website: 1 })).toBe(true);
  });
});
