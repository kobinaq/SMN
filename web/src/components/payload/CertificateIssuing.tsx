import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { CertificateIssuer, CertificateLifecycle } from "./CertificateActions";

const rel = (value: unknown) => value && typeof value === "object" && "id" in value ? value as { id: string | number; name?: string; email?: string } : null;

export default async function CertificateIssuing({ initPageResult, payload }: AdminViewServerProps) {
  const access = { overrideAccess: false, req: initPageResult.req } as const;
  const [enrollments, certificates] = await Promise.all([
    payload.find({ collection: "enrollments", depth: 1, limit: 500, sort: "-completedAt", where: { and: [{ status: { equals: "completed" } }, { certificateEligible: { equals: true } }] }, ...access }),
    payload.find({ collection: "certificates", depth: 1, limit: 500, sort: "-issuedAt", ...access }),
  ]);
  const active = new Set(certificates.docs.filter(item => item.status === "valid").map(item => item.activeIssuanceKey).filter(Boolean));
  const eligible = enrollments.docs.filter(item => !active.has(`${rel(item.member)?.id ?? item.member}:${item.programKey}`)).map(item => ({ id: item.id, label: `${rel(item.member)?.name || "Member"} — ${item.programName}`, detail: `${rel(item.member)?.email || "No email"} · completed ${item.completedAt ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(item.completedAt)) : "date unavailable"}` }));
  const valid = certificates.docs.filter(item => item.status === "valid");
  return <main className="smn-workspace"><header className="smn-workspace-header"><div><span className="smn-eyebrow">Credentials</span><h1>Certificate Issuing</h1><p>Confirm eligibility, issue in bulk, prevent duplicates, and manage the credential lifecycle.</p></div><Link className="smn-primary-action" href="/admin/collections/certificates">All certificates</Link></header><section className="smn-analytics-grid"><div><strong>{eligible.length}</strong><span>Eligible</span></div><div><strong>{valid.length}</strong><span>Valid certificates</span></div><div><strong>{certificates.docs.filter(item => item.status === "revoked").length}</strong><span>Revoked</span></div></section><section className="smn-ops-grid"><article><h2>1. Select eligible completions</h2>{eligible.length ? <CertificateIssuer eligible={eligible}/> : <p className="smn-empty">No eligible completions without a certificate.</p>}</article><article><h2>2. Review active credentials</h2>{valid.map(item => <div className="smn-ops-row" key={item.id}><div><Link href={`/admin/collections/certificates/${item.id}`}><b>{item.title}</b></Link><span>{rel(item.member)?.name || "Member"} · {item.credentialCode} · notification {item.notificationStatus || "pending"}</span></div><CertificateLifecycle certificateId={item.id}/></div>)}</article></section></main>;
}
