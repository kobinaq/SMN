"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Eligible = { id: string | number; label: string; detail: string };

async function operate(body: unknown) {
  const response = await fetch("/api/admin/certificate-operations", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Certificate operation failed.");
  return result;
}

export function CertificateIssuer({ eligible }: { eligible: Eligible[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  async function issue() {
    if (!selected.length || !window.confirm(`Issue ${selected.length} certificate(s)?`)) return;
    setBusy(true); setMessage("");
    try { const result = await operate({ action: "issue", enrollmentIds: selected }); setSelected([]); setMessage(`${result.issued} certificate(s) issued.`); router.refresh(); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Issuance failed."); }
    finally { setBusy(false); }
  }
  return <div><div className="smn-certificate-list">{eligible.map(item => <label className="smn-ops-row" key={item.id}><input checked={selected.includes(item.id)} disabled={busy} onChange={event => setSelected(current => event.target.checked ? [...current, item.id] : current.filter(id => id !== item.id))} type="checkbox"/><span><b>{item.label}</b><small>{item.detail}</small></span></label>)}</div><div className="smn-ops-actions"><button disabled={busy || !selected.length} onClick={issue} type="button">Issue selected</button>{message ? <span aria-live="polite">{message}</span> : null}</div></div>;
}

export function CertificateLifecycle({ certificateId }: { certificateId: string | number }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  async function run(action: "revoke" | "reissue") { const reason = window.prompt(`Reason to ${action} this certificate (minimum 8 characters):`); if (!reason || !window.confirm(`${action === "revoke" ? "Revoke" : "Reissue"} this certificate?`)) return; setBusy(true); setError(""); try { await operate({ action, certificateId, reason }); router.refresh(); } catch (caught) { setError(caught instanceof Error ? caught.message : "Operation failed."); } finally { setBusy(false); } }
  return <div className="smn-ops-actions"><button disabled={busy} onClick={() => run("reissue")} type="button">Reissue</button><button disabled={busy} onClick={() => run("revoke")} type="button">Revoke</button>{error ? <span role="alert">{error}</span> : null}</div>;
}
