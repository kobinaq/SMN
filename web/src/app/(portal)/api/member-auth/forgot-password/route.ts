import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({ email: z.string().email() });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (parsed.success) {
      const payload = await getPayloadClient();
      await payload.forgotPassword({
        collection: "members",
        data: { email: parsed.data.email.toLowerCase().trim() },
      });
    }
  } catch (error) {
    console.warn("[member-forgot-password]", error);
  }

  return Response.json({
    ok: true,
    message: "If an account exists for that email, reset instructions will be sent.",
  });
}
