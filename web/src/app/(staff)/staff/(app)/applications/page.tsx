import { ApplicationStatusSelect } from "@/components/staff/ApplicationStatusSelect";
import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export default async function CohortApplicationsPage() {
  const staff = await requireStaff(["content", "support", "analyst"], "/staff/applications");
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "cohort-applications",
    depth: 0,
    limit: 200,
    sort: "-createdAt",
    ...staffAccess(staff),
  });

  const docs = result.docs as Array<{
    id: string | number;
    name?: string;
    email?: string;
    phone?: string;
    country?: string;
    role?: string;
    level?: string;
    status?: string;
    createdAt?: string;
  }>;

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Work"
        title="Cohort applications"
        description="Inbox from the public apply form. Status lives on the record, not in email."
      />
      <StaffPanel>
        {docs.length ? (
          <StaffTable
            columns={["Name", "Email", "Role", "Level", "Received", "Status"]}
            rows={docs.map((doc) => ({
              key: String(doc.id),
              cells: [
                doc.name || "—",
                doc.email || "—",
                doc.role || "—",
                doc.level || "—",
                doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GH") : "—",
                <ApplicationStatusSelect key={doc.id} id={doc.id} status={String(doc.status || "received")} />,
              ],
            }))}
          />
        ) : (
          <StaffEmpty>No applications yet.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
