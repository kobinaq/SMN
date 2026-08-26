"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { Textarea } from "@/components/ui/Field";
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

function ReasonField({
  label,
  value,
  minChars,
  onChange,
}: {
  label: string;
  value: string;
  minChars: number;
  onChange: (value: string) => void;
}) {
  const remaining = Math.max(0, minChars - value.trim().length);
  return (
    <label className="block text-sm text-text-2">
      {label}
      <Textarea
        className="mt-2"
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        minLength={minChars}
        required
      />
      <span className="mt-1 block text-xs text-text-3">
        {remaining
          ? `${remaining} more character${remaining === 1 ? "" : "s"} needed`
          : "Ready to send"}
      </span>
    </label>
  );
}

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
      setError("Write at least 10 characters so the applicant knows why.");
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
      <button
        disabled={busy}
        onClick={() => {
          setError("");
          setPending({ kind: "mentor", decision: "approved" });
        }}
        type="button"
      >
        Approve
      </button>
      <button
        disabled={busy}
        onClick={() => {
          setError("");
          setReason("");
          setPending({ kind: "mentor", decision: "rejected" });
        }}
        type="button"
      >
        Reject
      </button>
      <ConfirmDialog
        open={Boolean(pending && pending.kind === "mentor")}
        title={pending?.kind === "mentor" && pending.decision === "approved" ? "Approve mentor?" : "Reject mentor application?"}
        description={
          pending?.kind === "mentor" && pending.decision === "approved"
            ? "The applicant will be marked as an approved mentor."
            : "This note is emailed to the applicant. Be specific about what to improve."
        }
        confirmLabel={pending?.kind === "mentor" && pending.decision === "approved" ? "Approve" : "Reject"}
        destructive={pending?.kind === "mentor" && pending.decision === "rejected"}
        busy={busy}
        error={error}
        onClose={() => {
          if (busy) return;
          setPending(null);
          setError("");
        }}
        onConfirm={confirm}
      >
        {pending?.kind === "mentor" && pending.decision === "rejected" ? (
          <ReasonField
            label="Rejection reason"
            value={reason}
            minChars={10}
            onChange={(value) => {
              setReason(value);
              if (error) setError("");
            }}
          />
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
      setError("Write at least 10 characters explaining the decline.");
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
      <button disabled={busy || current === "reviewing"} onClick={() => { setError(""); setPending("reviewing"); }} type="button">
        Review
      </button>
      <button disabled={busy || current === "introduced"} onClick={() => { setError(""); setPending("introduced"); }} type="button">
        Introduce
      </button>
      <button disabled={busy || current === "completed"} onClick={() => { setError(""); setPending("completed"); }} type="button">
        Complete
      </button>
      <button
        disabled={busy || current === "declined"}
        onClick={() => {
          setError("");
          setReason("");
          setPending("declined");
        }}
        type="button"
      >
        Decline
      </button>
      <ConfirmDialog
        open={Boolean(pending)}
        title={`Move request to ${pending}?`}
        description="This updates the mentorship lifecycle and is visible to staff."
        confirmLabel="Update status"
        destructive={pending === "declined"}
        busy={busy}
        error={error}
        onClose={() => {
          if (busy) return;
          setPending(null);
          setError("");
        }}
        onConfirm={confirm}
      >
        {pending === "declined" ? (
          <ReasonField
            label="Decline reason"
            value={reason}
            minChars={10}
            onChange={(value) => {
              setReason(value);
              if (error) setError("");
            }}
          />
        ) : null}
      </ConfirmDialog>
    </div>
  );
}
