import { z } from "zod";
import { setStaffTokenCookie } from "@/lib/auth/staff-cookies";
import { getPayloadClient } from "@/lib/payload";
import { clientKey, rateLimit, rateLimitedResponse } from "@/lib/rate-limit";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const limited = rateLimit({ key: `staff-login:${clientKey(request)}`, limit: 10, windowMs: 15 * 60 * 1000 });
    if (!limited.ok) return rateLimitedResponse(limited.retryAfterSec);

    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Enter a valid email and password." }, { status: 400 });
    }
    const payload = await getPayloadClient();
    const result = await payload.login({
      collection: "users",
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
    if (!result.token) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    const loggedIn = result.user as { id?: string | number; role?: string | null };
    if (loggedIn?.id && !loggedIn.role) {
      await payload.update({
        collection: "users",
        id: loggedIn.id,
        data: { role: "super-admin" },
        overrideAccess: true,
      });
    }
    await setStaffTokenCookie(result.token);
    return Response.json({ user: result.user });
  } catch (error) {
    console.warn("[staff-login]", error);
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }
}
