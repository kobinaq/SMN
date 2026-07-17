"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function CancelRegistrationButton({
  registrationId,
  canRefund,
}: {
  registrationId: string | number;
  canRefund?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  async function run(action: "cancel" | "cancel_refund") {
    if (busy) return;
    const label = action === "cancel_refund" ? "Cancel and refund this registration?" : "Cancel this registration?";
    if (!window.confirm(label)) return;
    setBusy(true);
    try {
      const response = await fetch("/api/staff/events/registrations", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ registrationId, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to cancel.");
      toast.push(result.refunded ? "Cancelled and refund requested." : "Registration cancelled.", "success");
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to cancel.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => run("cancel")}
        className="text-xs text-amber-200/80 hover:underline disabled:opacity-50"
      >
        Cancel
      </button>
      {canRefund ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => run("cancel_refund")}
          className="text-xs text-rose-300/80 hover:underline disabled:opacity-50"
        >
          Cancel + refund
        </button>
      ) : null}
    </span>
  );
}
