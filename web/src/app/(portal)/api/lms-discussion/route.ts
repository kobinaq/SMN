import { z } from "zod";
import { failJson, logServerError, okJson } from "@/lib/api-response";
import { memberAuthHeaders, memberDisplayName, type MemberUser } from "@/lib/auth/member";
import { getLmsCourses } from "@/lib/lms";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({
  courseId: z.coerce.number().int().positive(),
  body: z.string().trim().min(1).max(4000),
});

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return failJson("Write a message before posting.", 400);

    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return failJson("Sign in to post.", 401);

    const member = user as unknown as MemberUser;
    const courses = await getLmsCourses(member);
    if (!courses.some((course) => String(course.id) === String(parsed.data.courseId))) {
      return failJson("This cohort is not available to your account.", 403);
    }

    await payload.create({
      collection: "lms-discussion-posts",
      overrideAccess: true,
      data: {
        course: parsed.data.courseId,
        body: parsed.data.body,
        authorMember: Number(member.id),
        authorName: memberDisplayName(member),
        authorRole: "member",
        status: "visible",
      },
    });
    return okJson({ ok: true });
  } catch (error) {
    logServerError("lms-discussion", error);
    return failJson("Unable to post right now.", 500);
  }
}
