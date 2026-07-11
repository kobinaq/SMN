"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

/** Full-bleed cohort band: group photo + flat matte + CTAs. */
export function CohortSpotlight() {
  return (
    <section data-section-fade className="relative min-h-[70svh] overflow-hidden py-16 sm:min-h-[85svh] sm:py-28 md:py-36">
      <div className="absolute inset-0" data-parallax-wrap>
        <Image
          src={img.cohortSpotlight}
          alt="Social Marketers Network cohort members"
          fill
          className="object-cover"
          data-parallax
          sizes="100vw"
          priority={false}
        />
        <div className="image-matte-strong" />
      </div>

      <div className="container-wide relative z-10 flex min-h-[50svh] flex-col items-center justify-center px-1 text-center sm:min-h-[55svh]">
        <Reveal>
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-baby-blue sm:text-xs">
            Flagship program
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl font-display text-2xl leading-tight text-white sm:mt-5 sm:text-5xl md:text-6xl">
            The next cohort is starting{" "}
            <span className="text-baby-blue">{site.cohort.startDate}</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:mt-6 sm:text-base md:text-lg">
            Live Social Media Marketing & AI classes, practical assignments, portfolio projects,
            WhatsApp community, and chances to work on real client problems.
          </p>
          <div className="btn-row-mobile mt-8 sm:mt-10">
            <Button href="/apply" className="sm:min-w-[160px]">
              Enroll Now
            </Button>
            <Button href="/programs/cohort" variant="secondary">
              View curriculum
            </Button>
          </div>
          <ul className="mt-8 flex flex-col flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60 sm:mt-10 sm:flex-row sm:text-sm">
            <li>{site.cohort.duration}</li>
            <li className="hidden sm:inline">·</li>
            <li className="max-w-[16rem] text-center sm:max-w-none">{site.cohort.sessions}</li>
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
