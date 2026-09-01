import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { emailWasSent, sendEmail } from "@/lib/email";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";
import { getServerURL } from "@/lib/server-url";

const schema = z.object({ email: z.string().email() });

function emailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
}

function resetToken(result: unknown) {
  if (typeof result === "string") return result;
  if (result && typeof result === "object" && "token" in result) {
    return String((result as { token?: unknown }).token || "");
  }
  return "";
}

export async function POST(request: Request) {
  const limited = rateLimit({ key: `staff-forgot-password:${clientKey(request)}`, limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const configured = emailDeliveryConfigured();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return failJson("Enter a valid email address.", 400, { emailDeliveryConfigured: configured });
  }

  try {
    if (configured) {
      const payload = await getPayloadClient();
      const result = await payload.forgotPassword({
        collection: "users",
        data: { email: parsed.data.email.toLowerCase().trim() },
        disableEmail: true,
      });
      const token = resetToken(result);
      if (token) {
        const resetUrl = `${getServerURL()}/staff/reset-password?token=${encodeURIComponent(token)}`;
        const mailed = await sendEmail({
          to: parsed.data.email.toLowerCase().trim(),
          subject: "Reset your SMN staff password",
          text: `Use this link to set a new password for your SMN staff account. It expires after a short time.\n\n${resetUrl}\n\nIf you did not request this, ignore the email.`,
        });
        if (!emailWasSent(mailed)) {
          console.warn("[staff-forgot-password] token created but email did not send");
        }
      }
    } else {
      console.warn("[staff-forgot-password] skipped — RESEND_API_KEY/RESEND_FROM not configured");
    }
  } catch (error) {
    logServerError("staff-forgot-password", error);
  }

  return okJson({
    ok: true,
    emailDeliveryConfigured: configured,
    message: configured
      ? "If a staff account exists for that email, reset instructions will be sent."
      : "Password reset email is not configured on this environment yet. Contact the SMN team for help signing in.",
  });
}
