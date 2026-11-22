import { Resend } from "resend";
import { site } from "@/lib/site";

export type EmailMessage = {
  subject: string;
  text: string;
  to: string;
  replyTo?: string;
};

export type EmailResult =
  | { ok: true }
  | { ok: false; reason: "unconfigured" | "error"; error?: unknown };

const lineBreak = /[\r\n]/;

export async function sendEmail(message: EmailMessage): Promise<EmailResult> {
  if ([message.to, message.replyTo, message.subject].some((v) => v !== undefined && lineBreak.test(v))) {
    console.warn("[email:rejected] a header field contained a line break");
    return { ok: false, reason: "error" };
  }

  if (!process.env.RESEND_API_KEY) {
    console.info("[email:unconfigured]", message.subject);
    return { ok: false, reason: "unconfigured" };
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const result = await resend.emails.send({
      from: process.env.RESEND_FROM ?? "Think Social Academy <onboarding@resend.dev>",
      to: message.to,
      subject: message.subject,
      ...(message.replyTo ? { replyTo: message.replyTo } : {}),
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
