import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
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
    <div className="bg-canvas pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
      <div className="container-wide py-12 sm:py-16 md:py-20">
        <Link href="/" className="text-sm text-text-3 transition hover:text-text-1">
          Social Marketers Network
        </Link>

        {certificate ? (
          <article className="relative mx-auto mt-8 max-w-2xl overflow-hidden border border-edge-subtle bg-raised">
            <div className="absolute inset-x-0 top-0 h-1 bg-ai" />
            <div className="px-6 py-10 sm:px-12 sm:py-14">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="font-display text-sm tracking-[0.08em] text-accent">
                  SMN credential
                </p>
                <span className="rounded-full border border-mint/30 bg-ai/10 px-3 py-1 eyebrow text-ai">
                  Verified
                </span>
              </div>

              <p className="mt-10 text-xs uppercase tracking-[0.18em] text-text-3">
                Issued to
              </p>
              <h1 className="mt-3 font-display text-4xl leading-[1.05] text-text-1 sm:text-5xl md:text-6xl">
                {certificate.memberName}
              </h1>
              <p className="mt-6 text-sm text-text-3">for completing</p>
              <p className="mt-2 font-display display-3 text-text-1">{certificate.title}</p>
              <p className="mt-2 text-sm text-text-3">{certificate.programName}</p>

              {certificate.summary ? (
                <p className="mt-6 max-w-xl text-sm leading-relaxed text-text-2">
                  {certificate.summary}
                </p>
              ) : null}

              <dl className="mt-10 grid gap-6 border-t border-edge-subtle pt-8 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-text-3">
                    Credential code
                  </dt>
                  <dd className="mt-2 font-mono text-sm text-text-1">{certificate.credentialCode}</dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-[0.16em] text-text-3">Issued</dt>
                  <dd className="mt-2 text-sm text-text-1">{formatDate(certificate.issuedAt)}</dd>
                </div>
                {certificate.expiresAt ? (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-text-3">Expires</dt>
                    <dd className="mt-2 text-sm text-text-1">{formatDate(certificate.expiresAt)}</dd>
                  </div>
                ) : null}
                {certificate.memberHandle ? (
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.16em] text-text-3">
                      Member profile
                    </dt>
                    <dd className="mt-2 text-sm">
                      <Link
                        href={`/u/${certificate.memberHandle}`}
                        className="text-accent transition hover:text-text-1"
                      >
                        @{certificate.memberHandle}
                      </Link>
                    </dd>
                  </div>
                ) : null}
              </dl>

              {certificate.skills.length ? (
                <div className="mt-8 flex flex-wrap gap-2">
                  {certificate.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-edge-subtle px-3 py-1 text-xs text-text-3"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="btn-row-mobile mt-10">
                {certificate.pdfUrl ? (
                  <Button href={certificate.pdfUrl} target="_blank" rel="noreferrer">
                    View PDF
                  </Button>
                ) : null}
                <Button href="/programs" variant="secondary">
                  Explore the Academy
                </Button>
              </div>
            </div>
          </article>
        ) : (
          <section className="mx-auto mt-8 max-w-2xl border border-dashed border-edge bg-raised p-8 sm:p-12">
            <p className="font-display text-sm tracking-[0.08em] text-accent">
              SMN credential
            </p>
            <h1 className="mt-4 font-display display-3 text-text-1">
              Certificate not verified
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-text-2">
              This code is not public, is not valid, or has been revoked. Check the link and try
              again, or contact SMN if you believe this credential should verify.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.contact.href}>{cta.contact.label}</Button>
              <Button href="/" variant="secondary">
                Back home
              </Button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
