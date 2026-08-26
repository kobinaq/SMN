import type { Metadata } from "next";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { getApplyCourses, getSiteSettings } from "@/lib/cms";
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
    body: "Expect a response within 3 to 5 business days.",
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
  const [site, applyCourses] = await Promise.all([getSiteSettings(), getApplyCourses()]);

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

      <Masthead
        image={img.instructorTeaching}
        alt="Lead instructor teaching a marketing session"
        kicker="Social Marketers Network"
        title={`Apply to the ${site.cohort.name}`}
        lede={`Next intake ${site.cohort.startDate}. Submit first. SMN reviews before any payment.`}
        actions={
          <>
            <Button href="#application">Start application</Button>
            <Button href="/programs/cohort" variant="secondary">
              Review cohort details
            </Button>
          </>
        }
        meta={
          <>
            Deadline · {site.cohort.applicationDeadline} · {site.cohort.duration} · {site.cohort.seats}{" "}
            seats
          </>
        }
      />

      <section
        id="application"
        data-section-fade
        className="scroll-mt-24 border-b border-edge-subtle bg-raised py-16 sm:py-24"
      >
        <div className="container-wide grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12 xl:gap-16">
          <div>
            <h2 className="font-display display-3 text-text-1">Your application</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
              We only ask for what we need to review your fit. No payment is required to submit this
              form.
            </p>
            <div className="mt-8 border border-edge-subtle bg-raised p-5 sm:p-8 md:p-10">
              <ApplicationForm
                cohorts={applyCourses.map((course) => ({ id: course.id, name: course.name }))}
              />
            </div>
          </div>

          <aside className="lg:pt-16">
            <div className="sticky top-28 space-y-8">
              <div>
                <p className="eyebrow text-ai">
                  What happens next
                </p>
                <h2 className="mt-3 font-display display-3 text-text-1">
                  From apply to access.
                </h2>
              </div>

              <ol className="space-y-0 border-l border-edge-subtle pl-5">
                {steps.map((step) => (
                  <li key={step.n} className="relative pb-7 last:pb-0">
                    <span className="absolute -left-[1.4rem] top-1 h-2 w-2 rounded-full bg-accent" />
                    <p className="eyebrow text-text-3">
                      {step.n}
                    </p>
                    <p className="mt-1.5 font-display text-lg text-text-1">{step.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-text-2">{step.body}</p>
                  </li>
                ))}
              </ol>

              <div className=" border border-edge-subtle bg-canvas/80 p-5 sm:p-6">
                <p className="eyebrow text-text-3">Fee</p>
                <p className="mt-2 font-display text-xl text-text-1">{site.cohort.priceLabel}</p>
                <p className="mt-2 text-xs leading-relaxed text-text-3">{site.cohort.priceNote}</p>
                <p className="mt-5 text-xs leading-relaxed text-text-3">
                  Questions? Email{" "}
                  <a className="text-accent hover:text-text-1" href={`mailto:${site.email}`}>
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
