import { headers as nextHeaders } from "next/headers";
import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { site } from "@/lib/site";

const schema = z.object({
  mentorId: z.union([z.string().min(1), z.number()]),
  topic: z.string().min(2).max(100),
  goal: z.string().min(10).max(200),
  message: z.string().min(20).max(2000),
  preferredFormat: z.enum(["Video call", "Portfolio review", "Async feedback", "Group office hours"]),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check the request details and try again." }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ ok: true });

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await nextHeaders() });
    if (!user || user.collection !== "members") return NextResponse.json({ error: "Sign in to request mentorship." }, { status: 401 });

    const mentor = await payload.findByID({ collection: "mentors", id: parsed.data.mentorId, depth: 1, overrideAccess: true });
    if (mentor.status !== "approved" || mentor.availability === "Unavailable") {
      return NextResponse.json({ error: "This mentor is not currently accepting requests." }, { status: 409 });
    }

    await payload.create({
      collection: "mentorship-requests", overrideAccess: true,
      data: { requester: user.id, mentor: mentor.id, topic: parsed.data.topic, goal: parsed.data.goal, message: parsed.data.message, preferredFormat: parsed.data.preferredFormat, status: "new" },
    });

    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "SMN <onboarding@resend.dev>",
        to: process.env.OPS_EMAIL ?? site.email,
        subject: `Mentorship request: ${parsed.data.topic}`,
        text: `Member: ${user.email}\nGoal: ${parsed.data.goal}\nFormat: ${parsed.data.preferredFormat}\n\n${parsed.data.message}`,
      });
    }
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[mentor-request]", error);
    return NextResponse.json({ error: "Unable to send the request right now." }, { status: 500 });
  }
}