import Link from "next/link";
import { Award, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { EmptyState, StatusBadge } from "@/components/ui/Feedback";
import { requireMember } from "@/lib/auth/member";
import { getMemberCertificates } from "@/lib/certificates";

export const metadata = { title: "Certificates" };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "valid") return "success" as const;
  if (status === "revoked") return "danger" as const;
  return "neutral" as const;
}

export default async function CertificatesPage() {
  const member = await requireMember("/app/certificates");
  const certificates = await getMemberCertificates(member);

  return (
    <div className="space-y-7 print:space-y-4">
      <div className="print:hidden">
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Certificates</p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Your SMN credentials</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          Issued certificates from cohorts, workshops, and approved learning tracks.
        </p>
      </div>

      {certificates.length ? (
        <section className="grid gap-4 lg:grid-cols-2 print:grid-cols-1">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="rounded-2xl border border-white/10 bg-surface p-5 print:break-inside-avoid print:border-black/20 print:bg-white print:text-black"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/10 text-mint print:bg-transparent print:text-black">
                  <Award className="h-5 w-5" />
                </div>
                <StatusBadge label={certificate.status} tone={statusTone(certificate.status)} />
              </div>
              <p className="mt-5 text-xs text-white/40 print:text-black/60">{certificate.programName}</p>
              <h2 className="mt-1 font-display text-xl text-white print:text-black">{certificate.title}</h2>
              {certificate.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-white/50 print:text-black/70">{certificate.summary}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45 print:border-black/20 print:text-black/70">
                  Issued {formatDate(certificate.issuedAt)}
                </span>
                {certificate.expiresAt ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45 print:border-black/20 print:text-black/70">
                    Expires {formatDate(certificate.expiresAt)}
                  </span>
                ) : null}
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45 print:border-black/20 print:text-black/70">
                  ID · {certificate.credentialCode}
                </span>
              </div>
              {certificate.status === "revoked" ? (
                <p className="mt-4 rounded-xl border border-red-300/30 bg-red-400/10 px-3 py-2 text-xs text-red-100 print:text-red-700" role="status">
                  This credential has been revoked and will not verify as valid.
                </p>
              ) : null}
              {certificate.skills.length ? (
                <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                  {certificate.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="btn-row-mobile mt-6 print:hidden">
                <Button href={certificate.verifyUrl} variant="secondary" className="px-4 py-2 text-xs">
                  Verify
                  <ShieldCheck className="h-3.5 w-3.5" />
                </Button>
                <CopyLinkButton url={certificate.verifyUrl} label="Copy verification link" />
                {certificate.pdfUrl ? (
                  <Button href={certificate.pdfUrl} target="_blank" rel="noreferrer" className="px-4 py-2 text-xs">
                    PDF
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <EmptyState
          title="No certificates yet"
          description="Staff-issued credentials will appear here after a completed cohort, workshop, or approved learning track."
          action={
            <>
              <Button href="/app/learning">Open learning</Button>
              <Button href="/programs/cohort" variant="secondary">
                View cohort
                <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </>
          }
        />
      )}

      <p className="text-sm text-white/40 print:hidden">
        Share the verification link with employers or add it to your{" "}
        <Link href="/app/portfolio" className="text-baby-blue hover:text-white">
          portfolio
        </Link>
        . Use your browser print dialog for a print-friendly view.
      </p>
    </div>
  );
}
