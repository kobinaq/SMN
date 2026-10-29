import { AuthShell } from "@/components/auth/AuthShell";
import { StaffForgotPasswordForm } from "@/components/staff/StaffForgotPasswordForm";
import { getStaff } from "@/lib/auth/staff";
import { pageTitle } from "@/lib/brand";
import { redirect } from "next/navigation";

export const metadata = { title: pageTitle("Reset staff password", { staff: true }) };

export const dynamic = "force-dynamic";
export default async function StaffForgotPasswordPage() {
  const staff = await getStaff();
  if (staff) redirect("/staff");

  return (
    <AuthShell
      title="Reset password"
      subtitle="Enter the work email on your staff account. We’ll send a reset link when email delivery is configured."
    >
      <StaffForgotPasswordForm />
    </AuthShell>
  );
}
