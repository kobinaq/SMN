import { describe, expect, it } from "vitest";
import {
  COURSE_FEE_PENDING_LABEL,
  FEE_PENDING_LABEL,
  formatGhs,
  formatGhsLabel,
} from "@/lib/currency";

describe("currency formatting", () => {
  it("formats confirmed amounts as GH₵X,XXX", () => {
    expect(formatGhs(2500)).toBe("GH₵2,500");
    expect(formatGhs(450)).toBe("GH₵450");
  });

  it("normalises legacy GHS labels when numeric", () => {
    expect(formatGhsLabel("GHS 2,500")).toBe("GH₵2,500");
    expect(formatGhsLabel("GH₵450")).toBe("GH₵450");
  });

  it("preserves pending / contact wording", () => {
    expect(formatGhsLabel(FEE_PENDING_LABEL)).toBe(FEE_PENDING_LABEL);
    expect(formatGhsLabel(COURSE_FEE_PENDING_LABEL)).toBe(COURSE_FEE_PENDING_LABEL);
  });
});
