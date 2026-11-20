import { enquiryConfirmation, enquiryConfirmationEnabled } from "@/lib/enquiries/confirm";
import { enquiryNotification, enquiryNotifyRecipient, toStoredEnquiry } from "@/lib/enquiries/notify";
import type { EnquiryInput } from "@/lib/enquiries/schema";
import { sendEmail } from "@/lib/email";

export async function notifyEnquiry(input: EnquiryInput, id: number | string) {
  const to = enquiryNotifyRecipient(input.type);
  if (!to) {
    console.warn("[enquiries] stored without a notification email", { id, type: input.type });
    return;
  }
  const message = enquiryNotification(toStoredEnquiry(id, input));
  const result = await sendEmail({ to, subject: message.subject, text: message.text });
  if (!result.ok) {
    console.warn("[enquiries] notification email was not sent", {
      id,
      type: input.type,
      reason: result.reason,
    });
  }
}

export async function confirmEnquiry(input: EnquiryInput, id: number | string) {
  if (!enquiryConfirmationEnabled(input.type)) {
    console.info("[enquiries] confirmation disabled for type", { id, type: input.type });
    return;
  }
  // Public mail must not go out from the onboarding address sendEmail falls back to.
  if (!process.env.RESEND_API_KEY || !process.env.RESEND_FROM) {
    console.warn("[enquiries] confirmation email was not sent", {
      id,
      type: input.type,
      reason: "unconfigured",
    });
    return;
  }
  const message = enquiryConfirmation(toStoredEnquiry(id, input));
  const result = await sendEmail({ to: input.email, subject: message.subject, text: message.text });
  if (!result.ok) {
    console.warn("[enquiries] confirmation email was not sent", {
      id,
      type: input.type,
      reason: result.reason,
    });
  }
}
