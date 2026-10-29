import { StaffTodayHome } from "@/components/staff/StaffTodayHome";
import { getAdminOpsSnapshot } from "@/lib/admin-dashboard";
import { requireStaff, staffDisplayName, staffRoleLabel } from "@/lib/auth/staff";
import { pageTitle } from "@/lib/brand";
import { getPayloadClient } from "@/lib/payload";

export const metadata = { title: pageTitle("Today", { staff: true }) };

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
