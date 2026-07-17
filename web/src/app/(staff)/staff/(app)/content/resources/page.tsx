import { StaffEmptyState, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function StaffResourcesPage() {
  const staff = await requireStaff(["content", "learning", "analyst"], "/staff/content/resources");
  const payload = await getPayloadClient();
  const resources = await listCollection(payload, staff, "resources", { limit: 100, sort: "-updatedAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Site"
        title="Resources"
        hint="Templates and downloadable assets."
        action={{ href: "/staff/content/resources/new", label: "New resource" }}
      />
      <StaffPanel>
        {resources.docs.length ? (
          <StaffTable
            columns={["Title", "Type", "Updated"]}
            rows={resources.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/content/resources/${doc.id}`,
              cells: [doc.title, doc.type, doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString("en-GH") : "—"],
            }))}
          />
        ) : (
          <StaffEmptyState
            title="No resources yet"
            steps={[
              { label: "Add a resource", href: "/staff/content/resources/new", active: true },
              { label: "Attach a file" },
              { label: "Publish" },
            ]}
            action={{ href: "/staff/content/resources/new", label: "New resource" }}
          />
        )}
      </StaffPanel>
    </div>
  );
}
