import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(10),
});

export async function POST(request: Request) {
  const limited = rateLimit({ key: `staff-change-password:${clientKey(request)}`, limit: 8, windowMs: 15 * 60 * 1000 });
  if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return failJson("Enter your current password and a new one of at least 10 characters.", 400);
  }

  try {
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
    if (!user || user.collection !== "users") {
      return failJson("Staff sign-in required.", 401);
    }

    if (parsed.data.newPassword === parsed.data.currentPassword) {
      return failJson("Choose a password different from your current one.", 400);
    }

    try {
      const check = await payload.login({
        collection: "users",
        data: { email: user.email, password: parsed.data.currentPassword },
      });
      if (!check.token) throw new Error("no token");
    } catch {
      return failJson("Your current password is incorrect.", 400);
    }

    await payload.update({
      collection: "users",
      id: user.id,
      data: { password: parsed.data.newPassword },
      overrideAccess: true,
    });

    return okJson({ ok: true });
  } catch (error) {
    logServerError("staff-change-password", error);
    return failJson("Unable to update your password. Please try again.", 500);
  }
}
