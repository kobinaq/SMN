import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

export default async function CohortApplicationsPage() {
  const staff = await requireStaff(["content", "support", "analyst", "learning"], "/staff/applications");
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "cohort-applications",
    depth: 1,
    limit: 200,
    sort: "-createdAt",
    ...staffAccess(staff),
  });

  const docs = result.docs as Array<{
    id: string | number;
    name?: string;
    email?: string;
    role?: string;
    level?: string;
    status?: string;
    createdAt?: string;
    course?: { title?: string | null } | number | string | null;
  }>;

  function courseTitle(value: (typeof docs)[number]["course"]) {
    if (value && typeof value === "object" && value.title) return value.title;
    return "—";
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Work"
        title="Applications"
        hint="Open a row to grant access or send a Paystack link."
      />
      <StaffPanel>
        {docs.length ? (
          <StaffTable
            columns={["Name", "Email", "Course", "Role", "Received", "Status"]}
            rows={docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/applications/${doc.id}`,
              cells: [
                doc.name || "—",
                doc.email || "—",
                courseTitle(doc.course),
                doc.role || "—",
                doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GH") : "—",
                doc.status || "received",
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
