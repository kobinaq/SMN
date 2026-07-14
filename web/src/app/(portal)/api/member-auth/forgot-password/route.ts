import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({ email: z.string().email() });

function emailDeliveryConfigured() {
  return Boolean(process.env.RESEND_API_KEY?.trim() && process.env.RESEND_FROM?.trim());
}

export async function POST(request: Request) {
  const configured = emailDeliveryConfigured();
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return failJson("Enter a valid email address.", 400, { emailDeliveryConfigured: configured });
  }

  try {
    if (configured) {
      const payload = await getPayloadClient();
      await payload.forgotPassword({
        collection: "members",
        data: { email: parsed.data.email.toLowerCase().trim() },
      });
    } else {
      console.warn("[member-forgot-password] skipped — RESEND_API_KEY/RESEND_FROM not configured");
    }
  } catch (error) {
    logServerError("member-forgot-password", error);
  }

  // Avoid email enumeration; be explicit when delivery is not configured.
  return okJson({
    ok: true,
    emailDeliveryConfigured: configured,
    message: configured
      ? "If an account exists for that email, reset instructions will be sent."
      : "Password reset email is not configured on this environment yet. Contact the SMN team for help signing in.",
  });
}
