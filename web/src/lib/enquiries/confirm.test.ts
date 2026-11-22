import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const sent = vi.hoisted(() => vi.fn<(args: unknown) => Promise<{ error: unknown }>>(async () => ({ error: null })));

vi.mock("resend", () => ({
  Resend: class {
    emails = { send: sent };
  },
}));

import { sendEmail } from "@/lib/email";
import { enquiryConfirmation, enquiryConfirmationEnabled, senderMessage } from "@/lib/enquiries/confirm";
import { parseEnquiryBody } from "@/lib/enquiries/schema";
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
    expect(text("organisational-training")).toContain("Specialized Marketing Workshops");
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

describe("Reply-To", () => {
  const configure = () => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL_CONTACT", "");
  };

  it("replies to the shared notification address", async () => {
    configure();
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    await confirmEnquiry(contact, 1);
    expect(sent.mock.calls[0][0]).toMatchObject({ to: "ada@example.com", replyTo: "ops@example.org" });
  });

  it("prefers the per-type override", async () => {
    configure();
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL_CONTACT", "contact@example.org");
    await confirmEnquiry(contact, 1);
    expect(sent.mock.calls[0][0]).toMatchObject({ replyTo: "contact@example.org" });
  });

  it("has no replyTo key when no notification address is set", async () => {
    configure();
    await confirmEnquiry(contact, 1);
    expect(sent).toHaveBeenCalledTimes(1);
    expect(sent.mock.calls[0][0]).not.toHaveProperty("replyTo");
  });

  it("does not add replyTo to the admin notice", async () => {
    configure();
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "ops@example.org");
    await notifyEnquiry(contact, 1);
    expect(sent.mock.calls[0][0]).not.toHaveProperty("replyTo");
  });
});

describe("senderMessage", () => {
  it("strips the type prefix and the blank line after it", () => {
    expect(senderMessage("Enquiry type: Pricing\n\nHow much?")).toBe("How much?");
  });
  it("tolerates CRLF", () => {
    expect(senderMessage("Enquiry type: Pricing\r\n\r\nHow much?\r\nThanks")).toBe("How much?\r\nThanks");
  });
  it("leaves text without the prefix unchanged", () => {
    expect(senderMessage("How much?")).toBe("How much?");
  });
  it("returns empty when only the prefix was sent", () => {
    expect(senderMessage("Enquiry type: Pricing\n\n")).toBe("");
    expect(senderMessage("Enquiry type: Pricing")).toBe("");
  });
  it("keeps 'Enquiry type:' when it appears later", () => {
    const text = "Hello.\nEnquiry type: mine";
    expect(senderMessage(text)).toBe(text);
  });
  it("quotes only the sender's words in the confirmation", () => {
    const { text } = enquiryConfirmation(record("contact", { message: "Enquiry type: Pricing\n\nHow much?" }));
    expect(text).toContain("> How much?");
    expect(text).not.toContain("Enquiry type:");
  });
  it("omits the quoted block when nothing remains", () => {
    const { text } = enquiryConfirmation(record("contact", { message: "Enquiry type: Pricing\n\n" }));
    expect(text).not.toContain("For your records");
    expect(text).not.toContain(">");
  });
});

describe("header safety", () => {
  it("keeps the greeting on one line and the subject fixed", () => {
    const hostile = enquiryConfirmation(record("contact", { name: "Ada\r\nBcc: x@evil.test" }));
    const plain = enquiryConfirmation(record("contact"));
    expect(hostile.text.split("\n")[0]).toBe("Dear Ada Bcc: x@evil.test,");
    expect(hostile.subject).toBe(plain.subject);
  });

  it("rejects emails containing line breaks", () => {
    for (const email of ["a@b.com\r\nBcc: c@d.com", "a@b.com\nBcc: c@d.com", "a\n@b.com"]) {
      expect(parseEnquiryBody({ type: "contact", email, message: "Hi" }).ok).toBe(false);
    }
  });

  it.each([
    ["to", { to: "a@b.com\nBcc: c@d.com", subject: "s", text: "t" }],
    ["replyTo", { to: "a@b.com", replyTo: "a@b.com\r\nBcc: c@d.com", subject: "s", text: "t" }],
    ["subject", { to: "a@b.com", subject: "s\r\nBcc: c@d.com", text: "t" }],
  ])("sendEmail refuses a line break in %s", async (_field, message) => {
    vi.stubEnv("RESEND_API_KEY", "key");
    const result = await sendEmail(message);
    expect(result).toEqual({ ok: false, reason: "error" });
    expect(sent).not.toHaveBeenCalled();
    expect(JSON.stringify(vi.mocked(console.warn).mock.calls)).not.toContain("c@d.com");
  });
});

describe("newsletter through handleEnquiry", () => {
  const signup = { type: "newsletter", email: "reader@example.com" };
  const run = (duplicate: boolean) =>
    handleEnquiry(
      new Request("http://localhost/api/enquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(signup),
      }),
      {
        clientKey: () => "c",
        limit: () => ({ ok: true }),
        findNewsletterDuplicate: async () => duplicate,
        create: async () => ({ id: 5 }),
        notify: notifyEnquiry,
        confirm: confirmEnquiry,
        subscribe: async () => undefined,
      },
    );

  beforeEach(() => {
    vi.stubEnv("RESEND_API_KEY", "key");
    vi.stubEnv("RESEND_FROM", "Academy <hello@example.org>");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL", "");
    vi.stubEnv("ENQUIRY_NOTIFY_EMAIL_NEWSLETTER", "");
  });

  it("confirms a new signup to the subscriber", async () => {
    const response = await run(false);
    expect(response.status).toBe(201);
    expect(calls()).toHaveLength(1);
    expect(calls()[0].to).toBe("reader@example.com");
    expect(calls()[0].subject).toBe("You're subscribed to Think Social Academy");
  });

  it("sends nothing for a repeat signup", async () => {
    const response = await run(true);
    expect(response.status).toBe(200);
    expect(sent).not.toHaveBeenCalled();
  });
});
