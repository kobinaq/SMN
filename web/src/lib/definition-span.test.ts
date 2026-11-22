import { describe, expect, it } from "vitest";
import { definitionCellSpan } from "./definition-span";

describe("definitionCellSpan", () => {
  it("lets the fifth item of a 2-column grid fill the last row", () => {
    const spans = [0, 1, 2, 3, 4].map((index) => definitionCellSpan(index, 5, 2));
    expect(spans).toEqual([undefined, undefined, undefined, undefined, "md:col-span-2"]);
  });

  it("does not span a complete last row", () => {
    expect(definitionCellSpan(3, 4, 2)).toBeUndefined();
    expect(definitionCellSpan(5, 6, 3)).toBeUndefined();
  });

  it("fills a 3-column row that has one or two items", () => {
    expect(definitionCellSpan(3, 4, 3)).toBe("md:col-span-3");
    expect(definitionCellSpan(3, 5, 3)).toBeUndefined();
    expect(definitionCellSpan(4, 5, 3)).toBe("md:col-span-2");
  });
});
