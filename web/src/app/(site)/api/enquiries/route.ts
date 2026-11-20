import { handleEnquiry, type EnquiryDeps } from "@/lib/enquiries/handle";
import { enquiryNotification, enquiryNotifyRecipient, toStoredEnquiry } from "@/lib/enquiries/notify";
import type { EnquiryInput } from "@/lib/enquiries/schema";
import { sendEmail } from "@/lib/email";
import { subscribeToNewsletter } from "@/lib/newsletter";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit } from "@/lib/rate-limit";

async function findNewsletterDuplicate(email: string) {
  const payload = await getPayloadClient();
  const existing = await payload.find({
    collection: "enquiries",
    depth: 0,
    limit: 1,
    overrideAccess: true,
    where: {
      and: [{ type: { equals: "newsletter" } }, { email: { equals: email } }],
    },
  });
  return existing.totalDocs > 0;
}

function enquiryData(input: EnquiryInput) {
  return {
    type: input.type,
    email: input.email,
    status: "new" as const,
    ...(input.name ? { name: input.name } : {}),
    ...(input.phone ? { phone: input.phone } : {}),
    ...(input.organisation ? { organisation: input.organisation } : {}),
    ...(input.message ? { message: input.message } : {}),
    ...(input.sourcePage ? { sourcePage: input.sourcePage } : {}),
  };
}

async function createEnquiry(input: EnquiryInput) {
  const payload = await getPayloadClient();
  const created = await payload.create({
    collection: "enquiries",
    overrideAccess: true,
    data: enquiryData(input),
  });
  return { id: created.id };
}

async function notifyEnquiry(input: EnquiryInput, id: number | string) {
  const to = enquiryNotifyRecipient(input.type);
  if (!to) {
    console.warn("[enquiries] stored without a notification email", { id, type: input.type });
    return;
  }
  const record = toStoredEnquiry(id, input);
  const message = enquiryNotification(record);
  const result = await sendEmail({ to, subject: message.subject, text: message.text });
  if (!result.ok) {
    console.warn("[enquiries] notification email was not sent", {
      id,
      type: input.type,
      reason: result.reason,
    });
  }
}

async function subscribe(email: string) {
  const result = await subscribeToNewsletter(email);
  if (!result.ok) {
    console.error("[enquiries] mailchimp subscribe failed");
  }
}

const deps: EnquiryDeps = {
  clientKey,
  limit: rateLimit,
  findNewsletterDuplicate,
  create: createEnquiry,
  notify: notifyEnquiry,
  subscribe,
};

export async function POST(request: Request) {
  return handleEnquiry(request, deps);
}
