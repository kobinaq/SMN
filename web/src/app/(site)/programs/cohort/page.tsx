import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import { cohortFaqs, curriculum } from "@/lib/content";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteSettings();
  return {
    title: "Flagship cohort",
    description: `${site.cohort.name} — ${site.cohort.duration}. ${site.cohort.priceLabel}.`,
    alternates: { canonical: "/programs/cohort" },
  };
}

export default async function CohortPage() {
  const site = await getSiteSettings();

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Course",
          name: site.cohort.name,
          description: site.cohort.format,
          provider: {
            "@type": "EducationalOrganization",
            name: site.name,
            url: site.url,
          },
          offers: {
            "@type": "Offer",
            category: "Application required",
            priceCurrency: "GHS",
            availability: "https://schema.org/LimitedAvailability",
            url: `${site.url}/apply`,
          },
        }}
      />
      <PageHero
        eyebrow="Flagship cohort programme"
        title={site.cohort.name}
        description={`${site.cohort.audience}. Live classes, practical projects, mentorship, community, member-platform learning, and portfolio-ready outcomes.`}
      />

      <section className="border-t border-white/10 bg-ink py-16">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem]">
            <Image
              src={img.cohortPage}
              alt="Social Marketers Network cohort members"
              fill
              className="object-cover"
              sizes="60vw"
              priority
            />
            <div className="image-matte" />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-surface p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Next intake</p>
            <p className="mt-3 font-display text-3xl text-white">{site.cohort.startDate}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>· Intended audience: {site.cohort.audience}</li>
              <li>· Duration: {site.cohort.duration}</li>
              <li>· Delivery: {site.cohort.format}</li>
              <li>· Sessions: {site.cohort.sessions}</li>
              <li>· Application deadline: {site.cohort.applicationDeadline}</li>
              <li>· Seats: {site.cohort.seats}</li>
              <li>· Fee: {site.cohort.priceLabel}</li>
              <li>· Certificate: Available on successful completion</li>
            </ul>
            <p className="mt-4 text-xs text-white/40">{site.cohort.priceNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
              <Button href="/contact" variant="secondary">
                Ask about fees
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white md:text-4xl">Learning outcomes</h2>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Build marketing strategy, research, brand, social systems, campaign execution,
            analytics, AI-assisted workflows, portfolio case studies, and career readiness.
          </p>
          <h3 className="mt-12 font-display text-2xl text-white">Curriculum overview</h3>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {curriculum.map((week) => (
              <div key={week.week} className="rounded-3xl border border-white/10 bg-surface p-6">
                <p className="text-xs text-baby-blue">Week {week.week}</p>
                <h3 className="mt-2 font-display text-xl text-white">{week.title}</h3>
                <p className="mt-3 text-sm text-white/55">{week.topics.join(" · ")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white">Frequently asked questions</h2>
          <div className="mt-8 space-y-4">
            {cohortFaqs.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-3xl border border-white/10 bg-surface-2 p-5 open:bg-ink"
              >
                <summary className="cursor-pointer list-none font-medium text-white">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{faq.a}</p>
              </details>
            ))}
          </div>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: cohortFaqs.map((faq) => ({
                "@type": "Question",
                name: faq.q,
                acceptedAnswer: { "@type": "Answer", text: faq.a },
              })),
            }}
          />
          <div className="mt-10">
            <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
          </div>
        </div>
      </section>
    </>
  );
}
