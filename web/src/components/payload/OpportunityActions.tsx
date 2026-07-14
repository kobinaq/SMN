"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

export function OpportunityActions({
  opportunityId,
  current,
}: {
  opportunityId: string | number;
  current: string;
}) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<"published" | "closed" | "archived" | null>(null);
  const [reason, setReason] = useState("");

  async function confirm() {
    if (!pending) return;
    if (reason.trim().length < 5) {
      setError("Provide a short reason (minimum 5 characters).");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/admin/opportunity-operations", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ opportunityId, status: pending, reason: reason.trim() }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to moderate listing.");
      toast.push(`Opportunity marked ${pending}.`, "success");
      setPending(null);
      setReason("");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to moderate listing.";
      setError(message);
      toast.push(message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="smn-ops-actions">
      <button
        disabled={busy || current === "published"}
        onClick={() => {
          setReason("");
          setPending("published");
        }}
        type="button"
      >
        Publish
      </button>
      <button
        disabled={busy || current === "closed"}
        onClick={() => {
          setReason("");
          setPending("closed");
        }}
        type="button"
      >
        Close
      </button>
      <button
        disabled={busy || current === "archived"}
        onClick={() => {
          setReason("");
          setPending("archived");
        }}
        type="button"
      >
        Archive
      </button>
      {error ? <span role="alert">{error}</span> : null}
      <ConfirmDialog
        open={Boolean(pending)}
        title={`Change opportunity to ${pending}?`}
        description={`Current status is ${current}. Provide a short audit reason.`}
        confirmLabel="Confirm"
        destructive={pending === "archived" || pending === "closed"}
        busy={busy}
        onClose={() => !busy && setPending(null)}
        onConfirm={confirm}
      >
        <label className="block text-sm text-white/70">
          Reason
          <textarea
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            minLength={5}
          />
        </label>
      </ConfirmDialog>
    </div>
  );
}
