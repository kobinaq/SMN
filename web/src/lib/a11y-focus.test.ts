import { describe, expect, it } from "vitest";
import { resolveTabWrapTarget } from "@/lib/a11y-focus";

describe("resolveTabWrapTarget", () => {
  const items = ["close", "topic", "goal", "submit"];

  it("wraps forward from the last control to the first", () => {
    expect(resolveTabWrapTarget(items, 3, false)).toBe("close");
  });

  it("wraps backward from the first control to the last", () => {
    expect(resolveTabWrapTarget(items, 0, true)).toBe("submit");
  });

  it("leaves mid-list Tab movement to the browser", () => {
    expect(resolveTabWrapTarget(items, 1, false)).toBeNull();
    expect(resolveTabWrapTarget(items, 2, true)).toBeNull();
  });

  it("treats a missing active element as needing a wrap to the start", () => {
    expect(resolveTabWrapTarget(items, -1, false)).toBe("close");
  });

  it("returns null for an empty trap", () => {
    expect(resolveTabWrapTarget([], 0, false)).toBeNull();
  });
});
