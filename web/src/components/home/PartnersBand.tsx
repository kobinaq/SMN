import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Band, Kicker, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import { cta } from "@/lib/cta";
import { homepagePartners } from "@/lib/content";

/** Tab 4 Partner preview: Sponsorship, Events, Simulations + Agency. No hire CTAs. */
export function PartnersBand() {
  return (
    <Band tone="blue" size="lg" fade>
      <SectionHead
        kicker="Partner With Us"
        title={homepagePartners.title}
        lede={homepagePartners.body}
        actions={
          <Button href={cta.partner.href} variant="light">
            {cta.partner.label}
          </Button>
        }
      />

      <div data-stagger className="mt-12 grid gap-px overflow-hidden border border-edge bg-edge md:grid-cols-3">
        {homepagePartners.areas.map((area) => (
          <Link
            key={area.title}
            href={area.href}
            data-stagger-item
            className="group flex min-h-11 flex-col bg-canvas/20 p-7 transition-colors hover:bg-canvas/35 sm:p-8"
          >
            <h3 className="font-display text-2xl text-text-1">{area.title}</h3>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2 sm:text-base">{area.body}</p>
            <span className="mt-6 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent">
              {area.ctaLabel}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </Link>
        ))}
      </div>

      <div className="mt-14 grid gap-6 border-t border-edge pt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <Kicker>Agency arm</Kicker>
          <h3 className="mt-4 font-display display-3 text-text-1">{homepagePartners.agency.title}</h3>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-2">
            {homepagePartners.agency.body}
          </p>
        </div>
        <Button href={homepagePartners.agency.href} variant="secondary">
          {homepagePartners.agency.ctaLabel}
        </Button>
      </div>

      <p className="mt-14 max-w-3xl font-display display-3 text-text-1">{homepagePartners.close}</p>
    </Band>
  );
}
