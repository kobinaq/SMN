"use client";

import { useMemo, useState } from "react";
import { CertificateLifecycle } from "@/components/payload/CertificateActions";
import { StaffEmptyState, StaffOpsRow, StaffPanel, StaffSection } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { useRouter } from "next/navigation";

export type CertEligible = {
  id: string | number;
  name: string;
  program: string;
  email?: string;
  completedAt?: string | null;
};

export type CertIssued = {
  id: string | number;
  title: string;
  memberName: string;
  credentialCode: string;
  notificationStatus?: string | null;
};

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

export function CertificateWizard({
  eligible,
  issued,
}: {
  eligible: CertEligible[];
  issued: CertIssued[];
}) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selected, setSelected] = useState<Array<string | number>>([]);
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showManage, setShowManage] = useState(false);

  const selectedItems = useMemo(
    () => eligible.filter((item) => selected.includes(item.id)),
    [eligible, selected],
  );

  async function issue() {
    if (!selected.length) return;
    setBusy(true);
    try {
      const result = await operate({ action: "issue", enrollmentIds: selected });
      toast.push(`${result.issued} certificate(s) issued.`, "success");
      setSelected([]);
      setStep(1);
      setConfirmOpen(false);
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Issuance failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string | number) {
    setSelected((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-2">
        {[
          { n: 1 as const, label: "Select" },
          { n: 2 as const, label: "Preview" },
          { n: 3 as const, label: "Confirm" },
        ].map((item, index) => (
          <div key={item.n} className="flex items-center gap-2">
            {index > 0 ? <span className="text-white/20">→</span> : null}
            <span
              className={
                step === item.n
                  ? "rounded-full border border-baby-blue/45 bg-baby-blue/15 px-3 py-1 text-xs text-baby-blue"
                  : "rounded-full border border-white/10 px-3 py-1 text-xs text-white/40"
              }
            >
              {item.n}. {item.label}
            </span>
          </div>
        ))}
      </div>

      {step === 1 ? (
        <StaffPanel>
          <StaffSection title="Who’s ready" aside={`${eligible.length} eligible`} />
          {eligible.length ? (
            <div className="space-y-2">
              {eligible.map((item) => {
                const checked = selected.includes(item.id);
                return (
                  <label
                    key={item.id}
                    className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/10 px-3 py-3 transition hover:bg-white/[.03]"
                  >
                    <input
                      type="checkbox"
                      className="mt-1"
                      checked={checked}
                      onChange={() => toggle(item.id)}
                    />
                    <span className="min-w-0">
                      <b className="block text-sm text-white">{item.name}</b>
                      <span className="mt-1 block text-xs text-white/45">{item.program}</span>
                      <span className="mt-2 inline-flex rounded-full border border-mint/30 bg-mint/10 px-2 py-0.5 text-[10px] text-mint">
                        Completed program
                      </span>
                    </span>
                  </label>
                );
              })}
              <div className="pt-3">
                <Button type="button" disabled={!selected.length} onClick={() => setStep(2)}>
                  Preview {selected.length || ""}
                </Button>
              </div>
            </div>
          ) : (
            <StaffEmptyState
              title="No certificates due"
              description="Eligible completions will appear here."
              action={{ href: "/staff", label: "Back to Today" }}
            />
          )}
        </StaffPanel>
      ) : null}

      {step === 2 ? (
        <StaffPanel>
          <StaffSection title="Preview" aside={`${selectedItems.length} selected`} />
          <div className="grid gap-4 sm:grid-cols-2">
            {selectedItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-near-black via-surface to-near-black p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
              >
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-baby-blue">Certificate</p>
                <h3 className="mt-3 font-display text-2xl text-white">{item.name}</h3>
                <p className="mt-2 text-sm text-white/55">{item.program}</p>
                <p className="mt-6 text-xs text-white/35">
                  {item.completedAt
                    ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(item.completedAt))
                    : "Completion date pending"}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button type="button" onClick={() => setStep(3)}>
              Continue
            </Button>
          </div>
        </StaffPanel>
      ) : null}

      {step === 3 ? (
        <StaffPanel>
          <StaffSection title="Confirm issuance" />
          <p className="text-sm text-white/55">
            Issue <b className="text-white">{selectedItems.length}</b> certificate{selectedItems.length === 1 ? "" : "s"} now.
          </p>
          <ul className="mt-4 space-y-2">
            {selectedItems.map((item) => (
              <li key={item.id} className="text-sm text-white/70">
                {item.name} · {item.program}
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button type="button" variant="secondary" onClick={() => setStep(2)}>
              Back
            </Button>
            <Button type="button" disabled={busy} onClick={() => setConfirmOpen(true)}>
              Issue certificates
            </Button>
          </div>
          <ConfirmDialog
            open={confirmOpen}
            title={`Issue ${selectedItems.length} certificate(s)?`}
            description="Learners will receive credentials. Partial failures are reported after the run."
            confirmLabel="Issue"
            busy={busy}
            onClose={() => !busy && setConfirmOpen(false)}
            onConfirm={issue}
          />
        </StaffPanel>
      ) : null}

      <div>
        <button
          type="button"
          className="text-xs text-white/45 hover:text-white/70"
          onClick={() => setShowManage((value) => !value)}
        >
          {showManage ? "Hide issued" : "Manage issued"}
        </button>
        {showManage ? (
          <StaffPanel className="mt-3">
            <StaffSection title="Active credentials" />
            {issued.length ? (
              issued.map((item) => (
                <StaffOpsRow
                  key={item.id}
                  title={item.title}
                  detail={`${item.memberName} · ${item.credentialCode} · ${item.notificationStatus || "pending"}`}
                >
                  <CertificateLifecycle certificateId={item.id} />
                </StaffOpsRow>
              ))
            ) : (
              <p className="text-sm text-white/45">No valid certificates yet.</p>
            )}
          </StaffPanel>
        ) : null}
      </div>
    </div>
  );
}

