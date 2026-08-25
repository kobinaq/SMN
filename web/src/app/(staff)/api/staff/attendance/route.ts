import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  sessionId: z.coerce.number().int().positive(),
  courseId: z.coerce.number().int().positive(),
  entries: z
    .array(
      z.object({
        memberId: z.coerce.number().int().positive(),
        status: z.enum(["present", "late", "excused", "absent", ""]),
      }),
    )
    .max(1000),
});

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  if (!canStaff(user as never, "learning", "support")) {
    return Response.json({ error: "You do not have permission to take attendance." }, { status: 403 });
  }

  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid attendance update." }, { status: 400 });

  const { sessionId, courseId, entries } = parsed.data;

  try {
    for (const entry of entries) {
      const existing = await payload.find({
        collection: "lms-attendance",
        depth: 0,
        limit: 1,
        overrideAccess: true,
        where: { and: [{ session: { equals: sessionId } }, { member: { equals: entry.memberId } }] },
      });
      const current = existing.docs[0];
      if (entry.status === "") {
        if (current) await payload.delete({ collection: "lms-attendance", id: current.id, overrideAccess: true });
        continue;
      }
      if (current) {
        await payload.update({ collection: "lms-attendance", id: current.id, overrideAccess: true, data: { status: entry.status } });
      } else {
        await payload.create({
          collection: "lms-attendance",
          overrideAccess: true,
          data: { session: sessionId, course: courseId, member: entry.memberId, status: entry.status },
        });
      }
    }
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[staff-attendance]", error);
    return Response.json({ error: "Unable to save attendance right now." }, { status: 500 });
  }
}
