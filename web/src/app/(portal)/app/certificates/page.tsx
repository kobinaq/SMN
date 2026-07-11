import Link from "next/link";
import { Award, Download, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getMemberCertificates } from "@/lib/certificates";

export const metadata = { title: "Certificates" };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export default async function CertificatesPage() {
  const member = await requireMember("/app/certificates");
  const certificates = await getMemberCertificates(member);

  return (
    <div className="space-y-7">
      <div>
        <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
          Certificates
        </p>
        <h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">
          Your SMN credentials
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
          Issued certificates from cohorts, workshops, and approved learning tracks.
        </p>
      </div>

      {certificates.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {certificates.map((certificate) => (
            <article
              key={certificate.id}
              className="rounded-2xl border border-white/10 bg-surface p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                  <Award className="h-5 w-5" />
                </div>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] uppercase tracking-wide text-mint">
                  {certificate.status}
                </span>
              </div>
              <p className="mt-5 text-xs text-white/40">{certificate.programName}</p>
              <h2 className="mt-1 font-display text-xl text-white">{certificate.title}</h2>
              {certificate.summary ? (
                <p className="mt-3 text-sm leading-relaxed text-white/50">{certificate.summary}</p>
              ) : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
                  Issued {formatDate(certificate.issuedAt)}
                </span>
                {certificate.expiresAt ? (
                  <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/45">
                    Expires {formatDate(certificate.expiresAt)}
                  </span>
                ) : null}
              </div>
              {certificate.skills.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55">
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="btn-row-mobile mt-6">
                <Button href={certificate.verifyUrl} variant="secondary" className="px-4 py-2 text-xs">
                  Verify
                  <ShieldCheck className="h-3.5 w-3.5" />
                </Button>
                {certificate.pdfUrl ? (
                  <Button
                    href={certificate.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 text-xs"
                  >
                    PDF
                    <Download className="h-3.5 w-3.5" />
                  </Button>
                ) : null}
              </div>
            </article>
          ))}
        </section>
      ) : (
        <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-6 sm:p-8">
          <p className="font-display text-lg text-white">No certificates yet</p>
          <p className="mt-2 max-w-xl text-sm text-white/50">
            Staff-issued credentials will appear here after a completed cohort, workshop, or
            approved learning track.
          </p>
          <div className="btn-row-mobile mt-6">
            <Button href="/app/learning">Open learning</Button>
            <Button href="/programs/cohort" variant="secondary">
              View cohort
              <ExternalLink className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      )}

      <p className="text-sm text-white/40">
        Share the verification link with employers or add it to your{" "}
        <Link href="/app/portfolio" className="text-baby-blue hover:text-white">
          portfolio
        </Link>
        .
      </p>
    </div>
  );
}
