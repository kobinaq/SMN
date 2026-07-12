import { z } from "zod";
import { setMemberTokenCookie } from "@/lib/auth/member-cookies";
import { sendEmail } from "@/lib/email";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(200),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Check your account details and try again." }, { status: 400 });
    }
    const payload = await getPayloadClient();
    await payload.create({
      collection: "members",
      data: {
        name: parsed.data.name.trim(),
        email: parsed.data.email.toLowerCase().trim(),
        password: parsed.data.password,
      },
    });
    const login = await payload.login({
      collection: "members",
      data: {
        email: parsed.data.email,
        password: parsed.data.password,
      },
    });
    if (login.token) await setMemberTokenCookie(login.token);
    await sendEmail({
      to: parsed.data.email,
      subject: "Welcome to Social Marketers Network",
      text: `Hi ${parsed.data.name},\n\nYour SMN member account is ready. You can now complete your profile, browse mentors, explore opportunities, and access learning when staff grants your enrollment.\n\nSocial Marketers Network`,
    });
    return Response.json({ user: login.user }, { status: 201 });
  } catch (error) {
    console.warn("[member-signup]", error);
    return Response.json({ error: "Could not create account." }, { status: 400 });
  }
}
