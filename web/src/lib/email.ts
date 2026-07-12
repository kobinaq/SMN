import { Resend } from "resend";
import { site } from "@/lib/site";

export type EmailMessage = {
  subject: string;
  text: string;
  to: string;
};

export async function sendEmail(message: EmailMessage) {
  if (!process.env.RESEND_API_KEY) {
    console.info("[email:skipped]", message.subject);
    return { skipped: true };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "SMN <onboarding@resend.dev>",
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
    if (result.error) {
      console.error("[email:error]", result.error);
      return { error: result.error };
    }
    return { ok: true };
  } catch (error) {
    console.error("[email:error]", error);
    return { error };
  }
}

export function opsEmail() {
  return process.env.OPS_EMAIL || site.email;
}
