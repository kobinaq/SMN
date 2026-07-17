import { CertificateWizard } from "@/components/staff/CertificateWizard";
import { StaffMetricGrid, StaffPageHeader, staffOpsChrome } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

const rel = (value: unknown) =>
  value && typeof value === "object" && "id" in value
    ? (value as { id: string | number; name?: string; email?: string })
    : null;

export default async function StaffCertificatesPage() {
  const staff = await requireStaff(["learning", "support"], "/staff/certificates");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);

  const [enrollments, certificates] = await Promise.all([
    payload.find({
      collection: "enrollments",
      depth: 1,
      limit: 500,
      sort: "-completedAt",
      where: { and: [{ status: { equals: "completed" } }, { certificateEligible: { equals: true } }] },
      ...access,
    }),
    payload.find({ collection: "certificates", depth: 1, limit: 500, sort: "-issuedAt", ...access }),
  ]);

  const active = new Set(
    certificates.docs.filter((item) => item.status === "valid").map((item) => item.activeIssuanceKey).filter(Boolean),
  );
  const eligible = enrollments.docs
    .filter((item) => !active.has(`${rel(item.member)?.id ?? item.member}:${item.programKey}`))
    .map((item) => ({
      id: item.id,
      name: rel(item.member)?.name || "Member",
      program: item.programName,
      email: rel(item.member)?.email,
      completedAt: item.completedAt,
    }));

  const valid = certificates.docs.filter((item) => item.status === "valid");
  const revoked = certificates.docs.filter((item) => item.status === "revoked").length;

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader eyebrow="Work" title="Certificates" hint="Select, preview, then issue." />

      <StaffMetricGrid
        items={[
          { label: "Due", value: eligible.length },
          { label: "Valid", value: valid.length },
          { label: "Revoked", value: revoked },
        ]}
      />

      <CertificateWizard
        eligible={eligible}
        issued={valid.map((item) => ({
          id: item.id,
          title: item.title,
          memberName: rel(item.member)?.name || "Member",
          credentialCode: item.credentialCode,
          notificationStatus: item.notificationStatus,
        }))}
      />
    </div>
  );
}
