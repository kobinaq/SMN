"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

export function CourseCheckoutButton({
  courseId,
  amount,
  label = "Enroll now",
  signedIn,
  variant = "text",
  className,
}: {
  courseId: string | number;
  amount?: number | null;
  label?: string;
  signedIn: boolean;
  variant?: "text" | "button";
  className?: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const payable = typeof amount === "number" && amount >= 100;

  async function run() {
    if (!signedIn) {
      router.push(`/login?callbackUrl=${encodeURIComponent("/programs/courses")}`);
      return;
    }
    if (!payable) {
      toast.push("This programme is not available for checkout yet.", "error");
      return;
    }
    setBusy(true);
    trackEvent("payment_start", { kind: "course" });
    try {
      const response = await fetch("/api/payments/initialize", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind: "course", courseId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to start checkout.");
      window.location.href = result.authorizationUrl;
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Checkout failed.", "error");
      setBusy(false);
    }
  }

  const displayLabel = busy
    ? "Starting…"
    : !signedIn
      ? "Sign in to enroll"
      : !payable
        ? "Coming soon"
        : label;

  return (
    <button
      type="button"
      disabled={busy || (signedIn && !payable)}
      onClick={run}
      className={cn(
        "inline-flex items-center gap-1.5 transition disabled:opacity-40",
        variant === "button"
          ? "rounded-full bg-baby-blue px-5 py-2.5 text-sm font-medium text-near-black hover:bg-white"
          : "text-sm text-white hover:text-baby-blue",
        className,
      )}
    >
      {displayLabel} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
