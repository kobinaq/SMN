import { StaffEmptyState, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";
import Link from "next/link";

export default async function WebsiteCoursesPage() {
  const staff = await requireStaff(["content", "analyst"], "/staff/website/courses");
  const payload = await getPayloadClient();
  const courses = await listCollection(payload, staff, "courses", { limit: 100, sort: "-updatedAt" });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Site"
        title="Catalogue"
        hint="Public programme cards and checkout links."
        action={{ href: "/staff/website/courses/new", label: "New catalogue course" }}
      />
      <p className="text-xs text-white/40">
        Looking for teachable programs?{" "}
        <Link href="/staff/learning" className="text-baby-blue hover:underline">
          Learning programs →
        </Link>
      </p>
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
          <StaffEmptyState
            title="No catalogue courses"
            steps={[
              { label: "Add a card", href: "/staff/website/courses/new", active: true },
              { label: "Set checkout link" },
              { label: "Publish" },
            ]}
            action={{ href: "/staff/website/courses/new", label: "New catalogue course" }}
          />
        )}
      </StaffPanel>
    </div>
  );
}
