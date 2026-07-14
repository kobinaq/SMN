"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { trackEvent } from "@/lib/analytics";

/** Full-bleed cohort band: group photo + flat matte + CTAs. */
export function CohortSpotlight() {
  const site = useSiteSettings();

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
            Flagship programme
          </p>
          <h2 className="mx-auto mt-4 max-w-4xl font-display text-2xl leading-tight text-white sm:mt-5 sm:text-5xl md:text-6xl">
            {site.cohort.name}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-baby-blue sm:text-base">
            Starts {site.cohort.startDate} · Apply by {site.cohort.applicationDeadline}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-white/75 sm:mt-6 sm:text-base md:text-lg">
            For {site.cohort.audience}. {site.cohort.format}.
          </p>
          <div className="btn-row-mobile mt-8 sm:mt-10">
            <Button
              href={cta.applyCohort.href}
              className="sm:min-w-[160px]"
              onClick={() => trackEvent("primary_cta_click", { location: "cohort_spotlight" })}
            >
              {cta.applyCohort.shortLabel}
            </Button>
            <Button href={cta.viewCohort.href} variant="secondary">
              {cta.viewCohort.label}
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
