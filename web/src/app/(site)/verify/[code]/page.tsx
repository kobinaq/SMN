import Link from "next/link";
import { Award, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getVerifiedCertificate } from "@/lib/certificates";

export const metadata = { title: "Verify certificate" };

function formatDate(value: string) {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", { month: "long", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
}

export default async function VerifyCertificatePage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params;
  const certificate = await getVerifiedCertificate(decodeURIComponent(code));

  return (
    <main className="min-h-screen bg-near-black px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-white/45 transition hover:text-white">
          Social Marketers Network
        </Link>

        {certificate ? (
          <section className="mt-8 rounded-2xl border border-white/10 bg-surface p-6 shadow-[0_24px_80px_rgba(0,0,0,.28)] sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-mint/10 text-mint">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-mint/25 bg-mint/10 px-3 py-1.5 text-xs uppercase tracking-wide text-mint">
                Verified
              </span>
            </div>

            <p className="mt-8 text-xs uppercase tracking-[0.22em] text-baby-blue">
              SMN certificate
            </p>
            <h1 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              {certificate.title}
            </h1>
            <p className="mt-3 text-lg text-white/70">Issued to {certificate.memberName}</p>
            <p className="mt-1 text-sm text-white/45">{certificate.programName}</p>

            {certificate.summary ? (
              <p className="mt-6 text-sm leading-relaxed text-white/55">{certificate.summary}</p>
            ) : null}

            <dl className="mt-8 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-ink p-4">
                <dt className="text-xs text-white/35">Credential code</dt>
                <dd className="mt-1 font-mono text-sm text-white">{certificate.credentialCode}</dd>
              </div>
              <div className="rounded-xl border border-white/10 bg-ink p-4">
                <dt className="text-xs text-white/35">Issued</dt>
                <dd className="mt-1 text-sm text-white">{formatDate(certificate.issuedAt)}</dd>
              </div>
              {certificate.expiresAt ? (
                <div className="rounded-xl border border-white/10 bg-ink p-4">
                  <dt className="text-xs text-white/35">Expires</dt>
                  <dd className="mt-1 text-sm text-white">{formatDate(certificate.expiresAt)}</dd>
                </div>
              ) : null}
              {certificate.memberHandle ? (
                <div className="rounded-xl border border-white/10 bg-ink p-4">
                  <dt className="text-xs text-white/35">Member profile</dt>
                  <dd className="mt-1 text-sm text-white">
                    <Link href={`/u/${certificate.memberHandle}`} className="text-baby-blue hover:text-white">
                      @{certificate.memberHandle}
                    </Link>
                  </dd>
                </div>
              ) : null}
            </dl>

            {certificate.skills.length ? (
              <div className="mt-6 flex flex-wrap gap-2">
                {certificate.skills.map((skill) => (
                  <span key={skill} className="rounded-full bg-white/5 px-3 py-1 text-xs text-white/55">
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="btn-row-mobile mt-8">
              {certificate.pdfUrl ? (
                <Button href={certificate.pdfUrl} target="_blank" rel="noreferrer">
                  View PDF
                  <ExternalLink className="h-4 w-4" />
                </Button>
              ) : null}
              <Button href="/programs" variant="secondary">
                Explore SMN
              </Button>
            </div>
          </section>
        ) : (
          <section className="mt-8 rounded-2xl border border-white/10 bg-surface p-6 sm:p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-white/45">
              <Award className="h-7 w-7" />
            </div>
            <h1 className="mt-8 font-display text-3xl text-white">Certificate not verified</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              This code is not public, is not valid, or has been revoked. Check the link and try
              again, or contact SMN if you believe this credential should verify.
            </p>
            <div className="btn-row-mobile mt-7">
              <Button href="/contact">Contact SMN</Button>
              <Button href="/" variant="secondary">
                Back home
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
