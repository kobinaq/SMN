import { CertificateIssuer, CertificateLifecycle } from "@/components/payload/CertificateActions";
import { StaffEmpty, StaffMetricGrid, StaffOpsRow, StaffPageHeader, StaffPanel, staffOpsChrome } from "@/components/staff/ui";
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
      label: `${rel(item.member)?.name || "Member"} — ${item.programName}`,
      detail: `${rel(item.member)?.email || "No email"} · completed ${
        item.completedAt
          ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(item.completedAt))
          : "date unavailable"
      }`,
    }));

  const valid = certificates.docs.filter((item) => item.status === "valid");
  const revoked = certificates.docs.filter((item) => item.status === "revoked").length;

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Credentials"
        title="Certificates"
        description="Confirm eligibility, issue in bulk, prevent duplicates, and manage the credential lifecycle."
      />

      <StaffMetricGrid
        items={[
          { label: "Eligible", value: eligible.length },
          { label: "Valid certificates", value: valid.length },
          { label: "Revoked", value: revoked },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">1. Select eligible completions</h2>
          {eligible.length ? <CertificateIssuer eligible={eligible} /> : <StaffEmpty>No eligible completions without a certificate.</StaffEmpty>}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">2. Review active credentials</h2>
          {valid.length ? (
            valid.map((item) => (
              <StaffOpsRow
                key={item.id}
                title={item.title}
                detail={`${rel(item.member)?.name || "Member"} · ${item.credentialCode} · notification ${item.notificationStatus || "pending"}`}
              >
                <CertificateLifecycle certificateId={item.id} />
              </StaffOpsRow>
            ))
          ) : (
            <StaffEmpty>No valid certificates yet.</StaffEmpty>
          )}
        </StaffPanel>
      </div>
    </div>
  );
}
