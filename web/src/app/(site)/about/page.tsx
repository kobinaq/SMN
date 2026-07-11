import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/layout/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { beliefs, instructor } from "@/lib/content";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";

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
                src={img.aboutMission}
                alt="Lead instructor presenting"
                fill
                className="object-cover"
                sizes="50vw"
              />
              <div className="image-matte" />
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

      <section className="bg-near-black py-16 sm:py-20">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Lead instructor
            </p>
            <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
              {instructor.name}
            </h2>
            <p className="mt-2 text-sm text-white/45">{instructor.role}</p>
            <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              {instructor.bio}
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
              {instructor.philosophy}
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              {instructor.highlights.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="btn-row-mobile mt-8">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer">
                View LinkedIn
              </Button>
              <Button href="/apply" variant="secondary">
                Apply to the cohort
              </Button>
            </div>
            {instructor.note ? (
              <p className="mt-5 text-xs text-white/35">{instructor.note}</p>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
