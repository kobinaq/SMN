import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";

const schema = z.object({
  token: z.string().min(10),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  const limited = rateLimit({ key: `reset-password:${clientKey(request)}`, limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return failJson("Enter a new password of at least 8 characters.", 400);
  }

  try {
    const payload = await getPayloadClient();
    await payload.resetPassword({
      collection: "members",
      data: {
        token: parsed.data.token,
        password: parsed.data.password,
      },
      overrideAccess: true,
    });
    return okJson({ ok: true });
  } catch (error) {
    logServerError("member-reset-password", error);
    return failJson("That reset link is invalid or expired. Request a new one.", 400);
  }
}
