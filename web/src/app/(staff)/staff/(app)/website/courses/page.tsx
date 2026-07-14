import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function WebsiteCoursesPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/courses");
  const payload = await getPayloadClient();
  const courses = await listCollection(payload, staff, "courses", { limit: 100, sort: "-updatedAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Programme catalogue"
        description="Public programme cards and Selar checkout links. LMS courses live under Course Builder."
        action={{ href: "/staff/website/courses/new", label: "New catalogue course" }}
      />
      <StaffPanel>
        {courses.docs.length ? (
          <StaffTable
            columns={["Title", "Status", "Price", "Updated"]}
            rows={courses.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/website/courses/${doc.id}`,
              cells: [doc.title, doc.status, doc.price || "—", doc.updatedAt ? new Date(doc.updatedAt).toLocaleDateString("en-GH") : "—"],
            }))}
          />
        ) : (
          <StaffEmpty>No catalogue courses yet. Add the first public programme card.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
