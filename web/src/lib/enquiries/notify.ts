import { enquiryNotifyEnvByType, type EnquiryType } from "@/lib/enquiries/options";
import type { EnquiryInput } from "@/lib/enquiries/schema";

export type StoredEnquiry = {
  id: number | string;
  type: EnquiryType;
  email: string;
  name: string | null;
  phone: string | null;
  organisation: string | null;
  message: string | null;
  sourcePage: string | null;
};

type EnvSource = Record<string, string | undefined>;

export function enquiryNotifyRecipient(type: EnquiryType, env: EnvSource = process.env): string | null {
  const specific = env[enquiryNotifyEnvByType[type]]?.trim();
  if (specific) return specific;
  const fallback = env.ENQUIRY_NOTIFY_EMAIL?.trim();
  return fallback || null;
}

export function enquiryNotification(record: StoredEnquiry): { subject: string; text: string } {
  const lines = [
    `Type: ${record.type}`,
    `Name: ${record.name ?? ""}`,
    `Email: ${record.email}`,
    `Phone: ${record.phone ?? ""}`,
    `Organisation: ${record.organisation ?? ""}`,
    `Source page: ${record.sourcePage ?? ""}`,
    `Enquiry id: ${record.id}`,
    "",
    record.message ?? "",
  ];
  return {
    subject: `Enquiry (${record.type})`,
    text: lines.join("\n"),
  };
}

export function toStoredEnquiry(id: number | string, input: EnquiryInput): StoredEnquiry {
  return {
    id,
    type: input.type,
    email: input.email,
    name: input.name ?? null,
    phone: input.phone ?? null,
    organisation: input.organisation ?? null,
    message: input.message ?? null,
    sourcePage: input.sourcePage ?? null,
  };
}
