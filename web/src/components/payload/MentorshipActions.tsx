"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

async function send(body: Record<string, unknown>) {
  const response = await fetch("/api/admin/mentorship-operations", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Unable to update mentorship workflow.");
}

type PendingAction =
  | { kind: "mentor"; decision: "approved" | "rejected" }
  | { kind: "request"; status: string }
  | null;

export function MentorDecision({ mentorId }: { mentorId: string | number }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<PendingAction>(null);
  const [reason, setReason] = useState("");

  async function confirm() {
    if (!pending || pending.kind !== "mentor") return;
    if (pending.decision === "rejected" && reason.trim().length < 10) {
      setError("Provide at least 10 characters explaining the rejection.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await send({
        action: "mentor-decision",
        mentorId,
        decision: pending.decision,
        reason: pending.decision === "rejected" ? reason.trim() : "Staff approved mentor application.",
      });
      toast.push(pending.decision === "approved" ? "Mentor approved." : "Mentor application rejected.", "success");
      setPending(null);
      setReason("");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to update.";
      setError(message);
      toast.push(message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="smn-ops-actions">
      <button disabled={busy} onClick={() => setPending({ kind: "mentor", decision: "approved" })} type="button">
        Approve
      </button>
      <button
        disabled={busy}
        onClick={() => {
          setReason("");
          setPending({ kind: "mentor", decision: "rejected" });
        }}
        type="button"
      >
        Reject
      </button>
      {error ? <span role="alert">{error}</span> : null}
      <ConfirmDialog
        open={Boolean(pending && pending.kind === "mentor")}
        title={pending?.kind === "mentor" && pending.decision === "approved" ? "Approve mentor?" : "Reject mentor application?"}
        description={
          pending?.kind === "mentor" && pending.decision === "approved"
            ? "The applicant will be marked as an approved mentor."
            : "Explain the decision so the applicant understands what to improve."
        }
        confirmLabel={pending?.kind === "mentor" && pending.decision === "approved" ? "Approve" : "Reject"}
        destructive={pending?.kind === "mentor" && pending.decision === "rejected"}
        busy={busy}
        onClose={() => !busy && setPending(null)}
        onConfirm={confirm}
      >
        {pending?.kind === "mentor" && pending.decision === "rejected" ? (
          <label className="block text-sm text-white/70">
            Rejection reason
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              minLength={10}
              required
            />
          </label>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}

export function RequestTransition({ requestId, current }: { requestId: string | number; current: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<string | null>(null);
  const [reason, setReason] = useState("");

  async function confirm() {
    if (!pending) return;
    if (pending === "declined" && reason.trim().length < 10) {
      setError("Provide at least 10 characters explaining the decline.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await send({
        action: "request-transition",
        requestId,
        status: pending,
        reason: pending === "declined" ? reason.trim() : `Staff moved request from ${current} to ${pending}.`,
      });
      toast.push(`Request moved to ${pending}.`, "success");
      setPending(null);
      setReason("");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Unable to update.";
      setError(message);
      toast.push(message, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="smn-ops-actions">
      <button disabled={busy || current === "reviewing"} onClick={() => setPending("reviewing")} type="button">
        Review
      </button>
      <button disabled={busy || current === "introduced"} onClick={() => setPending("introduced")} type="button">
        Introduce
      </button>
      <button disabled={busy || current === "completed"} onClick={() => setPending("completed")} type="button">
        Complete
      </button>
      <button
        disabled={busy || current === "declined"}
        onClick={() => {
          setReason("");
          setPending("declined");
        }}
        type="button"
      >
        Decline
      </button>
      {error ? <span role="alert">{error}</span> : null}
      <ConfirmDialog
        open={Boolean(pending)}
        title={`Move request to ${pending}?`}
        description="This updates the mentorship lifecycle and is visible to staff."
        confirmLabel="Update status"
        destructive={pending === "declined"}
        busy={busy}
        onClose={() => !busy && setPending(null)}
        onConfirm={confirm}
      >
        {pending === "declined" ? (
          <label className="block text-sm text-white/70">
            Decline reason
            <textarea
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
              rows={3}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              minLength={10}
            />
          </label>
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
