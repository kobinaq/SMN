"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Band, Kicker, SectionHead } from "@/components/site/kit";
import { useSiteSettings } from "@/components/layout/SiteSettingsProvider";
import { ArrowUpRight } from "@/components/ui/icons";
import { img } from "@/lib/images";
import { cta } from "@/lib/cta";
import { homepageProgrammes } from "@/lib/content";
import { trackEvent } from "@/lib/analytics";

/**
 * Tab 4 Academy preview: three programmes + self-paced courses, with cohort
 * facts from site settings / CMS. Duration is 4 weeks (PR #54 / Tab 4).
 */
export function AcademyPreview() {
  const site = useSiteSettings();

  const facts = [
    // TODO(T5-placeholder): start date unconfirmed; site.cohort.startDate holds neutral copy.
    ["Starts", site.cohort.startDate],
    ["Duration", site.cohort.duration],
    ["Seats", `${site.cohort.seats}`],
    // TODO(T5-placeholder): fees unconfirmed.
    ["Fee", site.cohort.priceLabel],
  ] as const;

  return (
    <Band tone="raised" size="lg" fade id="academy-preview">
      <SectionHead
        kicker="Academy"
        title="Learn skills you can actually use."
        lede="Our programmes connect strategy, content, platforms, AI and practical application so you can move from knowing the theory to knowing how to use it."
        actions={
          <Button href={cta.explorePrograms.href} variant="secondary">
            Explore the Academy
          </Button>
        }
      />

      <div data-stagger className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle lg:grid-cols-2">
        {homepageProgrammes.map((programme) => (
          <Link
            key={programme.title}
            href={programme.href}
            data-stagger-item
            className="group flex min-h-11 flex-col bg-canvas p-7 transition-colors hover:bg-raised sm:p-9"
          >
            <p className="eyebrow text-accent">{programme.meta}</p>
            <h3 className="mt-3 font-display text-2xl text-text-1 transition-colors group-hover:text-accent">
              {programme.title}
            </h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">
              {programme.body}
            </p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
              {programme.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="relative mt-16 overflow-hidden border border-edge-subtle">
        <div className="absolute inset-0" data-parallax-wrap>
          <Image
            src={img.cohortSpotlight}
            alt="Think Social Academy cohort members"
            fill
            className="object-cover"
            data-parallax
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-canvas via-canvas/92 to-canvas/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-canvas via-transparent to-canvas/40" />
        </div>

        <div className="relative z-10 p-7 sm:p-10 lg:p-12">
          <Kicker>Flagship programme</Kicker>
          <h3 className="mt-5 max-w-[18ch] font-display display-3 text-text-1">{site.cohort.name}</h3>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-text-2">
            For {site.cohort.audience}. {site.cohort.format}.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              href={cta.applyCohort.href}
              onClick={() => trackEvent("primary_cta_click", { location: "academy_preview" })}
            >
              {cta.applyCohort.shortLabel}
            </Button>
            <Button href={cta.viewCohort.href} variant="secondary">
              {cta.viewCohort.label}
            </Button>
          </div>

          <dl className="mt-10 grid max-w-3xl gap-px overflow-hidden border border-edge bg-edge sm:grid-cols-4">
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
      </div>
    </Band>
  );
}
