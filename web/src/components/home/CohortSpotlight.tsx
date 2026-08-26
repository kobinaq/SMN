"use client";

import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Kicker } from "@/components/site/kit";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { trackEvent } from "@/lib/analytics";

/**
 * The flagship programme, full-bleed. Left-aligned over the photograph rather
 * than centred: the facts below it are a spec sheet, and a spec sheet reads
 * down a left edge.
 */
export function CohortSpotlight() {
  const site = useSiteSettings();

  const facts = [
    ["Starts", site.cohort.startDate],
    ["Duration", site.cohort.duration],
    ["Seats", `${site.cohort.seats}`],
    ["Fee", site.cohort.priceLabel],
  ] as const;

  return (
    <section
      data-section-fade
      className="relative overflow-hidden border-b border-edge-subtle bg-canvas py-20 sm:py-32"
    >
      <div className="absolute inset-0" data-parallax-wrap>
        <Image
          src={img.cohortSpotlight}
          alt="Social Marketers Network cohort members"
          fill
          className="object-cover"
          data-parallax
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/90 to-canvas/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/50" />
      </div>

      <div className="container-wide relative z-10">
        <Kicker>Flagship programme</Kicker>
        <h2 className="mt-6 max-w-[14ch] font-display display-1 text-text-1">{site.cohort.name}</h2>
        <p className="mt-7 max-w-xl text-base leading-relaxed text-text-2 sm:text-lg">
          For {site.cohort.audience}. {site.cohort.format}.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <Button
            href={cta.applyCohort.href}
            onClick={() => trackEvent("primary_cta_click", { location: "cohort_spotlight" })}
          >
            {cta.applyCohort.shortLabel}
          </Button>
          <Button href={cta.viewCohort.href} variant="secondary">
            {cta.viewCohort.label}
          </Button>
        </div>

        <dl className="mt-14 grid max-w-3xl gap-px overflow-hidden border border-edge bg-edge sm:grid-cols-4">
          {facts.map(([label, value]) => (
            <div key={label} className="bg-canvas/85 px-5 py-5 backdrop-blur-sm">
              <dt className="eyebrow text-text-3">{label}</dt>
              <dd className="tnum mt-2 font-display text-lg text-text-1">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-3xl text-xs text-text-3">
          Apply by {site.cohort.applicationDeadline}. {site.cohort.sessions}.
        </p>
      </div>
    </section>
  );
}
