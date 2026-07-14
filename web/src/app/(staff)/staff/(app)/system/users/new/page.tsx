import { redirect } from "next/navigation";
import { StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { staffUserFields } from "@/lib/staff/field-defs";
import { canStaff } from "@/lib/staff-permissions";

export default async function NewStaffUserPage() {
  const staff = await requireStaff([], "/staff/system/users/new");
  if (!canStaff(staff)) redirect("/staff?denied=1");

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="System" title="Invite staff" description="Create a staff account with a temporary password and role." />
      <StaffPanel>
        <StaffRecordForm
          collection="users"
          fields={staffUserFields(true)}
          initial={{ role: "support" }}
          submitLabel="Create staff user"
          onSuccessHref="/staff/system/users"
        />
      </StaffPanel>
    </div>
  );
}
