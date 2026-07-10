import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { beliefs } from "@/lib/content";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `Mission, vision, and story of ${site.name}.`,
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title="A place where marketers don’t have to figure everything out alone."
        description="Social Marketers Network is an academy and community for beginners, social media managers, and marketing professionals who want to keep getting better."
      />

      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2 lg:items-center">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem]">
              <Image
                src="/images/presentation.jpg"
                alt="Lead instructor presenting"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="text-xs uppercase tracking-[0.22em] text-baby-blue">Mission</p>
            <h2 className="mt-4 font-display text-3xl text-white md:text-4xl">
              Train marketers who can think and deliver.
            </h2>
            <p className="mt-5 text-white/65 leading-relaxed">
              We help people build skill, get practice, find community, and gain confidence in social
              media marketing, then keep growing after any single program ends.
            </p>
            <p className="mt-4 text-white/65 leading-relaxed">
              Our aim is simple: be Africa’s go-to network for modern marketers, where people learn,
              get experience, grow their careers, and meet opportunity.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-surface py-20">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white md:text-4xl">Core beliefs</h2>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {beliefs.map((b, i) => (
              <div
                key={b.title}
                className="rounded-3xl border border-white/10 bg-surface-2 p-6 md:p-8"
              >
                <span className="font-display text-sm text-baby-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-display text-xl text-white">{b.title}</h3>
                <p className="mt-3 text-white/70 leading-relaxed">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-near-black py-20">
        <div className="container-wide max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-baby-blue">Lead instructor</p>
          <h2 className="mt-4 font-display text-3xl text-white">Meet the founder</h2>
          <p className="mt-5 text-white/65 leading-relaxed">
            Too many courses stop at tools and templates. SMN was built for the strategy, practice,
            and community marketers actually need. Programs cover marketing strategy, social media,
            AI, hands-on work, mentorship, and real client experience.
          </p>
          <p className="mt-4 text-sm text-white/40">
            Full instructor biography, brand list, and milestones can be updated once the client
            provides them.
          </p>
        </div>
      </section>
    </>
  );
}
