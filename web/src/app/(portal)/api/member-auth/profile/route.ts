import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  name: z.string().min(2).max(120),
  handle: z.string().regex(/^[a-z0-9-]*$/).max(80).optional().or(z.literal("")),
  headline: z.string().max(160).optional().or(z.literal("")),
  bio: z.string().max(1500).optional().or(z.literal("")),
  skills: z.array(z.string().trim().min(1).max(100)).max(30).default([]),
  careerGoals: z.string().max(5000).optional().or(z.literal("")),
  careerInterests: z.array(z.string().trim().min(1).max(150)).max(20).default([]),
  location: z.string().max(120).optional().or(z.literal("")),
  linkedin: z.string().url().optional().or(z.literal("")),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  visibility: z.enum(["private", "members", "public"]),
});

function emptyToUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, item === "" ? undefined : item]),
  );
}

export async function PATCH(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) {
      return Response.json({ error: "Check your profile details and try again." }, { status: 400 });
    }

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") {
      return Response.json({ error: "Sign in to update your profile." }, { status: 401 });
    }

    const updated = await payload.update({
      collection: "members",
      id: user.id,
      overrideAccess: true,
      data: emptyToUndefined({
        name: parsed.data.name.trim(),
        handle: parsed.data.handle,
        headline: parsed.data.headline,
        bio: parsed.data.bio,
        skills: parsed.data.skills.map((skill) => ({ skill })),
        careerGoals: parsed.data.careerGoals,
        careerInterests: parsed.data.careerInterests.map((interest) => ({ interest })),
        location: parsed.data.location,
        linkedin: parsed.data.linkedin,
        portfolioUrl: parsed.data.portfolioUrl,
        visibility: parsed.data.visibility,
      }),
    });

    return Response.json({ doc: updated });
  } catch (error) {
    console.error("[member-profile]", error);
    return Response.json({ error: "Could not save profile." }, { status: 500 });
  }
}
