import { describe, expect, it, vi } from "vitest";
import { handleEnquiry, type EnquiryDeps } from "@/lib/enquiries/handle";
import { enquiryNotification, enquiryNotifyRecipient } from "@/lib/enquiries/notify";
import type { EnquiryInput } from "@/lib/enquiries/schema";

const contact: EnquiryInput = {
  type: "contact",
  email: "ada@example.com",
  name: "Ada Lovelace",
  message: "Hello from the contact page.",
  sourcePage: "/contact",
};

function request(body: unknown) {
  return new Request("http://localhost/api/enquiries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: typeof body === "string" ? body : JSON.stringify(body),
  });
}

function deps(overrides: Partial<EnquiryDeps> = {}): EnquiryDeps {
  const hooks: EnquiryDeps = {
    clientKey: () => "test-client",
    limit: () => ({ ok: true }),
    findNewsletterDuplicate: async () => false,
    create: vi.fn(async () => ({ id: 42 })),
    notify: vi.fn(async () => undefined),
    confirm: vi.fn(async () => undefined),
    subscribe: vi.fn(async () => undefined),
    ...overrides,
  };
  return hooks;
}

describe("handleEnquiry", () => {
  it("stores a valid enquiry and returns 201 with the id", async () => {
    const hooks = deps();
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, id: "42" });
    expect(hooks.create).toHaveBeenCalledWith(contact);
    expect(hooks.notify).toHaveBeenCalledWith(contact, 42);
    expect(hooks.confirm).toHaveBeenCalledWith(contact, 42);
    expect(hooks.subscribe).not.toHaveBeenCalled();
  });

  it("passes only the parsed public fields to create", async () => {
    const hooks = deps();
    await handleEnquiry(
      request({ ...contact, owner: 1, notes: "x", enrollment: 2, status: "converted" }),
      hooks,
    );
    expect(hooks.create).toHaveBeenCalledWith(contact);
  });

  it("sends no email for honeypot, rate-limited, invalid-JSON or invalid requests", async () => {
    const cases: Array<[Request, Partial<EnquiryDeps>]> = [
      [request({ ...contact, website: "https://spam.test" }), {}],
      [request(contact), { limit: () => ({ ok: false, retryAfterSec: 5 }) }],
      [request("{"), {}],
      [request({ type: "contact", email: "ada@example.com" }), {}],
    ];
    for (const [req, overrides] of cases) {
      const hooks = deps(overrides);
      await handleEnquiry(req, hooks);
      expect(hooks.notify).not.toHaveBeenCalled();
      expect(hooks.confirm).not.toHaveBeenCalled();
    }
  });

  it("sends neither email for a duplicate newsletter signup", async () => {
    const hooks = deps({ findNewsletterDuplicate: async () => true });
    await handleEnquiry(request({ type: "newsletter", email: "reader@example.com" }), hooks);
    expect(hooks.notify).not.toHaveBeenCalled();
    expect(hooks.confirm).not.toHaveBeenCalled();
  });

  it("still returns 201 and runs notify when confirm throws", async () => {
    const hooks = deps({
      confirm: vi.fn(async () => {
        throw new Error("boom");
      }),
    });
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(201);
    expect(hooks.notify).toHaveBeenCalledOnce();
  });

  it("still runs confirm when notify throws", async () => {
    const hooks = deps({
      notify: vi.fn(async () => {
        throw new Error("boom");
      }),
    });
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(201);
    expect(hooks.confirm).toHaveBeenCalledOnce();
  });

  it("returns 200 and stores nothing when the honeypot is filled", async () => {
    const hooks = deps();
    const response = await handleEnquiry(request({ ...contact, website: "https://spam.test" }), hooks);
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(hooks.create).not.toHaveBeenCalled();
    expect(hooks.notify).not.toHaveBeenCalled();
    expect(hooks.subscribe).not.toHaveBeenCalled();
  });

  it("returns field errors for an invalid body", async () => {
    const response = await handleEnquiry(request({ type: "contact", email: "ada@example.com" }), deps());
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("validation_error");
    expect(body.fieldErrors.name).toEqual(["Name is required."]);
    expect(body.fieldErrors.message).toEqual(["Message is required."]);
  });

  it("returns invalid_json for a body that is not JSON", async () => {
    const response = await handleEnquiry(request("{"), deps());
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({ ok: false, error: "invalid_json", fieldErrors: {} });
  });

  it("returns 429 with Retry-After when the client is over the limit", async () => {
    const hooks = deps({ limit: () => ({ ok: false, retryAfterSec: 90 }) });
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(429);
    expect(response.headers.get("Retry-After")).toBe("90");
    expect(await response.json()).toEqual({ ok: false, error: "rate_limited" });
    expect(hooks.create).not.toHaveBeenCalled();
  });

  it("still returns 201 when notification throws after the row is stored", async () => {
    const hooks = deps({
      notify: vi.fn(async () => {
        throw new Error("resend down");
      }),
    });
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(201);
    expect(await response.json()).toEqual({ ok: true, id: "42" });
  });

  it("returns 500 when the database write fails", async () => {
    const hooks = deps({
      create: vi.fn(async () => {
        throw new Error("db down");
      }),
    });
    const response = await handleEnquiry(request(contact), hooks);
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ ok: false, error: "server_error" });
    expect(hooks.notify).not.toHaveBeenCalled();
  });

  it("returns 200 without a new row for a duplicate newsletter email and still subscribes", async () => {
    const hooks = deps({ findNewsletterDuplicate: async () => true });
    const response = await handleEnquiry(
      request({ type: "newsletter", email: "Reader@Example.com" }),
      hooks,
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
    expect(hooks.create).not.toHaveBeenCalled();
    expect(hooks.notify).not.toHaveBeenCalled();
    expect(hooks.subscribe).toHaveBeenCalledWith("reader@example.com");
  });

  it("stores a new newsletter signup, subscribes, and notifies", async () => {
    const hooks = deps();
    const response = await handleEnquiry(request({ type: "newsletter", email: "reader@example.com" }), hooks);
    expect(response.status).toBe(201);
    expect(hooks.create).toHaveBeenCalledOnce();
    expect(hooks.subscribe).toHaveBeenCalledWith("reader@example.com");
    expect(hooks.notify).toHaveBeenCalledOnce();
  });

  it("still returns 201 when a new newsletter subscribe throws", async () => {
    const hooks = deps({
      subscribe: vi.fn(async () => {
        throw new Error("mailchimp down");
      }),
    });
    const response = await handleEnquiry(request({ type: "newsletter", email: "reader@example.com" }), hooks);
    expect(response.status).toBe(201);
  });
});

