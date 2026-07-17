import { requireStaff, staffDisplayName, staffRoleLabel } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { getAdminOpsSnapshot } from "@/lib/admin-dashboard";
import { StaffTodayHome } from "@/components/staff/StaffTodayHome";

export default async function StaffHomePage({
  searchParams,
}: {
  searchParams: Promise<{ denied?: string }>;
}) {
  const staff = await requireStaff([], "/staff");
  const payload = await getPayloadClient();
  const snapshot = await getAdminOpsSnapshot(payload, staff);
  const params = await searchParams;

  return (
    <StaffTodayHome
      name={staffDisplayName(staff)}
      roleLabel={staffRoleLabel(staff)}
      denied={Boolean(params.denied)}
      attention={snapshot.attention}
      metrics={snapshot.metrics}
      health={snapshot.health}
      activities={snapshot.activities}
      quickActions={snapshot.quickActions}
      inline={snapshot.inline}
    />
  );
}
