import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import {
  Band,
  Checklist,
  DefinitionGrid,
  Masthead,
  SectionHead,
} from "@/components/site/kit";
import { PartnerRequestForm, type RequestKind } from "@/components/site/PartnerRequestForm";
import { partnerTracks, seoTitle } from "@/lib/brand";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Partner With Us"),
  description:
    "Build with the next generation of marketers. Train teams, collaborate on events, or sponsor access to training and practical work.",
  alternates: { canonical: "/partner" },
  openGraph: { url: "/partner" },
};

const proof = [
  {
    title: "Portfolio evidence",
    body: "Review public member profiles and case studies before you talk to anyone.",
  },
  {
    title: "Practical work",
    body: "Match emerging marketers to volunteer roles, project briefs, and marketing simulations.",
  },
  {
    title: "Staff-reviewed listings",
    body: "Roles and requests are read by Think Social Academy before they reach members.",
  },
];

const REQUEST_ALIASES: Record<string, RequestKind> = {
  job: "job",
  intern: "intern",
  talent: "talent",
  training: "training",
};

export default async function EmployersPage({
  searchParams,
}: {
  searchParams: Promise<{ request?: string }>;
}) {
  const { request } = await searchParams;
  // Public hire / job / intern entry points redirect to /community (T3).
  // Only partnership request kinds stay on this form.
  const aliased = request ? REQUEST_ALIASES[request] : undefined;
  const initialRequest =
    aliased && aliased !== "job" && aliased !== "intern" && aliased !== "talent"
      ? aliased
      : "training";

  return (
    <>
      <Masthead
        image={img.hireConversation}
        alt="Two marketers in conversation"
        kicker="Partner with us"
        title="Build with the next generation of marketers."
        lede="Think Social Academy works with brands, organisations, agencies, and industry professionals to create opportunities for learning, talent, collaboration, and career development."
        actions={
          <>
            <Button href="#request">{cta.partner.label}</Button>
            <Button href={cta.contact.href} variant="secondary">
              {cta.contact.label}
            </Button>
          </>
        }
      />

      <Band size="lg">
        <SectionHead
          kicker="Ways in"
          title="How organisations work with the Network."
          lede="Most partnerships start with one of these and grow into another. Every one of them runs through the same request form below."
        />

        <div className="mt-14 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle lg:grid-cols-2">
          {partnerTracks.filter((track) => track.id !== "hire").map((track) => (
            <article key={track.id} className="flex flex-col bg-canvas p-7 sm:p-9">
              <p className="ordinal text-accent/40">{track.n}</p>
              <p className="mt-5 eyebrow text-accent">{track.kicker}</p>
              <h3 className="mt-3 font-display text-2xl text-text-1">{track.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-text-2">{track.body}</p>
              <Checklist className="mt-6" columns={2} tone="muted" items={track.items} />
              <p className="mt-auto rule pt-6 text-sm text-text-3">
                <span className="eyebrow block text-text-3">Best for</span>
                <span className="mt-2 block">{track.bestFor}</span>
              </p>
            </article>
          ))}
        </div>
      </Band>

      <Band tone="light" size="lg">
        <SectionHead
          kicker="Why it works"
          title="You meet marketers with evidence."
          lede="Not CVs and enthusiasm: briefs they have worked, decisions they can defend, and feedback from people already in the industry."
        />
        <DefinitionGrid className="mt-12" columns={3} items={proof} />
        <p className="mt-10 max-w-2xl text-sm text-text-3">
          Learn more about{" "}
          <Link href="/academy#practical-work" className="link-wipe text-accent">
            practical work and marketing simulations
          </Link>{" "}
          or the{" "}
          <Link href="/community" className="link-wipe text-accent">
            community
          </Link>
          .
        </p>
      </Band>

      <Band id="request" size="lg" bordered={false} className="scroll-mt-24">
        <PartnerRequestForm initial={initialRequest} />
        <p className="mt-12 rule pt-8 max-w-2xl text-sm leading-relaxed text-text-3">
          Have an idea we have not listed? Partnerships do not always fit neatly into a category. If
          you have an idea for how your organisation could contribute to or benefit from the
          Network,{" "}
          <Link href="/contact#message" className="link-wipe text-accent">
            tell us about it
          </Link>
          .
        </p>
      </Band>
    </>
  );
}
