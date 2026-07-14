import { describe, expect, it } from "vitest";
import { failJson, okJson } from "@/lib/api-response";

describe("api-response helpers", () => {
  it("returns success payloads with ok flag by default", async () => {
    const response = okJson();
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ ok: true });
  });

  it("returns safe client-facing error bodies", async () => {
    const response = failJson("Sign in required.", 401);
    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({ error: "Sign in required." });
  });
});
