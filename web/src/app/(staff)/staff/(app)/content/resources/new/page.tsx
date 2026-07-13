import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { resourceFields } from "@/lib/staff/field-defs";

export default async function NewResourcePage() {
  await requireStaff(["content", "learning"], "/staff/content/resources/new");
  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Content" title="New resource" description="Create a downloadable or linked member resource." />
      <StaffPanel>
        <StaffRecordForm collection="resources" fields={resourceFields} submitLabel="Create resource" onSuccessHref="/staff/content/resources" />
      </StaffPanel>
    </div>
  );
}
