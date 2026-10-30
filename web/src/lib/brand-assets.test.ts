import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/app/manifest";

const root = process.cwd();

/** PNG width/height from the IHDR chunk. */
function pngSize(file: string) {
  const buf = readFileSync(join(root, file));
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

describe("TSA brand assets (T12)", () => {
  it("ships the four logo files at the sizes BrandLogo declares", () => {
    expect(pngSize("public/brand/tsa-logo-full-white.png")).toEqual({ width: 558, height: 320 });
    expect(pngSize("public/brand/tsa-logo-full-blue.png")).toEqual({ width: 558, height: 320 });
    expect(pngSize("public/brand/tsa-logo-mark-white.png")).toEqual({ width: 566, height: 192 });
    expect(pngSize("public/brand/tsa-logo-mark-blue.png")).toEqual({ width: 566, height: 192 });
  });

  it("has square app icons and no leftover SMN icon or logo files", () => {
    expect(pngSize("src/app/icon.png")).toEqual({ width: 512, height: 512 });
    expect(pngSize("src/app/apple-icon.png")).toEqual({ width: 180, height: 180 });
    expect(existsSync(join(root, "src/app/icon.svg"))).toBe(false);
    expect(existsSync(join(root, "public/images/Logos"))).toBe(false);
    expect(existsSync(join(root, "public/brand/logo-blue.png"))).toBe(false);
  });

  it("lists sized manifest icons that exist", () => {
    const icons = manifest().icons ?? [];
    expect(icons.length).toBeGreaterThan(0);
    for (const icon of icons) {
      const size = pngSize(join("public", icon.src));
      expect(`${size.width}x${size.height}`).toBe(icon.sizes);
    }
  });
});
