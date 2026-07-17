"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { trackEvent } from "@/lib/analytics";

export function CourseCheckoutButton({
  courseId,
  amount,
  label = "Enroll now",
  signedIn,
}: {
  courseId: string | number;
  amount?: number | null;
  label?: string;
  signedIn: boolean;
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

  return (
    <button
      type="button"
      disabled={busy || !payable}
      onClick={run}
      className="inline-flex items-center gap-1 text-sm text-white hover:text-baby-blue disabled:opacity-40"
    >
      {busy ? "Starting…" : label} <ArrowRight className="h-4 w-4" />
    </button>
  );
}
