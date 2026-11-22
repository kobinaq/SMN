import { describe, expect, it, vi } from "vitest";
import { submitEnquiry, validateEnquiry, type EnquiryPayload } from "@/lib/enquiries";

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

const newsletter: EnquiryPayload = {
  type: "newsletter",
  email: "ada@example.com",
  sourcePage: "/resources",
  website: "",
};

describe("validateEnquiry", () => {
  it("accepts a newsletter with email only", () => {
    expect(validateEnquiry(newsletter)).toEqual({});
  });

  it("requires name and message for every type except newsletter", () => {
    const errors = validateEnquiry({ type: "contact", email: "ada@example.com" });
    expect(errors.name?.[0]).toMatch(/name/i);
    expect(errors.message?.[0]).toMatch(/message/i);
  });

  it("enforces the locked max lengths", () => {
    const errors = validateEnquiry({
      type: "partnership",
      email: "ada@example.com",
      name: "n".repeat(121),
      message: "m".repeat(5001),
      phone: "1".repeat(41),
      organisation: "o".repeat(161),
      sourcePage: "/".repeat(301),
    });
    expect(errors.name?.[0]).toMatch(/120/);
    expect(errors.message?.[0]).toMatch(/5000/);
    expect(errors.phone?.[0]).toMatch(/40/);
    expect(errors.organisation?.[0]).toMatch(/160/);
    expect(errors.sourcePage?.[0]).toMatch(/300/);
  });
});

describe("submitEnquiry", () => {
  it("does not call the network when the payload is invalid", async () => {
    const fetcher = vi.fn();
    const result = await submitEnquiry({ type: "contact", email: "not-an-email" }, fetcher);
    expect(result.ok).toBe(false);
    expect(fetcher).not.toHaveBeenCalled();
  });

  it("posts the locked shape and treats 201 and 200 as success", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(201, { ok: true, id: "enq_1" }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    const created = await submitEnquiry(
      { type: "one-on-one-training", email: "ada@example.com", name: "Ada", message: "Hello there", website: "" },
      fetcher,
    );
    expect(created).toEqual({ ok: true, id: "enq_1" });

    const body = JSON.parse(String(fetcher.mock.calls[0]?.[1]?.body));
    expect(fetcher.mock.calls[0]?.[0]).toBe("/api/enquiries");
    expect(body).toMatchObject({
      type: "one-on-one-training",
      email: "ada@example.com",
      name: "Ada",
      message: "Hello there",
      website: "",
    });

    const existing = await submitEnquiry(newsletter, fetcher);
    expect(existing).toEqual({ ok: true });
  });

  it("returns field errors, rate limits, and server errors", async () => {
    const fetcher = vi
      .fn()
      .mockResolvedValueOnce(
        jsonResponse(400, { ok: false, error: "validation_error", fieldErrors: { email: ["Already used"] } }),
      )
      .mockResolvedValueOnce(jsonResponse(400, { error: "invalid_json" }))
      .mockResolvedValueOnce(jsonResponse(429, { error: "rate_limited" }))
      .mockResolvedValueOnce(jsonResponse(500, { error: "server_error" }));

    const invalid = await submitEnquiry(newsletter, fetcher);
    expect(invalid).toEqual({
      ok: false,
      error: "validation_error",
      fieldErrors: { email: ["Already used"] },
    });
    expect(await submitEnquiry(newsletter, fetcher)).toEqual({ ok: false, error: "invalid_json" });
    expect(await submitEnquiry(newsletter, fetcher)).toEqual({ ok: false, error: "rate_limited" });
    expect(await submitEnquiry(newsletter, fetcher)).toEqual({ ok: false, error: "server_error" });
  });
});
