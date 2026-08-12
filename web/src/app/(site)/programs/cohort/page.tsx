import type { Metadata } from "next";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
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
    description: `${site.cohort.name}. ${site.cohort.duration}. ${site.cohort.priceLabel}.`,
    alternates: { canonical: "/programs/cohort" },
  };
}

const featuredWeeks = [
  {
    week: "01",
    title: "Marketing Foundations & Positioning",
    body: "Lock who you serve, what you offer, and why anyone should care before you make content.",
    topics: ["Market insight", "Positioning", "Offer clarity"],
  },
  {
    week: "04",
    title: "AI for Marketing Work",
    body: "Build weekly AI workflows for research, drafts, and reviews without handing over the thinking.",
    topics: ["Prompt systems", "Ops automation", "Quality control"],
  },
  {
    week: "08",
    title: "Client Experience Sprint",
    body: "Run a live-style project, take feedback, and present work the way a hiring manager would hear it.",
    topics: ["Live project", "Feedback", "Presentation day"],
  },
];

export default async function CohortPage() {
  const site = await getSiteSettings();
  const featuredIds = new Set(featuredWeeks.map((week) => week.week));
  const restWeeks = curriculum.filter((week) => !featuredIds.has(week.week));

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
      <CinematicPageHero
        image={img.cohortPage}
        alt="Social Marketers Network cohort members"
        kicker="Flagship cohort"
        title={site.cohort.name}
        description={`${site.cohort.audience}. Live classes, practical projects, mentorship, community, and portfolio-ready outcomes.`}
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href="/contact" variant="secondary">
              Ask about fees
            </Button>
          </>
        }
        meta={
          <>
            {site.cohort.duration} · {site.cohort.startDate} · {site.cohort.seats} seats ·{" "}
            {site.cohort.priceLabel}
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              What you leave with
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              A campaign you can talk through, a case study written as a marketer (problem, plan,
              result), and a clearer way to use AI without losing judgment. The certificate is
              available on successful completion.
            </p>

            <h3 className="mt-12 font-display text-2xl text-white sm:text-3xl">
              Three weeks that define the path
            </h3>
            <div className="mt-8 space-y-6">
              {featuredWeeks.map((week) => (
                <article
                  key={week.week}
                  className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8"
                >
                  <p className="text-xs text-baby-blue">Week {week.week}</p>
                  <h4 className="mt-2 font-display text-2xl text-white">{week.title}</h4>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{week.body}</p>
                  <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                    {week.topics.join(" · ")}
                  </p>
                </article>
              ))}
            </div>

            <h3 className="mt-12 font-display text-2xl text-white">The rest of the eight weeks</h3>
            <ul className="mt-6 divide-y divide-white/10 border-y border-white/10">
              {restWeeks.map((week) => (
                <li
                  key={week.week}
                  className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                >
                  <p className="font-display text-lg text-white">
                    <span className="mr-3 text-sm text-white/35">Week {week.week}</span>
                    {week.title}
                  </p>
                  <p className="text-sm text-white/45">{week.topics.join(" · ")}</p>
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:pt-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8 lg:sticky lg:top-28">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/40">
                Next intake
              </p>
              <p className="mt-3 font-display text-3xl text-white">{site.cohort.startDate}</p>
              <dl className="mt-6 space-y-3 text-sm text-white/65">
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Duration</dt>
                  <dd>{site.cohort.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Sessions</dt>
                  <dd className="text-right">{site.cohort.sessions}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Deadline</dt>
                  <dd className="text-right">{site.cohort.applicationDeadline}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-white/40">Seats</dt>
                  <dd>{site.cohort.seats}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-white/10 pt-3">
                  <dt className="text-white/40">Fee</dt>
                  <dd className="text-right text-baby-blue">{site.cohort.priceLabel}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-white/40">{site.cohort.priceNote}</p>
              <div className="mt-6 flex flex-col gap-3">
                <Button href={cta.applyCohort.href} className="w-full">
                  {cta.applyCohort.shortLabel}
                </Button>
                <Button href="/contact" variant="secondary" className="w-full">
                  Ask about fees
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Questions people ask first</h2>
          <div className="mt-10 space-y-0">
            {cohortFaqs.map((faq) => (
              <article key={faq.q} className="border-b border-white/10 py-6 first:pt-0">
                <h3 className="font-display text-xl text-white">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/65">{faq.a}</p>
              </article>
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
        </div>
      </section>
    </>
  );
}
