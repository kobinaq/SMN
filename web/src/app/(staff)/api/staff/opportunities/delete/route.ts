import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { canStaff } from "@/lib/staff-permissions";

const schema = z.object({
  ids: z.array(z.union([z.string(), z.number()])).min(1).max(200),
});

/**
 * Delete one or more job listings, including applications against them.
 *
 * opportunity-applications.opportunity is a required relationship, so a plain
 * `payload.delete` on the listing alone fails on the not-null constraint the
 * moment anyone has applied — this mirrors the course-delete route's DEPENDENTS
 * cascade rather than repeating that bug here.
 */
export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") {
    return Response.json({ error: "Staff sign-in required." }, { status: 401 });
  }
  if (!canStaff(user as never, "opportunity")) {
    return Response.json({ error: "You do not have permission to delete job listings." }, { status: 403 });
  }
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid delete request." }, { status: 400 });

  const results = await Promise.all(
    parsed.data.ids.map(async (id) => {
      try {
        await payload.delete({
          collection: "opportunity-applications",
          where: { opportunity: { equals: id } },
          overrideAccess: true,
        });
        await payload.delete({ collection: "opportunities", id, overrideAccess: true });
        return { id, ok: true as const };
      } catch (error) {
        console.error("[staff-opportunity-delete]", id, error);
        return { id, ok: false as const, error: "Unable to delete this listing." };
      }
    }),
  );

  return Response.json({ ok: true, results });
}
