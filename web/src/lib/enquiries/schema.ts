import { z } from "zod";
import { enquiryTypes, type EnquiryType } from "@/lib/enquiries/options";

function blankToUndefined(value: unknown) {
  if (value == null) return undefined;
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

function optionalText(max: number, tooLong: string) {
  return z.preprocess(
    blankToUndefined,
    z.string({ error: "Enter text." }).max(max, tooLong).optional(),
  );
}

export const enquiryBodySchema = z
  .object({
    type: z.enum(enquiryTypes, { error: "Choose a valid enquiry type." }),
    email: z.preprocess(
      (value) => (typeof value === "string" ? value.trim().toLowerCase() : value),
      z
        .string({ error: "Enter a valid email address." })
        .max(254, "Email must be 254 characters or fewer.")
        .email("Enter a valid email address."),
    ),
    name: optionalText(120, "Name must be 120 characters or fewer."),
    phone: optionalText(40, "Phone must be 40 characters or fewer."),
    organisation: optionalText(160, "Organization must be 160 characters or fewer."),
    message: optionalText(5000, "Message must be 5000 characters or fewer."),
    sourcePage: optionalText(300, "Source page must be 300 characters or fewer."),
  })
  .superRefine((data, ctx) => {
    if (data.type === "newsletter") return;
    if (!data.name) {
      ctx.addIssue({ code: "custom", path: ["name"], message: "Name is required." });
    }
    if (!data.message) {
      ctx.addIssue({ code: "custom", path: ["message"], message: "Message is required." });
    }
  });

export type EnquiryInput = {
  type: EnquiryType;
  email: string;
  name?: string;
  phone?: string;
  organisation?: string;
  message?: string;
  sourcePage?: string;
};

export type EnquiryFieldErrors = Record<string, string[]>;

export type ParsedEnquiry =
  | { ok: true; data: EnquiryInput }
  | { ok: false; fieldErrors: EnquiryFieldErrors };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/** Honeypot field is `website`. Empty or absent is a real submission. */
export function isHoneypotFilled(body: unknown): boolean {
  if (!isRecord(body) || !("website" in body)) return false;
  const website = body.website;
  if (website == null) return false;
  if (typeof website === "string") return website.trim().length > 0;
  return true;
}

function issuesToFieldErrors(error: z.ZodError): EnquiryFieldErrors {
  const errors: EnquiryFieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    const field = typeof key === "string" ? key : "body";
    const messages = errors[field] ?? [];
    messages.push(issue.message);
    errors[field] = messages;
  }
  return errors;
}

export function parseEnquiryBody(body: unknown): ParsedEnquiry {
  const parsed = enquiryBodySchema.safeParse(body);
  if (!parsed.success) return { ok: false, fieldErrors: issuesToFieldErrors(parsed.error) };
  const data: EnquiryInput = {
    type: parsed.data.type,
    email: parsed.data.email,
  };
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.phone) data.phone = parsed.data.phone;
  if (parsed.data.organisation) data.organisation = parsed.data.organisation;
  if (parsed.data.message) data.message = parsed.data.message;
  if (parsed.data.sourcePage) data.sourcePage = parsed.data.sourcePage;
  return { ok: true, data };
}
