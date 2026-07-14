import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";
import { canStaff } from "@/lib/staff-permissions";

export default async function StaffUsersPage() {
  const staff = await requireStaff(["support", "analyst"], "/staff/system/users");
  const payload = await getPayloadClient();
  const users = await listCollection(payload, staff, "users", { limit: 100, sort: "email" });
  const canWrite = canStaff(staff);

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="System"
        title="Staff users"
        description="Invite operators and assign least-privilege roles. Only super admins can create or edit accounts."
        action={canWrite ? { href: "/staff/system/users/new", label: "Invite staff" } : undefined}
      />
      <StaffPanel>
        {users.docs.length ? (
          <StaffTable
            columns={["Name", "Email", "Role"]}
            rows={users.docs.map((doc) => ({
              key: String(doc.id),
              href: canWrite ? `/staff/system/users/${doc.id}` : undefined,
              cells: [doc.name || "—", doc.email, String(doc.role || "super-admin").replace("-", " ")],
            }))}
          />
        ) : (
          <StaffEmpty>No staff users found.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
