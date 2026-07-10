import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { cohortFaqs, curriculum } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Flagship Cohort",
  description: site.cohort.name,
};

export default function CohortPage() {
  return (
    <>
      <PageHero
        eyebrow="Flagship cohort"
        title={site.cohort.name}
        description="Live classes, practical assignments, AI workflows, portfolio projects, mentorship, community, and chances to work on real client problems."
      />

      <section className="border-t border-white/10 bg-ink py-16">
        <div className="container-wide grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="relative min-h-[320px] overflow-hidden rounded-[2rem]">
            <Image
              src="/images/cohort-group.jpg"
              alt="Social Marketers Network cohort members"
              fill
              className="object-cover"
              sizes="60vw"
              priority
            />
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-surface p-8">
            <p className="text-xs uppercase tracking-[0.2em] text-white/40">Next intake</p>
            <p className="mt-3 font-display text-3xl text-white">{site.cohort.startDate}</p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>· Duration: {site.cohort.duration}</li>
              <li>· {site.cohort.sessions}</li>
              <li>· Community: Discord</li>
              <li>· Seats: {site.cohort.seats}</li>
              <li>· {site.cohort.priceLabel}</li>
            </ul>
            <p className="mt-4 text-xs text-white/40">{site.cohort.priceNote}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="/apply">Apply Now</Button>
              <Button href={site.discordInvite} target="_blank" rel="noreferrer" variant="secondary">
                Preview Discord
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white md:text-4xl">Curriculum</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
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
          <h2 className="font-display text-3xl text-white">FAQs</h2>
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
          <div className="mt-10">
            <Button href="/apply">Start your application</Button>
          </div>
        </div>
      </section>
    </>
  );
}
