import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ApplicationForm } from "@/components/forms/ApplicationForm";
import { getSiteSettings } from "@/lib/cms";
import { JsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: "Apply for the next cohort",
    description: `Apply to the ${site.cohort.name}. Applications are reviewed before payment.`,
    alternates: { canonical: "/apply" },
  };
}

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
      <PageHero
        eyebrow="Programme application"
        title={`Apply to the ${site.cohort.name}`}
        description={`Next intake ${site.cohort.startDate}. Application deadline: ${site.cohort.applicationDeadline}. Submit your application first — SMN reviews within 3–5 business days. Payment or a payment plan is arranged only after acceptance.`}
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-10">
            <h2 className="font-display text-2xl text-white">Application form</h2>
            <p className="mt-2 text-sm text-white/55">
              We only ask for what we need to review your fit for the cohort. No payment is required
              to submit this form.
            </p>
            <div className="mt-6">
              <ApplicationForm />
            </div>
          </div>
          <aside className="rounded-[2rem] border border-white/10 bg-near-black p-6 md:p-8">
            <h2 className="font-display text-xl text-white">What happens next</h2>
            <ol className="mt-5 space-y-4 text-sm leading-relaxed text-white/65">
              <li>
                <strong className="text-white">1. You apply</strong> — we receive your details by
                email.
              </li>
              <li>
                <strong className="text-white">2. SMN reviews</strong> — expect a response within
                3–5 business days.
              </li>
              <li>
                <strong className="text-white">3. Acceptance</strong> — successful applicants receive
                next steps by email.
              </li>
              <li>
                <strong className="text-white">4. Payment</strong> — pay the confirmed fee or choose
                an approved payment plan after acceptance.
              </li>
              <li>
                <strong className="text-white">5. Access</strong> — join the member platform, live
                sessions, and community.
              </li>
            </ol>
            <p className="mt-6 text-xs text-white/40">
              Fee: {site.cohort.priceLabel}. {site.cohort.priceNote}
            </p>
            <p className="mt-4 text-xs text-white/40">
              Questions? Email{" "}
              <a className="text-baby-blue hover:text-white" href={`mailto:${site.email}`}>
                {site.email}
              </a>{" "}
              or use WhatsApp support from the contact page.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
