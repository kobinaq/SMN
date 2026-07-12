import { describe, expect, it } from "vitest";
import { youtubeEmbedUrl } from "@/lib/youtube";

describe("youtubeEmbedUrl", () => {
  it("converts YouTube watch URLs to privacy-enhanced embeds", () => {
    expect(youtubeEmbedUrl("https://www.youtube.com/watch?v=abc123XYZ")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123XYZ",
    );
  });

  it("converts youtu.be share URLs", () => {
    expect(youtubeEmbedUrl("https://youtu.be/abc123XYZ?si=share")).toBe(
      "https://www.youtube-nocookie.com/embed/abc123XYZ",
    );
  });

  it("returns an empty string for invalid URLs", () => {
    expect(youtubeEmbedUrl("not a url")).toBe("");
  });
});
