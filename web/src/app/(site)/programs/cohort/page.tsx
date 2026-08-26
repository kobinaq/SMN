import type { Metadata } from "next";
import Link from "next/link";
import { Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/seo/JsonLd";
import {
  experienceOpportunities,
  seoTitle,
  trainingAudience,
  trainingLearnApply,
  trainingModules,
  trainingOutcomes,
} from "@/lib/brand";
import { cohortFaqs } from "@/lib/content";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { getPublicCohorts, getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: seoTitle("Social Media Marketing Training"),
    description:
      "Learn social media marketing, strategy and AI through practical training, mentorship and real-world experience at Social Marketers Network.",
    alternates: { canonical: "/programs/cohort" },
  };
}

export default async function CohortPage() {
  const [site, cohorts] = await Promise.all([getSiteSettings(), getPublicCohorts()]);
  const openCohorts = cohorts.filter((cohort) => cohort.enrollmentOpen);

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
      <Masthead
        image={img.cohortPage}
        alt="Social Marketers Network cohort members"
        kicker="Social Media Marketing & AI Training"
        title="Become the marketer businesses need."
        lede="A practical social media marketing and AI training programme designed to help aspiring and early-career marketers move from content creation to strategic marketing. Not just the person who manages the page."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
            <Button href={cta.viewCurriculum.href} variant="secondary">
              {cta.viewCurriculum.label}
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

      <section className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display display-2 text-text-1">
            You do not need another course that teaches you how to make a Reel.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-text-2 sm:text-base">
            You can learn Canva. You can learn ChatGPT. You can learn how to edit a video. You can
            follow social media trends. None of those things automatically make you a marketer.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
            A marketer needs to understand audiences, objectives, positioning, campaigns,
            distribution, analytics, communication, and business outcomes. That is what we teach.
          </p>
        </div>
      </section>

      <section className="border-b border-edge-subtle bg-canvas py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <h2 id="curriculum" className="scroll-mt-28 font-display display-2 text-text-1">
              What you will learn
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
              Six modules that move you from foundations to applied work. Live sessions, frameworks,
              and practice sit alongside community and mentorship.
            </p>
            <div className="mt-10 space-y-6">
              {trainingModules.map((module) => (
                <article
                  key={module.module}
                  className=" border border-edge-subtle bg-raised p-6 sm:p-8"
                >
                  <p className="text-xs text-accent">Module {module.module}</p>
                  <h3 className="mt-2 font-display text-2xl text-text-1">{module.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">{module.body}</p>
                  {module.topics.length > 3 ? (
                    <ul className="mt-4 space-y-2">
                      {module.topics.map((topic) => (
                        <li key={topic} className="flex gap-3 text-sm text-text-2">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs uppercase tracking-[0.12em] text-text-3">
                      {module.topics.join(" · ")}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </div>

          <aside className="lg:pt-2">
            <div className=" border border-edge-subtle bg-raised p-6 sm:p-8 lg:sticky lg:top-28">
              <p className="eyebrow text-text-3">
                Next intake
              </p>
              <p className="mt-3 font-display text-3xl text-text-1">{site.cohort.startDate}</p>
              <dl className="mt-6 space-y-3 text-sm text-text-2">
                <div className="flex justify-between gap-4">
                  <dt className="text-text-3">Duration</dt>
                  <dd>{site.cohort.duration}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-3">Sessions</dt>
                  <dd className="text-right">{site.cohort.sessions}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-3">Deadline</dt>
                  <dd className="text-right">{site.cohort.applicationDeadline}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-text-3">Seats</dt>
                  <dd>{site.cohort.seats}</dd>
                </div>
                <div className="flex justify-between gap-4 border-t border-edge-subtle pt-3">
                  <dt className="text-text-3">Fee</dt>
                  <dd className="text-right text-accent">{site.cohort.priceLabel}</dd>
                </div>
              </dl>
              <p className="mt-4 text-xs leading-relaxed text-text-3">{site.cohort.priceNote}</p>
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

      <section className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display display-3 text-text-1">What you will leave with</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
            By the end of the programme, you should be able to think beyond individual posts and
            platforms, and approach marketing problems strategically.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {trainingOutcomes.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-2 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-edge-subtle bg-canvas py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display display-3 text-text-1">Learn. Apply. Build.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainingLearnApply.map((item) => (
              <article
                key={item.title}
                className=" border border-edge-subtle bg-raised p-6 sm:p-8"
              >
                <h3 className="font-display text-xl text-text-1">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display display-3 text-text-1">Who is this for?</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
              This programme is designed for people moving from content execution toward strategic
              marketing work.
            </p>
            <ul className="mt-6 space-y-3">
              {trainingAudience.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-2 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display display-3 text-text-1">
              Your learning should not end when the programme does.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
              Completing the programme is only the beginning. Eligible participants can progress
              into the SMN Experience Programme, where they can be considered for practical
              opportunities with brands, agencies, and marketing professionals.
            </p>
            <ul className="mt-6 space-y-3">
              {experienceOpportunities.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-text-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-text-3">
              Employment is not guaranteed. Experience placements depend on fit, readiness, and
              partner availability.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.viewExperience.href}>{cta.viewExperience.label}</Button>
              <Button href="/community" variant="secondary">
                {cta.joinCommunity.label}
              </Button>
            </div>
            <p className="mt-6 text-sm text-text-3">
              Prefer to learn on your own schedule?{" "}
              <Link href="/programs/courses" className="text-accent transition hover:text-text-1">
                Explore courses
              </Link>
              . Practice scenarios sit on the{" "}
              <Link href="/experience#simulations" className="text-accent transition hover:text-text-1">
                simulation waitlist
              </Link>
              . Guidance lives in{" "}
              <Link href="/mentorship" className="text-accent transition hover:text-text-1">
                mentorship
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {openCohorts.length ? (
        <section className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
          <div className="container-wide">
            <p className="eyebrow text-accent">Intakes</p>
            <h2 className="mt-3 font-display display-3 text-text-1">Open cohorts</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-2">
              Apply to the intake that matches your dates. Payment comes after acceptance.
            </p>
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {openCohorts.map((cohort) => (
                <article
                  key={String(cohort.id)}
                  className=" border border-edge-subtle bg-raised p-6 sm:p-8"
                >
                  <p className="eyebrow text-ai">
                    {cohort.startDate}
                  </p>
                  <h3 className="mt-3 font-display text-2xl text-text-1">{cohort.name}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">{cohort.format}</p>
                  <p className="mt-4 text-sm text-text-3">
                    {cohort.duration} · {cohort.seats} seats · Apply by {cohort.applicationDeadline}
                  </p>
                  <p className="mt-2 text-sm text-accent">{cohort.priceLabel}</p>
                  <div className="mt-6">
                    <Button href="/apply">Apply</Button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-canvas py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display display-3 text-text-1">Questions people ask first</h2>
          <div className="mt-10 space-y-0">
            {cohortFaqs.map((faq) => (
              <article key={faq.q} className="border-b border-edge-subtle py-6 first:pt-0">
                <h3 className="font-display text-xl text-text-1">{faq.q}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2">{faq.a}</p>
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
