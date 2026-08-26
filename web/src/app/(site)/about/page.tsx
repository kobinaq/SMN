import type { Metadata } from "next";
import Image from "next/image";
import { Masthead } from "@/components/site/kit";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { audienceStages, seoTitle, thinkPillars } from "@/lib/brand";
import { ecosystem, founderBeliefs, founderStory, founderValues, instructor } from "@/lib/content";
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
      <Masthead
        image={img.aboutMission}
        alt="Instructor presenting to marketers in the room"
        kicker="About Social Marketers Network"
        title="Building the community modern marketers need."
        lede="Social Marketers Network is a professional learning network helping aspiring, early-career, and marketing professionals build the skills, experience, and relationships they need to thrive in a rapidly changing industry."
        actions={
          <>
            <Button href={cta.explorePrograms.href}>{cta.explorePrograms.label}</Button>
            <Button href={cta.joinCommunity.href} variant="secondary">
              {cta.joinCommunity.label}
            </Button>
          </>
        }
      />

      <section className="border-b border-edge-subtle bg-canvas py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display display-3 text-text-1">Our mission</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
              Empower aspiring marketers, professionals, and entrepreneurs with the skills,
              practical experience, community, and industry connections they need to build
              successful careers, grow businesses, and make meaningful impact through modern
              marketing.
            </p>
          </div>
          <div>
            <h2 className="font-display display-3 text-text-1">Our vision</h2>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
              To build Africa&apos;s leading marketing ecosystem where learning, community, and
              industry come together to develop exceptional marketing talent and create
              opportunities for growth.
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <h2 className="font-display display-2 text-text-1">
              Marketing is changing. How we learn it should too.
            </h2>
            <p className="mt-5 text-sm leading-relaxed text-text-2 sm:text-base">
              Social media has evolved from simply posting content into an important part of how
              businesses build brands, communities, and revenue. At the same time, AI is changing
              how marketers research, create, analyse, and work.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
              Learning marketing is still often fragmented. People learn a tool here, a platform
              there, and a collection of content tricks without understanding how everything
              connects. We want to change that.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <div className="relative aspect-[4/5] overflow-hidden lg:aspect-[5/4]">
              <Image
                src={img.instructorTeaching}
                alt="Arielle Adodo teaching a marketing session"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-canvas py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-3xl font-display display-2 text-text-1">
            We do not just teach marketers what to do. We teach them how to think.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {thinkPillars.map((item) => (
              <article
                key={item.title}
                className=" border border-edge-subtle bg-raised p-6 sm:p-8"
              >
                <h3 className="font-display text-2xl text-text-1">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display display-2 text-text-1">
            More than an academy.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-text-2 sm:text-base">
            Courses can teach you a skill. A network can change the trajectory of your career. SMN
            brings together learning, community, mentorship, practical experience, and industry
            connections in one ecosystem.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
            You can join us to learn something new, find a mentor, meet other marketers, work on a
            simulation, attend an event, access an opportunity, or simply stay connected to an
            industry that never stops changing.
          </p>
        </div>
      </section>

      <section className="bg-canvas py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-2xl font-display display-3 text-text-1">
            Built for marketers at different stages of the journey.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {audienceStages.map((item) => (
              <div key={item.title} className=" border border-edge-subtle bg-raised p-6 sm:p-8">
                <h3 className="font-display text-xl text-text-1 sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="font-display display-3 text-text-1">Learn. Practice. Connect. Grow.</h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {ecosystem.map((item) => (
              <div key={item.title} className=" border border-edge-subtle bg-raised p-6 sm:p-8">
                <h3 className="font-display text-2xl text-text-1">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge-subtle bg-canvas py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={instructor.image}
              alt={instructor.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <p className="font-display text-sm tracking-[0.08em] text-accent">Meet the founder</p>
            <h2 className="mt-3 font-display display-2 text-text-1">
              {instructor.name}
            </h2>
            <p className="mt-2 text-sm text-text-3">{instructor.title}</p>
            <div className="mt-5 space-y-4 text-sm leading-relaxed text-text-2 sm:text-base">
              {founderStory.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-text-1/85" : undefined}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="btn-row-mobile mt-8">
              <Button href={instructor.linkedin} target="_blank" rel="noreferrer">
                View LinkedIn
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-edge-subtle bg-raised py-16 sm:py-24">
        <div className="container-wide">
          <p className="font-display text-sm tracking-[0.08em] text-accent">What I believe</p>
          <h2 className="mt-3 max-w-3xl font-display display-3 text-text-1">
            The principles behind how we teach.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2">
            {founderBeliefs.map((item) => (
              <article key={item.title} className=" border border-edge-subtle bg-raised p-6 sm:p-8">
                <h3 className="font-display text-xl text-text-1 sm:text-2xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-base">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge-subtle bg-canvas py-16 sm:py-24">
        <div className="container-wide">
          <p className="font-display text-sm tracking-[0.08em] text-accent">Our values</p>
          <h2 className="mt-3 max-w-3xl font-display display-3 text-text-1">
            The principles we build the Network on.
          </h2>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {founderValues.map((item) => (
              <div key={item.title} className=" border border-edge-subtle bg-raised p-6 sm:p-8">
                <h3 className="font-display text-lg text-text-1 sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-edge-subtle bg-raised py-16 sm:py-20">
        <div className="container-wide overflow-hidden border border-edge-subtle bg-accent-strong p-6 sm:p-10 md:p-14">
          <h2 className="font-display display-3 text-text-1">
            This is only the beginning.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
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
