import { z } from "zod";
import { setMemberTokenCookie } from "@/lib/auth/member-cookies";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Enter a valid email and password." }, { status: 400 });
    }
    const payload = await getPayloadClient();
    const result = await payload.login({
      collection: "members",
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
    if (!result.token) {
      return Response.json({ error: "Invalid email or password." }, { status: 401 });
    }
    await setMemberTokenCookie(result.token);
    return Response.json({ user: result.user });
  } catch (error) {
    console.warn("[member-login]", error);
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }
}
