import Link from "next/link";
import { Award, Download, ExternalLink, ShieldCheck } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { CopyLinkButton } from "@/components/ui/CopyLinkButton";
import { EmptyState } from "@/components/ui/Feedback";
import { Chip } from "@/components/ui/Chip";
import { PageHeader } from "@/components/ui/Surface";
import { requireMember } from "@/lib/auth/member";
import { getMemberCertificates } from "@/lib/certificates";

export const metadata = { title: "Certificates" };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

function statusTone(status: string) {
  if (status === "valid") return "ai" as const;
  if (status === "revoked") return "danger" as const;
  return "neutral" as const;
}

export default async function CertificatesPage() {
  const member = await requireMember("/app/certificates");
  const certificates = await getMemberCertificates(member);

  return (
    <div className="space-y-7 print:space-y-4">
      <div className="print:hidden">
        <PageHeader
          eyebrow="Certificates"
          title="Your SMN credentials"
          description="Issued certificates from cohorts, workshops, and approved learning tracks."
        />
      </div>

      {certificates.length ? (
        <section className="rise-stagger grid gap-4 lg:grid-cols-2 print:grid-cols-1">
          {certificates.map((certificate, index) => (
            <article
              key={certificate.id}
              style={{ "--i": index } as React.CSSProperties}
              className="rise rounded-[var(--radius-lg)] border border-edge-subtle bg-raised p-5 shadow-[var(--shadow-1)] print:break-inside-avoid print:border-black/20 print:bg-white print:text-black"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-lg)] bg-ai-bg text-ai print:bg-transparent print:text-black">
                  <Award className="h-5 w-5" />
                </div>
                <span className="print:hidden">
                  <Chip tone={statusTone(certificate.status)}>{certificate.status}</Chip>
                </span>
              </div>
              <p className="mt-5 text-xs text-text-3 print:text-black/60">{certificate.programName}</p>
              <h2 className="mt-1 font-display text-xl text-text-1 print:text-black">{certificate.title}</h2>
              {certificate.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-text-2 print:text-black/70">{certificate.summary}</p>
              ) : null}
              <div className="tnum mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-edge-subtle px-3 py-1 text-xs text-text-3 print:border-black/20 print:text-black/70">
                  Issued {formatDate(certificate.issuedAt)}
                </span>
                {certificate.expiresAt ? (
                  <span className="rounded-full border border-edge-subtle px-3 py-1 text-xs text-text-3 print:border-black/20 print:text-black/70">
                    Expires {formatDate(certificate.expiresAt)}
                  </span>
                ) : null}
                <span className="rounded-full border border-edge-subtle px-3 py-1 text-xs text-text-3 print:border-black/20 print:text-black/70">
                  ID · {certificate.credentialCode}
                </span>
              </div>
              {certificate.status === "revoked" ? (
                <p className="mt-4 rounded-[var(--radius-md)] border border-danger/30 bg-danger-bg px-3 py-2 text-xs text-danger print:text-red-700" role="status">
                  This credential has been revoked and will not verify as valid.
                </p>
              ) : null}
              {certificate.skills.length ? (
                <div className="mt-4 flex flex-wrap gap-2 print:hidden">
                  {certificate.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-inset px-3 py-1 text-xs text-text-2">
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

      <p className="text-sm text-text-3 print:hidden">
        Share the verification link with employers or add it to your{" "}
        <Link href="/app/portfolio" className="text-accent hover:text-text-1">
          portfolio
        </Link>
        . Use your browser print dialog for a print-friendly view.
      </p>
    </div>
  );
}
