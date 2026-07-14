"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";

type Eligible = { id: string | number; label: string; detail: string };

async function operate(body: unknown) {
  const response = await fetch("/api/admin/certificate-operations", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Certificate operation failed.");
  return result;
}

export function CertificateIssuer({ eligible }: { eligible: Eligible[] }) {
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);

  async function issue() {
    if (!selected.length) return;
    setBusy(true);
    setMessage("");
    try {
      const result = await operate({ action: "issue", enrollmentIds: selected });
      setSelected([]);
      const text = `${result.issued} certificate(s) issued.`;
      setMessage(text);
      toast.push(text, "success");
      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      const text = error instanceof Error ? error.message : "Issuance failed.";
      setMessage(text);
      toast.push(text, "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="smn-certificate-list">
        {eligible.map((item) => (
          <label className="smn-ops-row" key={item.id}>
            <input
              checked={selected.includes(item.id)}
              disabled={busy}
              onChange={(event) =>
                setSelected((current) =>
                  event.target.checked ? [...current, item.id] : current.filter((id) => id !== item.id),
                )
              }
              type="checkbox"
            />
            <span>
              <b>{item.label}</b>
              <small>{item.detail}</small>
            </span>
          </label>
        ))}
      </div>
      <div className="smn-ops-actions">
        <button disabled={busy || !selected.length} onClick={() => setConfirmOpen(true)} type="button">
          Issue selected
        </button>
        {message ? <span aria-live="polite">{message}</span> : null}
      </div>
      <ConfirmDialog
        open={confirmOpen}
        title={`Issue ${selected.length} certificate(s)?`}
        description="Eligible learners will receive credentials. Partial failures are reported after the run."
        confirmLabel="Issue certificates"
        busy={busy}
        onClose={() => !busy && setConfirmOpen(false)}
        onConfirm={issue}
      />
    </div>
  );
}

export function CertificateLifecycle({ certificateId }: { certificateId: string | number }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [action, setAction] = useState<"revoke" | "reissue" | null>(null);
  const [reason, setReason] = useState("");

  async function confirm() {
    if (!action) return;
    if (reason.trim().length < 8) {
      setError("Provide a reason of at least 8 characters.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await operate({ action, certificateId, reason: reason.trim() });
      toast.push(action === "revoke" ? "Certificate revoked." : "Certificate reissued.", "success");
      setAction(null);
      setReason("");
      router.refresh();
    } catch (caught) {
      const message = caught instanceof Error ? caught.message : "Operation failed.";
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
          setReason("");
          setAction("reissue");
        }}
        type="button"
      >
        Reissue
      </button>
      <button
        disabled={busy}
        onClick={() => {
          setReason("");
          setAction("revoke");
        }}
        type="button"
      >
        Revoke
      </button>
      {error ? <span role="alert">{error}</span> : null}
      <ConfirmDialog
        open={Boolean(action)}
        title={action === "revoke" ? "Revoke certificate?" : "Reissue certificate?"}
        description="This action is audited. Provide a clear reason for the record."
        confirmLabel={action === "revoke" ? "Revoke" : "Reissue"}
        destructive={action === "revoke"}
        busy={busy}
        onClose={() => !busy && setAction(null)}
        onConfirm={confirm}
      >
        <label className="block text-sm text-white/70">
          Reason
          <textarea
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
            rows={3}
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            minLength={8}
          />
        </label>
      </ConfirmDialog>
    </div>
  );
}
