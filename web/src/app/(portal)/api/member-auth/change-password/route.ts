import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8),
});

export async function POST(request: Request) {
  const limited = rateLimit({ key: `member-change-password:${clientKey(request)}`, limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return failJson("Enter your current password and a new one of at least 8 characters.", 400);
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders(request) });
    if (!user || user.collection !== "members") {
      return failJson("Sign in to change your password.", 401);
    }

    if (parsed.data.newPassword === parsed.data.currentPassword) {
      return failJson("Choose a password different from your current one.", 400);
    }

    try {
      const check = await payload.login({
        collection: "members",
        data: { email: user.email, password: parsed.data.currentPassword },
      });
      if (!check.token) throw new Error("no token");
    } catch {
      return failJson("Your current password is incorrect.", 400);
    }

    await payload.update({
      collection: "members",
      id: user.id,
      data: { password: parsed.data.newPassword },
      overrideAccess: true,
    });

    return okJson({ ok: true });
  } catch (error) {
    logServerError("member-change-password", error);
    return failJson("Unable to update your password. Please try again.", 500);
  }
}
