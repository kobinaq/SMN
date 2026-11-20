import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sent = vi.hoisted(() => vi.fn<(args: unknown) => Promise<{ error: unknown }>>(async () => ({ error: null })));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sent };
  },
}));

import { enquiryConfirmation, enquiryConfirmationEnabled } from "@/lib/enquiries/confirm";
import { handleEnquiry } from "@/lib/enquiries/handle";
import { enquiryConfirmEnvByType, enquiryTypes, type EnquiryType } from "@/lib/enquiries/options";
import type { StoredEnquiry } from "@/lib/enquiries/notify";
import type { EnquiryInput } from "@/lib/enquiries/schema";
import { confirmEnquiry, notifyEnquiry } from "@/lib/enquiries/send";

function record(type: EnquiryType, overrides: Partial<StoredEnquiry> = {}): StoredEnquiry {
  return {
    id: 1,
    type,
    email: "ada@example.com",
    name: "Ada Lovelace",
    phone: null,
    organisation: null,
    message: "Line one.\nLine two.",
    sourcePage: null,
    ...overrides,
  };
}

const contact: EnquiryInput = {
  type: "contact",
  email: "ada@example.com",
  name: "Ada Lovelace",
  message: "Hello there.",
};

type SentArgs = { from: string; to: string; subject: string; text: string };
const calls = () => sent.mock.calls.map((call) => call[0] as SentArgs);

beforeEach(() => {
  sent.mockClear();
  vi.spyOn(console, "warn").mockImplementation(() => undefined);
  vi.spyOn(console, "info").mockImplementation(() => undefined);
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.restoreAllMocks();
});

describe("enquiryConfirmationEnabled", () => {
  it("is on by default, including for blank and unknown values", () => {
    for (const type of enquiryTypes) {
      expect(enquiryConfirmationEnabled(type, {})).toBe(true);
      expect(enquiryConfirmationEnabled(type, { [enquiryConfirmEnvByType[type]]: " " })).toBe(true);
      expect(enquiryConfirmationEnabled(type, { [enquiryConfirmEnvByType[type]]: "true" })).toBe(true);
    }
  });

  it("turns off only for false, 0, off or no", () => {
    for (const value of ["false", "0", "off", "no", " FALSE ", "Off", "No"]) {
      expect(enquiryConfirmationEnabled("contact", { ENQUIRY_CONFIRM_CONTACT: value })).toBe(false);
    }
    expect(enquiryConfirmationEnabled("partnership", { ENQUIRY_CONFIRM_CONTACT: "off" })).toBe(true);
  });
});

describe("enquiryConfirmation", () => {
  it("promises 48 hours and quotes the message for non-newsletter types", () => {
    for (const type of enquiryTypes.filter((t) => t !== "newsletter")) {
      const { text } = enquiryConfirmation(record(type));
      expect(text).toContain("Dear Ada Lovelace,");
      expect(text).toContain("within 48 hours");
      expect(text).toContain("> Line one.\n> Line two.");
      expect(text).toContain("Think Social Academy");
    }
  });

  it("uses type-appropriate wording", () => {
    const text = (type: EnquiryType) => enquiryConfirmation(record(type)).text;
    expect(text("programme-social-media-marketing")).toContain("the Social Media Marketing cohort");
    expect(text("one-on-one-training")).toContain("One-on-One Training");
    expect(text("organisational-training")).toContain("Specialised Marketing Workshops");
    expect(text("partnership")).toContain("partnering with us");
    expect(text("contact")).toContain("your message");
  });

  it("gives newsletter signups a short note without the 48-hour promise", () => {
    const { text } = enquiryConfirmation(record("newsletter", { name: null, message: null }));
    expect(text).toContain("You're subscribed");
    expect(text).not.toContain("48");
    expect(text.startsWith("Hello,")).toBe(true);
  });
});

describe("send functions", () => {
  it("confirms to the sender from RESEND_FROM and notifies the admin", async () => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    await notifyEnquiry(contact, 9);
    await confirmEnquiry(contact, 9);
    const [admin, sender] = calls();
    expect(admin.to).toBe("ops@example.org");
    expect(sender.to).toBe("ada@example.com");
    expect(sender.from).toBe("Academy <hello@example.org>");
    expect(sender.text).toContain("within 48 hours");
  });

  it("sends nothing to the sender when the type is disabled, but the admin notice still goes", async () => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    vi.stubEnv("ENQUIRY_CONFIRM_CONTACT", "off");
    await notifyEnquiry(contact, 9);
    await confirmEnquiry(contact, 9);
    expect(calls().map((c) => c.to)).toEqual(["ops@example.org"]);
  });

  it.each(["RESEND_API_KEY", "RESEND_FROM"])("sends no confirmation when %s is missing", async (missing) => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.stubEnv(missing, "");
    await confirmEnquiry(contact, 9);
    expect(sent).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith("[enquiries] confirmation email was not sent", {
      id: 9,
      type: "contact",
      reason: "unconfigured",
    });
  });

  it("logs only id, type and reason when sending fails", async () => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    sent.mockResolvedValueOnce({ error: { message: "nope" } } as never);
    await confirmEnquiry(contact, 9);
    expect(console.warn).toHaveBeenCalledWith("[enquiries] confirmation email was not sent", {
      id: 9,
      type: "contact",
      reason: "error",
    });
  });

  it("handleEnquiry still returns 201 with real senders and no Resend config", async () => {
    vi.stubEnv("RESEND_API_KEY", "");
    vi.stubEnv("RESEND_FROM", "");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    vi.spyOn(console, "info").mockImplementation(() => undefined);
    const response = await handleEnquiry(
      new Request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(contact),
      }),
      {
        clientKey: () => "c",
        limit: () => ({ ok: true }),
        findNewsletterDuplicate: async () => false,
        create: async () => ({ id: 3 }),
        notify: notifyEnquiry,
        confirm: confirmEnquiry,
        subscribe: async () => undefined,
      },
    );
    expect(response.status).toBe(201);
    expect(sent).not.toHaveBeenCalled();
  });
});
