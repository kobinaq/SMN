import { describe, expect, it } from "vitest";
import { headerTone, logoTone, pathMatches } from "./header-chrome";

describe("headerTone", () => {
  it("is light on the home hero before scroll and before the menu opens", () => {
    expect(headerTone("/", false, false)).toBe("light");
    expect(logoTone("light")).toBe("white");
  });

  it("is ink once the home page has scrolled or the menu is open", () => {
    expect(headerTone("/", true, false)).toBe("ink");
    expect(headerTone("/", false, true)).toBe("ink");
    expect(logoTone("ink")).toBe("blue");
  });

  it("is ink on every other path, including before hydration has a scroll position", () => {
    expect(headerTone("/about", false, false)).toBe("ink");
    expect(headerTone("/partnerships", false, false)).toBe("ink");
  });
});

describe("pathMatches", () => {
  it("marks Home current only on the exact home path", () => {
    expect(pathMatches("/", "/")).toBe(true);
    expect(pathMatches("/about", "/")).toBe(false);
  });

  it("marks a section current for its own path and descendants", () => {
    expect(pathMatches("/programs", "/programs")).toBe(true);
    expect(pathMatches("/programs/social-media-marketing", "/programs")).toBe(true);
    expect(pathMatches("/about", "/programs")).toBe(false);
  });
});
