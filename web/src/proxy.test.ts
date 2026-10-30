import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { config, hasUndecodableSegment, proxy, UNDECODABLE_PATH_REWRITE } from "@/proxy";

describe("hasUndecodableSegment", () => {
  it("flags paths with a malformed percent-escape", () => {
    expect(hasUndecodableSegment("/verify/%E0%A4%A")).toBe(true);
    expect(hasUndecodableSegment("/verify/%E0%A4")).toBe(true);
    expect(hasUndecodableSegment("/events/%E0%A4%A")).toBe(true);
    expect(hasUndecodableSegment("/verify/%")).toBe(true);
  });

  it("accepts plain and well-formed encoded paths", () => {
    expect(hasUndecodableSegment("/")).toBe(false);
    expect(hasUndecodableSegment("/verify/SMN-DEMO-001")).toBe(false);
    expect(hasUndecodableSegment("/verify/%20SMN-DEMO-001%20")).toBe(false);
    expect(hasUndecodableSegment("/verify/%25")).toBe(false);
    expect(hasUndecodableSegment("/verify/%E2%9C%93")).toBe(false);
  });
});

describe("proxy", () => {
  it("rewrites an undecodable path to the 404 page", () => {
    const response = proxy(new NextRequest("http://localhost/verify/%E0%A4%A?x=1"));
    expect(response.status).toBe(404);
    expect(response.headers.get("x-middleware-rewrite")).toBe(
      `http://localhost${UNDECODABLE_PATH_REWRITE}`,
    );
  });

  it("lets a valid path through", () => {
    const response = proxy(new NextRequest("http://localhost/verify/SMN-DEMO-001"));
    expect(response.headers.get("x-middleware-next")).toBe("1");
    expect(response.headers.get("x-middleware-rewrite")).toBeNull();
  });
});

describe("proxy matcher", () => {
  const matcher = new RegExp(`^${config.matcher[0]}$`);

  it("covers site routes", () => {
    for (const path of ["/verify/x", "/events/x", "/apply", "/apiary", "/administer"]) {
      expect(matcher.test(path)).toBe(true);
    }
  });

  it("skips Next assets, the favicon, /api and /admin", () => {
    for (const path of [
      "/_next/static/chunk.js",
      "/_next/image",
      "/favicon.ico",
      "/api",
      "/api/media/file/x",
      "/admin",
      "/admin/collections/x",
    ]) {
      expect(matcher.test(path)).toBe(false);
    }
  });
});
