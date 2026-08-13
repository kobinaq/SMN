import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { audienceStages, seoTitle, thinkPillars } from "@/lib/brand";
import { ecosystem, instructor } from "@/lib/content";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Academy"),
  description:
    "Social Marketers Network is a professional home for marketers. Learn strategy, social media and AI, gain experience, and grow with a community in Ghana and across Africa.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <CinematicPageHero
        image={img.aboutMission}
        alt="Instructor presenting to marketers in the room"
        kicker="About Social Marketers Network"
        title="Building the community modern marketers need."
        description="Social Marketers Network is a professional learning network helping aspiring, early-career, and marketing professionals build the skills, experience, and relationships they need to thrive in a rapidly changing industry."
        actions={
          <>
            <Button href={cta.explorePrograms.href}>{cta.explorePrograms.label}</Button>
            <Button href={cta.joinCommunity.href} variant="secondary">
              {cta.joinCommunity.label}
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Marketing is changing. How we learn it should too.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
              Social media has evolved from simply posting content into an important part of how
              businesses build brands, communities, and revenue. At the same time, AI is changing
              how marketers research, create, analyse, and work.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
              Learning marketing is still often fragmented. People learn a tool here, a platform
              there, and a collection of content tricks without understanding how everything
              connects. We want to change that.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[5/4]">
              <Image
                src={img.instructorTeaching}
                alt="Arielle Adodo teaching a marketing session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="image-matte" />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-3xl font-display text-3xl text-white sm:text-4xl md:text-5xl">
            We do not just teach marketers what to do. We teach them how to think.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {thinkPillars.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
            More than an academy.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
            Courses can teach you a skill. A network can change the trajectory of your career. SMN
            brings together learning, community, mentorship, practical experience, and industry
            connections in one ecosystem.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
            You can join us to learn something new, find a mentor, meet other marketers, work on a
            simulation, attend an event, access an opportunity, or simply stay connected to an
            industry that never stops changing.
          </p>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-2xl font-display text-3xl text-white sm:text-4xl">
            Built for marketers at different stages of the journey.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {audienceStages.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8">
                <h3 className="font-display text-xl text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display text-3xl text-white sm:text-4xl">Learn. Practice. Connect. Grow.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ecosystem.map((item) => (
              <div key={item.title} className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8">
                <h3 className="font-display text-2xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.08em] text-baby-blue">Meet the lead instructor</p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
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
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-20">
        <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-10 md:p-14">
          <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
            This is only the beginning.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/70 sm:text-base">
            We are building toward a future where marketers can learn, gain experience, find
            mentors, discover opportunities, and build meaningful careers within one connected
            ecosystem.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href={cta.joinCommunity.href} variant="light">
              {cta.joinCommunity.label}
            </Button>
            <Button href={cta.applyCohort.href} variant="secondary">
              {cta.applyCohort.shortLabel}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