describe("enquiryNotifyRecipient", () => {
  it("uses the shared address, then a per-type override", () => {
    expect(enquiryNotifyRecipient("partnership", {})).toBeNull();
    expect(
      enquiryNotifyRecipient("partnership", { ENQUIRY_NOTIFY_EMAIL: " ops@example.com " }),
    ).toBe("ops@example.com");
    expect(
      enquiryNotifyRecipient("partnership", {
        ENQUIRY_NOTIFY_EMAIL: "ops@example.com",
        ENQUIRY_NOTIFY_EMAIL_PARTNERSHIP: "partners@example.com",
      }),
    ).toBe("partners@example.com");
  });

  it("ignores a blank per-type override", () => {
    expect(
      enquiryNotifyRecipient("contact", {
        ENQUIRY_NOTIFY_EMAIL: "ops@example.com",
        ENQUIRY_NOTIFY_EMAIL_CONTACT: "  ",
      }),
    ).toBe("ops@example.com");
  });
});

describe("enquiryNotification", () => {
  it("includes the stored fields and keeps the subject to the enquiry type", () => {
    const message = enquiryNotification({
      id: 7,
      type: "partnership",
      email: "ada@example.com",
      name: "Ada",
      phone: null,
      organisation: "Analytical Engines",
      message: "Let's collaborate.",
      sourcePage: "/partnerships",
    });
    expect(message.subject).toBe("Enquiry (partnership)");
    expect(message.text).toContain("ada@example.com");
    expect(message.text).toContain("Analytical Engines");
    expect(message.text).toContain("Enquiry id: 7");
    expect(message.text).toContain("Let's collaborate.");
  });
});
