"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/site";

/** GrowthX-style cohort band: large group photo + headline + CTA. */
export function CohortSpotlight() {
  return (
    <section data-section-fade className="relative min-h-[85svh] overflow-hidden py-28 md:py-36">
      <div className="absolute inset-0" data-parallax-wrap>
        <Image
          src="/images/cohort-group.jpg"
          alt="Social Marketers Network cohort members"
          fill
          className="object-cover"
          data-parallax
          sizes="100vw"
          priority={false}
        />
        <div className="absolute inset-0 bg-black/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-deep-blue/30 via-transparent to-deep-blue/20" />
      </div>

      <div className="container-wide relative z-10 flex min-h-[55svh] flex-col items-center justify-center text-center">
        <Reveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-baby-blue">
            Flagship program
          </p>
          <h2 className="mx-auto mt-5 max-w-4xl font-display text-3xl leading-tight text-white sm:text-5xl md:text-6xl">
            The next cohort is starting{" "}
            <span className="text-baby-blue">{site.cohort.startDate}</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base text-white/75 md:text-lg">
            Live Social Media Marketing & AI classes, practical assignments, portfolio projects,
            Discord community, and chances to work on real client problems.
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href="/apply" className="min-w-[160px] px-8 py-3.5">
              Enroll Now
            </Button>
            <Button href="/programs/cohort" variant="secondary">
              View curriculum
            </Button>
          </div>
          <ul className="mt-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-white/60">
            <li>{site.cohort.duration}</li>
            <li className="hidden sm:inline">·</li>
            <li>{site.cohort.sessions}</li>
            <li className="hidden sm:inline">·</li>
            <li>{site.cohort.seats} seats</li>
            <li className="hidden sm:inline">·</li>
            <li>{site.cohort.priceLabel}</li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
