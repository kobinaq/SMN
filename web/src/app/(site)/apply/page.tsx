import type { Metadata } from "next";
import Image from "next/image";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getSiteSettings } from "@/lib/cms";
import { img } from "@/lib/images";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: "Apply for the next cohort",
    description: `Apply to the ${site.cohort.name}. Applications are reviewed before payment.`,
    alternates: { canonical: "/apply" },
  };
}

const steps = [
  {
    n: "01",
    title: "You apply",
    body: "Share your details and goals. No payment is required to submit.",
  },
  {
    n: "02",
    title: "SMN reviews",
    body: "Expect a response within 3–5 business days.",
  },
  {
    n: "03",
    title: "Acceptance",
    body: "Successful applicants receive next steps by email.",
  },
  {
    n: "04",
    title: "Payment",
    body: "Pay the confirmed fee or an approved plan after acceptance.",
  },
  {
    n: "05",
    title: "Access",
    body: "Join the member platform, live sessions, and community.",
  },
];

export default async function ApplyPage() {
  const site = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: `Apply to ${site.cohort.name}`,
          description: site.cohort.format,
        }}
      />

      <section className="relative min-h-[72svh] overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[80svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={img.instructorTeaching}
            alt=""
            fill
            priority
            className="object-cover object-[center_25%]"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/45" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(72svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(80svh-7rem)] sm:pb-20">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.2rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Apply to the {site.cohort.name}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            Next intake {site.cohort.startDate}. Submit first — SMN reviews before any payment.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href="#application">Start application</Button>
            <Button href="/programs/cohort" variant="secondary">
              Review cohort details
            </Button>
          </div>
          <p className="mt-5 text-xs uppercase tracking-[0.14em] text-white/40">
            Deadline · {site.cohort.applicationDeadline} · {site.cohort.duration} · {site.cohort.seats}{" "}
            seats
          </p>
        </div>
      </section>

      <section
        id="application"
        data-section-fade
        className="scroll-mt-24 border-b border-white/10 bg-ink py-16 sm:py-24"
      >
        <div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
              Programme application
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Your application</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
              We only ask for what we need to review your fit. No payment is required to submit this
              form.
            </p>
            <div className="mt-8 rounded-[1.75rem] border border-white/10 bg-surface p-5 sm:rounded-[2rem] sm:p-8 md:p-10">
              <ApplicationForm />
            </div>
          </div>

          <aside className="lg:pt-16">
            <div className="sticky top-28 space-y-8">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">
                  What happens next
                </p>
                <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
                  From apply to access.
                </h2>
              </div>

              <ol className="space-y-0 border-l border-white/10 pl-5">
                {steps.map((step) => (
                  <li key={step.n} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[1.4rem] top-1 h-2 w-2 rounded-full bg-baby-blue" />
                    <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                      {step.n}
                    </p>
                    <p className="mt-1.5 font-display text-lg text-white">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                  </li>
                ))}
              </ol>

              <div className="rounded-2xl border border-white/10 bg-near-black/80 p-5 sm:p-6">
                <p className="text-xs uppercase tracking-[0.16em] text-white/40">Fee</p>
                <p className="mt-2 font-display text-xl text-white">{site.cohort.priceLabel}</p>
                <p className="mt-2 text-xs leading-relaxed text-white/45">{site.cohort.priceNote}</p>
                <p className="mt-5 text-xs leading-relaxed text-white/40">
                  Questions? Email{" "}
                  <a className="text-baby-blue hover:text-white" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>{" "}
                  or reach WhatsApp support from the contact page.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
