import Link from "next/link";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff, staffDisplayName, staffRoleLabel } from "@/lib/auth/staff";

export const metadata = { title: "Account" };

export default async function StaffAccountPage() {
  const staff = await requireStaff([], "/staff/account");

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Account"
        title="Your account"
        description={`${staffDisplayName(staff)} · ${staffRoleLabel(staff)} · ${staff.email}`}
      />
      <StaffPanel>
        <div className="mb-4">
          <h2 className="font-display text-xl text-text-1">Change password</h2>
          <p className="mt-1 text-sm text-text-2">
            Enter your current password to set a new one. If you’ve forgotten it,{" "}
            <Link href="/staff/forgot-password" className="text-accent hover:underline">
              reset it here
            </Link>
            .
          </p>
        </div>
        <ChangePasswordForm endpoint="/api/staff-auth/change-password" minLength={10} />
      </StaffPanel>
    </div>
  );
}
