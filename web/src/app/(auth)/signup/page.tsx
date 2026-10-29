import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";
import { getMember } from "@/lib/auth/member";
import { seoTitle } from "@/lib/brand";

export const metadata: Metadata = {
  title: seoTitle("Create account"),
  description: "Join the Think Social Academy member portal.",
};

export default async function SignupPage() {
  const member = await getMember();
  if (member) redirect("/app");

  return (
    <AuthShell
      title="Join the Network"
      subtitle="Create a free member account to access your portal. Cohort and course access are granted separately."
    >
      <SignupForm />
    </AuthShell>
  );
}
