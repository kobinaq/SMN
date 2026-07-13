import { NextResponse } from "next/server";
import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { mentorSeniorities, mentorTopics } from "@/lib/mentor-options";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  title: z.string().min(3).max(120),
  bio: z.string().min(80).max(1500),
  topics: z.array(z.enum(mentorTopics)).min(1).max(5),
  seniority: z.enum(mentorSeniorities),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Check your application details and try again." }, { status: 400 });
    if (parsed.data.website) return NextResponse.json({ ok: true });
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return NextResponse.json({ error: "Sign in to apply as a mentor." }, { status: 401 });
    const existing = await payload.find({ collection: "mentors", limit: 1, depth: 0, where: { member: { equals: user.id } }, overrideAccess: true });
    if (existing.totalDocs) return NextResponse.json({ error: "You already have a mentor application." }, { status: 409 });
    await payload.create({ collection: "mentors", overrideAccess: true, data: { member: user.id, title: parsed.data.title, bio: parsed.data.bio, topics: parsed.data.topics, seniority: parsed.data.seniority, availability: "Limited", status: "draft" } as never });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error("[mentor-application]", error);
    return NextResponse.json({ error: "Unable to submit the application right now." }, { status: 500 });
  }
}
