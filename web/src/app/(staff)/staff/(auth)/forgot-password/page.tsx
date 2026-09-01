import { AuthShell } from "@/components/auth/AuthShell";
import { StaffForgotPasswordForm } from "@/components/staff/StaffForgotPasswordForm";
import { getStaff } from "@/lib/auth/staff";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Reset staff password" };

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
