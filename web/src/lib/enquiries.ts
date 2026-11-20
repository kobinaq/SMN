/**
 * Client for POST /api/enquiries.
 * The route is implemented on `feat/enquiries` and is not part of this branch.
 * Preview deploys return 404 for these posts until that branch is in `dev`.
 */

export const enquiryTypes = [
  "programme-social-media-marketing",
  "one-on-one-training",
  "organisational-training",
  "partnership",
  "contact",
  "newsletter",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

export const enquiryFields = [
  "type",
  "email",
  "name",
  "message",
  "phone",
  "organisation",
  "sourcePage",
  "website",
] as const;

export type EnquiryField = (typeof enquiryFields)[number];

export type EnquiryPayload = {
  type: EnquiryType;
  email: string;
  name?: string;
  message?: string;
  phone?: string;
  organisation?: string;
  sourcePage?: string;
  /** Honeypot. Send it, normally empty. */
  website?: string;
};

export type FieldErrors = Partial<Record<EnquiryField, string[]>>;

export type EnquiryResult =
  | { ok: true; id?: string }
  | { ok: false; error: "validation_error"; fieldErrors: FieldErrors }
  | { ok: false; error: "invalid_json" | "rate_limited" | "server_error" | "unavailable" };

export const enquiryLimits = {
  name: 120,
  phone: 40,
  organisation: 160,
  message: 5000,
  sourcePage: 300,
} as const;

export const enquiryStatusCopy = {
  rateLimited: "Please try again shortly.",
  invalid: "We couldn't send that. Please try again.",
  server: "Something went wrong. Please try again.",
  unavailable: "We couldn't send that. Please try again.",
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isEnquiryType(value: string): value is EnquiryType {
  return (enquiryTypes as readonly string[]).includes(value);
}

function isEnquiryField(value: string): value is EnquiryField {
  return (enquiryFields as readonly string[]).includes(value);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function readFieldErrors(value: unknown): FieldErrors {
  if (!isRecord(value)) return {};
  const errors: FieldErrors = {};
  for (const [key, messages] of Object.entries(value)) {
    if (!isEnquiryField(key) || !Array.isArray(messages)) continue;
    const texts = messages.filter((item): item is string => typeof item === "string" && item.length > 0);
    if (texts.length > 0) errors[key] = texts;
  }
  return errors;
}

function tooLong(label: string, max: number): string {
  return `${label} must be ${max} characters or fewer.`;
}

export function validateEnquiry(payload: EnquiryPayload): FieldErrors {
  const errors: FieldErrors = {};
  const email = payload.email.trim();
  const name = payload.name?.trim() ?? "";
  const message = payload.message?.trim() ?? "";
  const phone = payload.phone?.trim() ?? "";
  const organisation = payload.organisation?.trim() ?? "";
  const sourcePage = payload.sourcePage?.trim() ?? "";

  if (!isEnquiryType(payload.type)) {
    errors.type = ["Choose a valid enquiry type."];
  }
  if (!email || !emailPattern.test(email)) {
    errors.email = ["Enter a valid email address."];
  }
  if (payload.type !== "newsletter") {
    if (!name) errors.name = ["Enter your name."];
    if (!message) errors.message = ["Enter a message."];
  }
  if (name.length > enquiryLimits.name) errors.name = [tooLong("Name", enquiryLimits.name)];
  if (message.length > enquiryLimits.message) errors.message = [tooLong("Message", enquiryLimits.message)];
  if (phone.length > enquiryLimits.phone) errors.phone = [tooLong("Phone", enquiryLimits.phone)];
  if (organisation.length > enquiryLimits.organisation) {
    errors.organisation = [tooLong("Organisation", enquiryLimits.organisation)];
  }
  if (sourcePage.length > enquiryLimits.sourcePage) {
    errors.sourcePage = [tooLong("Page", enquiryLimits.sourcePage)];
  }
  return errors;
}

function statusMessage(error: Exclude<EnquiryResult, { ok: true }>["error"]): string {
  if (error === "rate_limited") return enquiryStatusCopy.rateLimited;
  if (error === "server_error") return enquiryStatusCopy.server;
  if (error === "invalid_json") return enquiryStatusCopy.invalid;
  return enquiryStatusCopy.unavailable;
}

export function enquiryErrorMessage(result: Extract<EnquiryResult, { ok: false }>): string {
  if (result.error === "validation_error") {
    const first = Object.values(result.fieldErrors).flat()[0];
    return first ?? enquiryStatusCopy.invalid;
  }
  return statusMessage(result.error);
}

function bodyFromPayload(payload: EnquiryPayload): EnquiryPayload {
  const body: EnquiryPayload = {
    type: payload.type,
    email: payload.email.trim(),
    website: payload.website ?? "",
  };
  const name = payload.name?.trim();
  const message = payload.message?.trim();
  const phone = payload.phone?.trim();
  const organisation = payload.organisation?.trim();
  const sourcePage = payload.sourcePage?.trim();
  if (name) body.name = name;
  if (message) body.message = message;
  if (phone) body.phone = phone;
  if (organisation) body.organisation = organisation;
  if (sourcePage) body.sourcePage = sourcePage;
  return body;
}

export async function submitEnquiry(
  payload: EnquiryPayload,
  fetcher: typeof fetch = fetch,
): Promise<EnquiryResult> {
  const fieldErrors = validateEnquiry(payload);
  if (Object.keys(fieldErrors).length > 0) {
    return { ok: false, error: "validation_error", fieldErrors };
  }

  let response: Response;
  try {
    response = await fetcher("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyFromPayload(payload)),
    });
  } catch {
    return { ok: false, error: "unavailable" };
  }

  let parsed: unknown = null;
  try {
    parsed = await response.json();
  } catch {
    parsed = null;
  }

  if ((response.status === 201 || response.status === 200) && isRecord(parsed) && parsed.ok === true) {
    return typeof parsed.id === "string" ? { ok: true, id: parsed.id } : { ok: true };
  }

  if (response.status === 400 && isRecord(parsed)) {
    if (parsed.error === "validation_error") {
      return { ok: false, error: "validation_error", fieldErrors: readFieldErrors(parsed.fieldErrors) };
    }
    if (parsed.error === "invalid_json") return { ok: false, error: "invalid_json" };
  }

  if (response.status === 429) return { ok: false, error: "rate_limited" };
  if (response.status === 500) return { ok: false, error: "server_error" };
  return { ok: false, error: "unavailable" };
}
