import { z } from "zod";
import { memberAuthHeaders } from "@/lib/auth/member";
import { opsEmail, sendEmail } from "@/lib/email";
import { getPayloadClient } from "@/lib/payload";

const schema = z.object({ opportunityId: z.union([z.string().min(1), z.number()]), status: z.enum(["started", "applied"]).default("started") });

export async function POST(request: Request) {
  try {
    const parsed = schema.safeParse(await request.json());
    if (!parsed.success) return Response.json({ error: "Invalid opportunity." }, { status: 400 });
    const payload = await getPayloadClient();
    const { user } = await payload.auth({ headers: await memberAuthHeaders() });
    if (!user || user.collection !== "members") return Response.json({ error: "Sign in to apply." }, { status: 401 });
    const opportunity = await payload.findByID({ collection: "opportunities", id: parsed.data.opportunityId, depth: 0, overrideAccess: true });
    if (opportunity.status !== "published") return Response.json({ error: "This opportunity is no longer open." }, { status: 409 });
    const existing = await payload.find({ collection: "opportunity-applications", limit: 1, depth: 0, overrideAccess: true, where: { and: [{ member: { equals: user.id } }, { opportunity: { equals: opportunity.id } }] } });
    let shouldNotify = false;
    if (!existing.docs[0]) {
      await payload.create({ collection: "opportunity-applications", overrideAccess: true, data: { member: user.id, opportunity: opportunity.id, status: parsed.data.status, appliedAt: parsed.data.status === "applied" ? new Date().toISOString() : undefined } });
      shouldNotify = parsed.data.status === "applied";
    } else if (parsed.data.status === "applied" && existing.docs[0].status !== "applied") {
      await payload.update({ collection: "opportunity-applications", id: existing.docs[0].id, overrideAccess: true, data: { status: "applied", appliedAt: new Date().toISOString() } });
      shouldNotify = true;
    }
    if (shouldNotify) {
      await sendEmail({
        to: opsEmail(),
        subject: `Opportunity application recorded: ${opportunity.title}`,
        text: `Member: ${user.email}\nOpportunity: ${opportunity.title}\nCompany: ${opportunity.company}\nApplication URL: ${opportunity.applicationUrl}`,
      });
    }
    return Response.json({ ok: true, applicationUrl: opportunity.applicationUrl });
  } catch (error) {
    console.error("[opportunity-application]", error);
    return Response.json({ error: "Unable to open this application right now." }, { status: 500 });
  }
}
