"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function RegistrationCancelActions({
  registrationId,
  status,
  canRefund,
}: {
  registrationId: string | number;
  status: string;
  canRefund: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);

  if (status === "cancelled") {
    return <span className="text-xs text-white/35">Cancelled</span>;
  }

  async function run(action: "cancel" | "cancel_refund") {
    setBusy(true);
    try {
      const response = await fetch("/api/staff/events/registrations", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ registrationId, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update registration.");
      toast.push(result.refunded ? "Cancelled and refunded." : "Registration cancelled.", "success");
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to cancel.", "error");
      setBusy(false);
    }
  }

  return (
    <span className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={busy}
        onClick={() => run("cancel")}
        className="text-xs text-white/50 hover:text-white disabled:opacity-40"
      >
        Cancel
      </button>
      {canRefund ? (
        <button
          type="button"
          disabled={busy}
          onClick={() => run("cancel_refund")}
          className="text-xs text-amber-200/70 hover:text-amber-100 disabled:opacity-40"
        >
          Cancel + refund
        </button>
      ) : null}
    </span>
  );
}
