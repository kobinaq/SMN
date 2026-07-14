import { z } from "zod";
import { setStaffTokenCookie } from "@/lib/auth/staff-cookies";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(10).max(200),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Provide your name, a valid email, and a password of at least 10 characters." }, { status: 400 });
    }
    const payload = await getPayloadClient();
    const existing = await payload.count({ collection: "users", overrideAccess: true });
    if (existing.totalDocs > 0) {
      return Response.json({ error: "Staff accounts already exist. Sign in instead." }, { status: 409 });
    }
    await payload.create({
      collection: "users",
      overrideAccess: true,
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
        role: "super-admin",
      },
    });
    const result = await payload.login({
      collection: "users",
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
    if (!result.token) {
      return Response.json({ error: "Account created, but sign-in failed. Try logging in." }, { status: 500 });
    }
    await setStaffTokenCookie(result.token);
    return Response.json({ user: result.user }, { status: 201 });
  } catch (error) {
    console.warn("[staff-bootstrap]", error);
    return Response.json({ error: "Unable to create the first staff account." }, { status: 500 });
  }
}
