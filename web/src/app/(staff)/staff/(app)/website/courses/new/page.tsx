import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { courseFields } from "@/lib/staff/field-defs";

export default async function NewWebsiteCoursePage() {
  await requireStaff(["content"], "/staff/website/courses/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title="New catalogue course" description="Public programme listing shown on the marketing site." />
      <StaffPanel>
        <StaffRecordForm
          collection="courses"
          fields={courseFields}
          initial={{ status: "published" }}
          submitLabel="Create course"
          onSuccessHref="/staff/website/courses"
        />
      </StaffPanel>
    </div>
  );
}
