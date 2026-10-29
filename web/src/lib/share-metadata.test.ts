import { describe, expect, it } from "vitest";
import { itemShareImages } from "@/lib/share-metadata";

describe("itemShareImages", () => {
  const parent = {
    openGraphImages: [
      {
        url: new URL("http://127.0.0.1:3000/opengraph-image-12o0cb?x"),
        width: 1200,
        height: 630,
        alt: "Site",
      },
    ],
    twitterImages: [
      {
        url: new URL("http://127.0.0.1:3000/twitter-image-12o0cb?y"),
        width: 1200,
        height: 630,
      },
    ],
  };

  it("uses the item image when present", () => {
    expect(itemShareImages("/media/event-cover.jpg", parent)).toEqual({
      openGraphImages: [{ url: "/media/event-cover.jpg" }],
      twitterImages: ["/media/event-cover.jpg"],
    });
  });

  it("forwards parent hashed share images when the item has none", () => {
    const share = itemShareImages(null, parent);
    const og = share.openGraphImages?.[0];
    expect(og && typeof og === "object" && "width" in og ? og.width : null).toBe(1200);
    expect(og && typeof og === "object" && "height" in og ? og.height : null).toBe(630);
    const ogUrl = og && typeof og === "object" && "url" in og ? String(og.url) : String(og);
    expect(ogUrl).toContain("opengraph-image-");
    expect(ogUrl).not.toMatch(/\/opengraph-image$/);
    expect(share.twitterImages).toHaveLength(1);
  });

  it("returns empty fields when neither item nor parent images exist", () => {
    expect(itemShareImages(undefined)).toEqual({});
    expect(itemShareImages("")).toEqual({});
    expect(itemShareImages("   ", {})).toEqual({});
  });
});
