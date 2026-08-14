import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { courseFields } from "@/lib/staff/field-defs";
import { staffAccess } from "@/lib/staff/records";

export default async function NewWebsiteCoursePage() {
  const staff = await requireStaff(["content"], "/staff/website/courses/new");
  const payload = await getPayloadClient();
  const lms = await payload.find({
    collection: "lms-courses",
    depth: 0,
    limit: 100,
    sort: "title",
    ...staffAccess(staff),
  });
  const lmsOptions = lms.docs.map((doc) => ({
    label: `${doc.title} (${doc.status})`,
    value: String(doc.id),
  }));

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Website" title="New catalogue course" description="Public programme listing shown on the marketing site." />
      <StaffPanel>
        <StaffRecordForm
          collection="courses"
          fields={courseFields(lmsOptions)}
          initial={{ status: "published" }}
          submitLabel="Create course"
          onSuccessHref="/staff/website/courses"
        />
      </StaffPanel>
    </div>
  );
}
