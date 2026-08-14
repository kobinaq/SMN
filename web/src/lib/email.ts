import { Resend } from "resend";
import { site } from "@/lib/site";

export type EmailMessage = {
  subject: string;
  text: string;
  to: string;
};

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "error"; error?: unknown };

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.info("[email:unconfigured]", message.subject);
    return { ok: false, reason: "unconfigured" };
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
      return { ok: false, reason: "error", error: result.error };
    }
    return { ok: true };
  } catch (error) {
    console.error("[email:error]", error);
    return { ok: false, reason: "error", error };
  }
}

export function emailWasSent(result: EmailResult): result is { ok: true } {
  return result.ok;
}

export function opsEmail() {
  return process.env.OPS_EMAIL || site.email;
}
