import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { sendEmail } from "@/lib/email";
import { canStaff } from "@/lib/staff-permissions";

const id = z.union([z.string().min(1), z.number()]);
const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("mentor-decision"), mentorId: id, decision: z.enum(["approved", "rejected"]), reason: z.string().trim().max(2000).default("") }),
  z.object({ action: z.literal("request-transition"), requestId: id, status: z.enum(["reviewing", "introduced", "completed", "declined"]), reason: z.string().trim().max(2000).default("") }),
]);
const relationshipID = (value: unknown) => value && typeof value === "object" && "id" in value ? value.id : value;

export async function POST(request: Request) {
  const payload = await getPayloadClient(); const { user } = await payload.auth({ headers: request.headers });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff access required." }, { status: 401 });
  if (!canStaff(user, "mentorship")) return Response.json({ error: "Mentorship operations permission required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return Response.json({ error: "Invalid mentorship operation." }, { status: 400 });
  const input = parsed.data; const access = { overrideAccess: false, user } as const;
  if (input.action === "mentor-decision") {
    if (input.decision === "rejected" && input.reason.length < 10) return Response.json({ error: "A rejection explanation of at least 10 characters is required." }, { status: 400 });
    const mentor = await payload.findByID({ collection: "mentors", id: input.mentorId, depth: 1, ...access }); const before = mentor.status;
    const updated = await payload.update({ collection: "mentors", id: mentor.id, data: { status: input.decision, rejectionReason: input.decision === "rejected" ? input.reason : null }, ...access });
    await payload.create({ collection: "audit-events", data: { actor: user.id, action: `mentorship.mentor.${input.decision}`, entityType: "mentors", entityId: String(mentor.id), reason: input.reason || "Staff approved mentor application.", before: { status: before }, after: { status: updated.status }, visibility: "staff" }, ...access });
    if (input.decision === "rejected") { const member = mentor.member && typeof mentor.member === "object" ? mentor.member : await payload.findByID({ collection: "members", id: relationshipID(mentor.member) as string | number, depth: 0, overrideAccess: true }); await sendEmail({ to: member.email, subject: "Update on your SMN mentor application", text: `Hi ${member.name || "there"},\n\nYour mentor application was not approved at this time.\n\n${input.reason}\n\nSocial Marketers Network` }); }
    return Response.json({ ok: true });
  }
  if ((input.status === "declined") && input.reason.length < 10) return Response.json({ error: "A decline explanation of at least 10 characters is required." }, { status: 400 });
  const mentorshipRequest = await payload.findByID({ collection: "mentorship-requests", id: input.requestId, depth: 2, ...access }); const before = mentorshipRequest.status;
  const mentorID = relationshipID(mentorshipRequest.mentor) as string | number; const requesterID = relationshipID(mentorshipRequest.requester) as string | number;
  if (input.status === "introduced") {
    const mentor = await payload.findByID({ collection: "mentors", id: mentorID, depth: 1, ...access }); if (mentor.status !== "approved" || mentor.availability === "Unavailable") return Response.json({ error: "This mentor is not available for introductions." }, { status: 409 });
    const active = await payload.count({ collection: "mentorship-relationships", where: { and: [{ mentor: { equals: mentor.id } }, { status: { equals: "active" } }] }, ...access }); if (active.totalDocs >= Number(mentor.maxActiveMentees ?? 0)) return Response.json({ error: "This mentor is at active-mentee capacity." }, { status: 409 });
    const existing = await payload.find({ collection: "mentorship-relationships", depth: 0, limit: 1, where: { request: { equals: mentorshipRequest.id } }, ...access }); if (!existing.totalDocs) await payload.create({ collection: "mentorship-relationships", data: { request: mentorshipRequest.id, mentor: mentor.id, mentee: requesterID, status: "active", startedAt: new Date().toISOString() }, ...access });
  }
  if (input.status === "completed") { const relations = await payload.find({ collection: "mentorship-relationships", depth: 0, limit: 10, where: { request: { equals: mentorshipRequest.id } }, ...access }); await Promise.all(relations.docs.map((item) => payload.update({ collection: "mentorship-relationships", id: item.id, data: { status: "completed", endedAt: new Date().toISOString() }, ...access }))); }
  const updated = await payload.update({ collection: "mentorship-requests", id: mentorshipRequest.id, data: { status: input.status, decisionReason: input.reason || null }, ...access });
  await payload.create({ collection: "audit-events", data: { actor: user.id, action: `mentorship.request.${input.status}`, entityType: "mentorship-requests", entityId: String(mentorshipRequest.id), reason: input.reason || `Staff moved request to ${input.status}.`, before: { status: before }, after: { status: updated.status }, visibility: "staff" }, ...access });
  const requester = mentorshipRequest.requester && typeof mentorshipRequest.requester === "object" ? mentorshipRequest.requester : await payload.findByID({ collection: "members", id: requesterID, depth: 0, overrideAccess: true });
  if (["introduced", "declined"].includes(input.status)) await sendEmail({ to: requester.email, subject: `SMN mentorship request ${input.status}`, text: `Hi ${requester.name || "there"},\n\nYour mentorship request is now ${input.status}.\n\n${input.reason || "Sign in to SMN for the latest details."}\n\nSocial Marketers Network` });
  return Response.json({ ok: true });
}
