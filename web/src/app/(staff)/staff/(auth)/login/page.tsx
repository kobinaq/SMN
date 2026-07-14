import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { StaffLoginForm } from "@/components/staff/StaffLoginForm";
import { getStaff, staffUserCount } from "@/lib/auth/staff";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";
export const metadata = { title: "Staff sign in" };

export default async function StaffLoginPage() {
  const staff = await getStaff();
  if (staff) redirect("/staff");
  const count = await staffUserCount();
  const bootstrap = count === 0;

  return (
    <AuthShell
      title={bootstrap ? "Set up SMN staff" : "Staff sign in"}
      subtitle={
        bootstrap
          ? "Create the first staff account. This person becomes a super admin."
          : "Operations, content, and network administration for Social Marketers Network."
      }
    >
      <Suspense fallback={<p className="text-sm text-white/50">Loading…</p>}>
        <StaffLoginForm bootstrap={bootstrap} />
      </Suspense>
      <p className="mt-6 text-center text-xs text-white/35">
        Members sign in at <a className="text-baby-blue hover:underline" href="/login">/login</a>
      </p>
    </AuthShell>
  );
}
