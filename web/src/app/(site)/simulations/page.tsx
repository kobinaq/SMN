import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { seoTitle, simulationPractice } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Marketing Simulations"),
  description:
    "Practise marketing judgement with realistic challenges. SMN simulations are on a waitlist. Register your interest for the next window.",
  alternates: { canonical: "/simulations" },
};

export default function SimulationsPage() {
  return (
    <>
      <CinematicPageHero
        image={img.resAudit}
        alt="Marketing audit workbook and notes"
        kicker="Academy · Waitlist"
        title="Do not just learn marketing. Practise it."
        description="Marketing becomes easier to understand when you have a problem to solve. SMN simulations will let you step into the role of a marketer and work through realistic challenges. The live practice product is not open yet."
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
              What you will practise
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              When simulations open, you will work through briefs that ask you to research, decide,
              and defend your ideas. Join the waitlist and we will write when the next window is
              ready.
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {simulationPractice.map((item) => (
                <li key={item} className="flex gap-3 text-sm text-white/70">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-near-black py-16 sm:py-24">
        <div className="container-wide max-w-3xl">
          <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
            From classroom knowledge to marketing judgement.
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-white/65 sm:text-base">
            Real marketers rarely receive a perfect brief with every answer provided. They research.
            They ask questions. They make decisions. They defend their ideas. They adapt. Our
            simulations are designed to help you develop that kind of thinking.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-white/45">
            Until they open, the{" "}
            <Link href="/programs/cohort" className="text-baby-blue transition hover:text-white">
              live training programme
            </Link>{" "}
            and{" "}
            <Link href="/programs/courses" className="text-baby-blue transition hover:text-white">
              self-paced courses
            </Link>{" "}
            are the live learning paths.
          </p>
        </div>
      </section>

      <section id="simulation-interest" className="scroll-mt-24 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Register your interest
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
              No member account required. Tell us which kind of challenge you want first. We follow
              up when a window is ready.
            </p>
          </div>
          <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-8 md:p-10">
            <ContactForm defaultType="Simulation waitlist" />
          </div>
        </div>
      </section>
    </>
  );
}
