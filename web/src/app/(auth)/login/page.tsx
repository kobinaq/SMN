import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";
import { getMember } from "@/lib/auth/member";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Social Marketers Network member account.",
};

function safeCallbackUrl(value: string | undefined) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return "/app";
  }
  return value;
}

type Props = { searchParams: Promise<{ callbackUrl?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const params = await searchParams;
  const callbackUrl = safeCallbackUrl(params.callbackUrl);
  const member = await getMember();
  if (member) redirect(callbackUrl);

  return (
    <AuthShell title="Member sign in">
      <Suspense fallback={<div className="h-40 animate-pulse rounded-2xl bg-white/5" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
