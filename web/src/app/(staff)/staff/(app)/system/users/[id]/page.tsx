import { notFound, redirect } from "next/navigation";
import { StaffDeleteButton, StaffRecordForm } from "@/components/staff/StaffRecordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffUserFields } from "@/lib/staff/field-defs";
import { getCollectionDoc } from "@/lib/staff/records";
import { canStaff } from "@/lib/staff-permissions";

export default async function EditStaffUserPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff([], "/staff/system/users");
  if (!canStaff(staff)) redirect("/staff?denied=1");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "users", id, 0);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="System" title={doc.name || doc.email} description={doc.email} />
      <StaffPanel>
        <StaffRecordForm
          collection="users"
          action="update"
          id={doc.id}
          fields={staffUserFields(false)}
          initial={{
            name: doc.name || "",
            email: doc.email,
            role: doc.role || "super-admin",
          }}
          submitLabel="Save staff user"
          onSuccessHref={`/staff/system/users/${doc.id}`}
        />
        <div className="mt-6 border-t border-white/10 pt-4">
          <StaffDeleteButton collection="users" id={doc.id} redirectTo="/staff/system/users" />
        </div>
      </StaffPanel>
    </div>
  );
}
