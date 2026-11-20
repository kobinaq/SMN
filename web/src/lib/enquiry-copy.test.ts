import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { ENQUIRY_REPLY_TIME_COPY } from "./enquiry-copy";

describe("ENQUIRY_REPLY_TIME_COPY", () => {
  it("is the agreed sentence", () => {
    expect(ENQUIRY_REPLY_TIME_COPY).toBe("We reply within 48 hours.");
  });

  it.each(["ContactForm.tsx", "EnquiryForm.tsx"])("%s renders the shared constant, not a literal", (file) => {
    const source = readFileSync(new URL(`../components/forms/${file}`, import.meta.url), "utf8");
    expect(source).toContain('import { ENQUIRY_REPLY_TIME_COPY } from "@/lib/enquiry-copy"');
    expect(source).not.toContain(ENQUIRY_REPLY_TIME_COPY);
    expect(source.match(/\{ENQUIRY_REPLY_TIME_COPY\}/g)?.length).toBe(2);
  });
});
