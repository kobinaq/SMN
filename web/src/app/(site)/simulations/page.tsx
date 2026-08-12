import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Marketing Simulations",
  description:
    "Join the waitlist for SMN marketing simulations: campaign briefs and decision drills. The live practice product is not open yet.",
  alternates: { canonical: "/simulations" },
};

const upcoming = [
  "Brand crisis desk: triage a public thread and decide what stays in-public",
  "Growth experiment lab: pick a hypothesis, design a light test, report what you would measure",
];

export default function SimulationsPage() {
  return (
    <>
      <CinematicPageHero
        image={img.resAudit}
        alt="Marketing audit workbook and notes"
        kicker="Academy · Waitlist"
        title="Simulations are on the way."
        description="Practice briefs and decision drills are not live yet. Register your interest and we will write when the next window opens."
        actions={
          <>
            <Button href="#simulation-interest">Join the waitlist</Button>
            <Button href="/programs/cohort" variant="secondary">
              Prefer live training?
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem]">
            <Image
              src={img.practicePair}
              alt="Two marketers talking through a practice session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              First up: Campaign war room
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              A timed brief covering audience, offer, channel mix, and a one-week content plan. You
              ship decisions, not a slide deck for its own sake.
            </p>
            <p className="mt-6 text-sm text-white/40">Also on the list</p>
            <ul className="mt-3 space-y-3 text-sm text-white/70">
              {upcoming.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section
        id="simulation-interest"
        className="scroll-mt-24 bg-near-black py-16 sm:py-24"
      >
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Register your interest
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
              No member account required. Tell us which scenario you want first. We follow up when
              a window is ready. Until then, the cohort and self-paced courses are the live paths.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
            <ContactForm defaultType="General enquiry" />
          </div>
        </div>
      </section>
    </>
  );
}
