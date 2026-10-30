import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { StaffResetPasswordForm } from "@/components/staff/StaffResetPasswordForm";
import { getStaff } from "@/lib/auth/staff";
import { pageTitle } from "@/lib/brand";
import { redirect } from "next/navigation";

export const metadata = { title: pageTitle("Set a new staff password", { staff: true }) };

export const dynamic = "force-dynamic";
export default async function StaffResetPasswordPage() {
  const staff = await getStaff();
  if (staff) redirect("/staff");

  return (
    <AuthShell title="Set a new password" subtitle="Choose a new password for your TSA staff account.">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
        <StaffResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
