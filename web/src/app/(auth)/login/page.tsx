import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getMember } from "@/lib/auth/member";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Social Marketers Network member account.",
};

export default async function LoginPage() {
  const member = await getMember();
  if (member) redirect("/app");

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to your member portal for learning, mentors, and opportunities. Staff CMS is at /admin with a separate staff account."
    >
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
