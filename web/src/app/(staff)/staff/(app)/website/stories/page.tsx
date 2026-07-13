import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function WebsiteStoriesPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/stories");
  const payload = await getPayloadClient();
  const stories = await listCollection(payload, staff, "stories", { limit: 100, sort: "-updatedAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Stories"
        description="Member and alumni quotes featured on the marketing site."
        action={{ href: "/staff/website/stories/new", label: "New story" }}
      />
      <StaffPanel>
        {stories.docs.length ? (
          <StaffTable
            columns={["Name", "Role", "Updated"]}
            rows={stories.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/website/stories/${doc.id}`,
              cells: [doc.name, doc.role, doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString("en-GH") : "—"],
            }))}
          />
        ) : (
          <StaffEmpty>No stories yet. Add the first community quote.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
