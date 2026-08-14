import { describe, expect, it } from "vitest";
import { lexicalToParagraphs, lexicalToPlainText } from "@/lib/lexical-text";

const sample = {
  root: {
    children: [
      { children: [{ text: "First paragraph." }] },
      { children: [{ text: "Second paragraph." }] },
    ],
  },
};

describe("lexical text", () => {
  it("joins top-level nodes as paragraphs", () => {
    expect(lexicalToPlainText(sample)).toBe("First paragraph.\n\nSecond paragraph.");
    expect(lexicalToParagraphs(sample)).toEqual(["First paragraph.", "Second paragraph."]);
  });

  it("returns empty for missing documents", () => {
    expect(lexicalToPlainText(null)).toBe("");
    expect(lexicalToParagraphs(undefined)).toEqual([]);
  });
});
