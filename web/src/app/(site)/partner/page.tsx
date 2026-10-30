import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Band, Checklist, CtaBand, DefinitionGrid, Kicker, Masthead, SectionHead } from "@/components/site/kit";
import { ArrowUpRight } from "@/components/ui/icons";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";
import { agency, partnerAreas, partnerClose, partnerHero, partnerTeamTraining } from "@/lib/pages/partner";

export const metadata: Metadata = {
  title: seoTitle("Partner With Us"),
  description:
    "Partner with Think Social Academy through sponsorship, events and simulations, or work with Think Social Agency on social media, storytelling and content.",
  alternates: { canonical: "/partner" },
  openGraph: { url: "/partner" },
};

/**
 * Tab 4 "04 Partner With Us" + Think Social Agency (ticket T8).
 * Old ?request= links (job, intern, talent, training) still land here; the
 * page no longer embeds a request form, every CTA goes to /contact?type=...
 */
export default function PartnerPage() {
  return (
    <>
      <Masthead
        image={img.hireConversation}
        alt="Two marketers in conversation"
        kicker={partnerHero.kicker}
        title={partnerHero.title}
        lede={partnerHero.lede}
        actions={
          <>
            <Button href="#sponsorship">Explore partnership areas</Button>
            <Button href="#agency" variant="secondary">
              Think Social Agency
            </Button>
          </>
        }
      />

      {partnerAreas.map((area, index) => (
        <Band
          key={area.id}
          id={area.id}
          tone={index % 2 === 0 ? "canvas" : "raised"}
          className="scroll-mt-24"
        >
          <div className="grid gap-10 lg:grid-cols-[6rem_minmax(0,1fr)_minmax(0,24rem)] lg:gap-12">
            <span aria-hidden className="ordinal text-accent/50">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-display display-2 text-text-1">{area.title}</h2>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-2 sm:text-lg">{area.body}</p>
              {area.note ? (
                <p className="mt-5 max-w-2xl border-l-2 border-accent/60 pl-4 text-sm leading-relaxed text-text-3">
                  {area.note}
                </p>
              ) : null}
              <div className="mt-8">
                <Button href={area.href}>{area.ctaLabel}</Button>
              </div>
            </div>
            <div className="lg:border-l lg:border-edge-subtle lg:pl-8">
              <p className="eyebrow text-text-3">For example</p>
              <Checklist className="mt-4" items={area.examples} />
            </div>
          </div>
        </Band>
      ))}

      <Band tone="blue" id="agency" size="lg" className="scroll-mt-24">
        <SectionHead
          kicker={agency.kicker}
          title={agency.title}
          lede={agency.body}
          actions={
            <Button href={agency.href} variant="light">
              {agency.ctaLabel}
            </Button>
          }
        />
        <DefinitionGrid className="mt-12" columns={3} items={[...agency.focusAreas]} />
      </Band>

      <Band tone="raised" size="sm">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div>
            <Kicker>Team & Organization Programs</Kicker>
            <h2 className="mt-4 font-display display-3 text-text-1">{partnerTeamTraining.title}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-2 sm:text-base">
              {partnerTeamTraining.body}{" "}
              <Link href="/academy" className="link-wipe text-accent">
                See the Academy
              </Link>
              .
            </p>
          </div>
          <Link
            href={partnerTeamTraining.href}
            className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent"
          >
            {partnerTeamTraining.ctaLabel}
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </Band>

      <CtaBand
        tone="canvas"
        kicker={partnerClose.kicker}
        title={partnerClose.title}
        lede={partnerClose.lede}
        actions={<Button href={partnerClose.href}>{partnerClose.ctaLabel}</Button>}
      />
    </>
  );
}
