import type { Metadata } from "next";
import Link from "next/link";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
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
import { getSiteSettings } from "@/lib/cms";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: seoTitle("Social Media Marketing Training"),
    description:
      "Learn social media marketing, strategy and AI through practical training, mentorship and real-world experience at Social Marketers Network.",
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
      <CinematicPageHero
        image={img.cohortPage}
        alt="Social Marketers Network cohort members"
        kicker="Social Media Marketing & AI Training"
        title="Become the marketer businesses need."
        description="A practical social media marketing and AI training programme designed to help aspiring and early-career marketers move from content creation to strategic marketing. Not just the person who manages the page."
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

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
            You do not need another course that teaches you how to make a Reel.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
            You can learn Canva. You can learn ChatGPT. You can learn how to edit a video. You can
            follow social media trends. None of those things automatically make you a marketer.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            A marketer needs to understand audiences, objectives, positioning, campaigns,
            distribution, analytics, communication, and business outcomes. That is what we teach.
          </p>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-16">
          <div>
            <h2 id="curriculum" className="scroll-mt-28 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              What you will learn
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
              Six modules that move you from foundations to applied work. Live sessions, frameworks,
              and practice sit alongside community and mentorship.
            </p>
            <div className="mt-10 space-y-6">
              {trainingModules.map((module) => (
                <article
                  key={module.module}
                  className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8"
                >
                  <p className="text-xs text-baby-blue">Module {module.module}</p>
                  <h3 className="mt-2 font-display text-2xl text-white">{module.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/60">{module.body}</p>
                  {module.topics.length > 3 ? (
                    <ul className="mt-4 space-y-2">
                      {module.topics.map((topic) => (
                        <li key={topic} className="flex gap-3 text-sm text-white/65">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-4 text-xs uppercase tracking-[0.12em] text-white/35">
                      {module.topics.join(" · ")}
                    </p>
                  )}
                </article>
              ))}
            </div>
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

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white sm:text-4xl">What you will leave with</h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60 sm:text-base">
            By the end of the programme, you should be able to think beyond individual posts and
            platforms, and approach marketing problems strategically.
          </p>
          <ul className="mt-10 grid gap-3 sm:grid-cols-2">
            {trainingOutcomes.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/70 sm:text-base">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Learn. Apply. Build.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {trainingLearnApply.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8"
              >
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">Who is this for?</h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              This programme is designed for people moving from content execution toward strategic
              marketing work.
            </p>
            <ul className="mt-6 space-y-3">
              {trainingAudience.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70 sm:text-base">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Your learning should not end when the programme does.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              Completing the programme is only the beginning. Eligible participants can progress
              into the SMN Experience Programme, where they can be considered for practical
              opportunities with brands, agencies, and marketing professionals.
            </p>
            <ul className="mt-6 space-y-3">
              {experienceOpportunities.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-white/45">
              Employment is not guaranteed. Experience placements depend on fit, readiness, and
              partner availability.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.viewExperience.href}>{cta.viewExperience.label}</Button>
              <Button href="/community" variant="secondary">
                {cta.joinCommunity.label}
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/45">
              Prefer to learn on your own schedule?{" "}
              <Link href="/programs/courses" className="text-baby-blue transition hover:text-white">
                Explore courses
              </Link>
              . Practice scenarios sit on the{" "}
              <Link href="/simulations" className="text-baby-blue transition hover:text-white">
                simulation waitlist
              </Link>
              . Guidance lives in{" "}
              <Link href="/mentorship" className="text-baby-blue transition hover:text-white">
                mentorship
              </Link>
              .
            </p>
          </div>
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
