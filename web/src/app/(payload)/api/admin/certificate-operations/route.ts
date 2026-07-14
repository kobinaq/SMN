import { randomUUID } from "node:crypto";
import { z } from "zod";
import { getPayloadClient } from "@/lib/payload";
import { staffAuthHeaders } from "@/lib/auth/staff";
import { sendEmail } from "@/lib/email";
import { canStaff } from "@/lib/staff-permissions";

const issueSchema = z.object({ action: z.literal("issue"), enrollmentIds: z.array(z.coerce.number().int().positive()).min(1).max(100) });
const certificateActionSchema = z.object({ action: z.enum(["revoke", "reissue"]), certificateId: z.coerce.number().int().positive(), reason: z.string().trim().min(8).max(1000) });
const schema = z.discriminatedUnion("action", [issueSchema, certificateActionSchema]);
const relationshipId = (value: unknown) => Number(typeof value === "object" && value && "id" in value ? (value as { id: string | number }).id : value);
const code = () => `SMN-${randomUUID().replaceAll("-", "").slice(0, 16).toUpperCase()}`;

export async function POST(request: Request) {
  const payload = await getPayloadClient();
  const { user } = await payload.auth({ headers: await staffAuthHeaders(request) });
  if (!user || user.collection !== "users") return Response.json({ error: "Staff access required." }, { status: 401 });
  if (!canStaff(user, "learning")) return Response.json({ error: "Learning operations permission required." }, { status: 403 });
  const parsed = schema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Invalid certificate operation." }, { status: 400 });
  const access = { overrideAccess: false, user } as const;

  if (parsed.data.action === "issue") {
    const created: Array<string | number> = [];
    try {
      const enrollments = await Promise.all(parsed.data.enrollmentIds.map((id) => payload.findByID({ collection: "enrollments", id, depth: 1, ...access })));
      for (const enrollment of enrollments) {
        if (enrollment.status !== "completed" || !enrollment.certificateEligible) throw new Error(`${enrollment.programName} is not certificate eligible.`);
        const memberId = relationshipId(enrollment.member);
        const activeIssuanceKey = `${memberId}:${enrollment.programKey}`;
        const duplicate = await payload.find({ collection: "certificates", depth: 0, limit: 1, where: { activeIssuanceKey: { equals: activeIssuanceKey } }, ...access });
        if (duplicate.totalDocs) throw new Error(`A valid certificate already exists for ${enrollment.programName}.`);
        const certificate = await payload.create({ collection: "certificates", data: { member: memberId, title: `${enrollment.programName} Certificate`, programName: enrollment.programName, programKey: enrollment.programKey, course: enrollment.course ? relationshipId(enrollment.course) : undefined, enrollment: enrollment.id, issuedBy: user.id, activeIssuanceKey, credentialCode: code(), issuedAt: new Date().toISOString(), status: "valid", visibility: "public", notificationStatus: "pending" }, ...access });
        created.push(certificate.id);
      }
      for (const certificateId of created) {
        const certificate = await payload.findByID({ collection: "certificates", id: certificateId, depth: 1, ...access });
        const member = certificate.member && typeof certificate.member === "object" ? certificate.member : await payload.findByID({ collection: "members", id: relationshipId(certificate.member), depth: 0, overrideAccess: true });
        const result = await sendEmail({ to: member.email, subject: `Your ${certificate.programName} certificate`, text: `Hi ${member.name || "there"},\n\nYour SMN certificate has been issued. Credential code: ${certificate.credentialCode}.\n\nSocial Marketers Network` });
        await payload.update({ collection: "certificates", id: certificate.id, data: { notificationStatus: "error" in result ? "failed" : "skipped" in result ? "skipped" : "sent" }, ...access });
        await payload.create({ collection: "audit-events", data: { actor: user.id, action: "certificate.issued", entityType: "certificates", entityId: String(certificate.id), reason: "Eligible enrollment selected in the certificate issuing wizard.", after: { enrollment: relationshipId(certificate.enrollment), credentialCode: certificate.credentialCode }, visibility: "staff" }, ...access });
      }
      return Response.json({ ok: true, issued: created.length });
    } catch (error) {
      await Promise.allSettled(created.map((id) => payload.delete({ collection: "certificates", id, overrideAccess: true })));
      return Response.json({ error: error instanceof Error ? error.message : "Issuance failed; created certificates were compensated." }, { status: 409 });
    }
  }

  const current = await payload.findByID({ collection: "certificates", id: parsed.data.certificateId, depth: 1, ...access });
  if (current.status === "revoked" && parsed.data.action === "revoke") return Response.json({ error: "Certificate is already revoked." }, { status: 409 });
  const now = new Date().toISOString();
  if (parsed.data.action === "revoke") {
    await payload.update({ collection: "certificates", id: current.id, data: { status: "revoked", activeIssuanceKey: null, revokedAt: now, revokedBy: user.id, revocationReason: parsed.data.reason }, ...access });
    await payload.create({ collection: "audit-events", data: { actor: user.id, action: "certificate.revoked", entityType: "certificates", entityId: String(current.id), reason: parsed.data.reason, before: { status: current.status }, after: { status: "revoked" }, visibility: "staff" }, ...access });
    return Response.json({ ok: true });
  }

  const memberId = relationshipId(current.member);
  const activeIssuanceKey = `${memberId}:${current.programKey || current.programName}`;
  // Copy skill values only — do not reuse array row ids from the previous certificate.
  const skills = (Array.isArray(current.skills) ? current.skills : []).flatMap((item) => {
    const skill =
      item && typeof item === "object" && "skill" in item
        ? String((item as { skill?: unknown }).skill || "").trim()
        : "";
    return skill ? [{ skill }] : [];
  });
  let replacementId: number | undefined;
  try {
    await payload.update({
      collection: "certificates",
      id: current.id,
      data: {
        status: "revoked",
        activeIssuanceKey: null,
        revokedAt: now,
        revokedBy: user.id,
        revocationReason: `Reissued: ${parsed.data.reason}`,
      },
      ...access,
    });
    const replacement = await payload.create({
      collection: "certificates",
      data: {
        member: memberId,
        title: current.title,
        programName: current.programName,
        programKey: current.programKey,
        course: current.course ? relationshipId(current.course) : undefined,
        enrollment: current.enrollment ? relationshipId(current.enrollment) : undefined,
        issuedBy: user.id,
        activeIssuanceKey,
        credentialCode: code(),
        summary: current.summary,
        skills,
        issuedAt: now,
        expiresAt: current.expiresAt,
        status: "valid",
        visibility: current.visibility,
        reissuedFrom: current.id,
        notificationStatus: "pending",
      },
      ...access,
    });
    replacementId = replacement.id;
    await payload.create({
      collection: "audit-events",
      data: {
        actor: user.id,
        action: "certificate.reissued",
        entityType: "certificates",
        entityId: String(replacement.id),
        reason: parsed.data.reason,
        before: { certificateId: current.id, credentialCode: current.credentialCode },
        after: { certificateId: replacement.id, credentialCode: replacement.credentialCode },
        visibility: "staff",
      },
      ...access,
    });
    return Response.json({ ok: true, certificateId: replacement.id });
  } catch (error) {
    console.error("[certificate-operations:reissue]", error);
    if (replacementId) await payload.delete({ collection: "certificates", id: replacementId, overrideAccess: true }).catch(() => undefined);
    await payload
      .update({
        collection: "certificates",
        id: current.id,
        data: {
          status: current.status,
          activeIssuanceKey: current.activeIssuanceKey,
          revokedAt: current.revokedAt,
          revokedBy: current.revokedBy ? relationshipId(current.revokedBy) : null,
          revocationReason: current.revocationReason,
        },
        overrideAccess: true,
      })
      .catch(() => undefined);
    return Response.json({ error: "Reissue failed and was compensated. Try again or contact support." }, { status: 409 });
  }
}
