import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Marketing Career Training"),
  description:
    "Marketing jobs, internships, and mentorship through Social Marketers Network. Browse openings publicly. Apply from a member account.",
  alternates: { canonical: "/careers" },
};

export default function CareersHubPage() {
  return (
    <>
      <CinematicPageHero
        image={img.careersWork}
        alt="Two marketers collaborating with a tablet"
        kicker="Careers"
        title="Jobs, internships, and mentorship for marketers."
        description="Browse openings publicly. Apply and track activity from a member account. Internships and Experience Programme placements are how many members turn training into workplace proof."
        actions={
          <>
            <Button href={cta.browseJobs.href}>{cta.browseJobs.label}</Button>
            <Button href="/mentorship" variant="secondary">
              How mentorship works
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-5 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
          <Link
            href="/careers/jobs"
            className="group relative min-h-[22rem] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[28rem] sm:rounded-[2rem]"
          >
            <Image
              src={img.jobsFocus}
              alt="Marketers in a professional lounge conversation"
              fill
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/55 to-near-black/20" />
            <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                Job opportunities
              </p>
              <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
                Browse marketing roles
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70">
                Open listings from SMN and partner employers. Sign in when you are ready to apply.
              </p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-baby-blue">
                View jobs
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          <div className="grid gap-5">
            <Link
              href="/careers/internships"
              className="group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-surface p-6 transition hover:border-baby-blue/35 sm:rounded-[2rem] sm:p-7"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                  Internships
                </p>
                <h2 className="mt-3 font-display text-2xl text-white group-hover:text-baby-blue">
                  Find internship pathways
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Entry roles, briefs, and Experience Programme placements for marketers building
                  workplace proof.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85">
                View internships
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
            <Link
              href="/mentorship"
              className="group flex flex-col justify-between rounded-[1.75rem] border border-white/10 bg-near-black p-6 transition hover:border-baby-blue/35 sm:rounded-[2rem] sm:p-7"
            >
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                  Mentorship
                </p>
                <h2 className="mt-3 font-display text-2xl text-white group-hover:text-baby-blue">
                  Get guidance on real work
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  Brand, agency, freelance, and alumni mentors. Bring one clear question.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85">
                How it works
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-20">
        <div className="container-wide flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-xl">
            <h2 className="font-display text-2xl text-white sm:text-3xl">Hiring marketers?</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/55">
              Share roles, request interns, host an Experience placement, or hire SMN talent with
              portfolio evidence. Employment is not guaranteed.
            </p>
          </div>
          <div className="btn-row-mobile">
            <Button href={cta.hireTalent.href}>{cta.hireTalent.label}</Button>
            <Button href={cta.postJob.href} variant="secondary">
              {cta.postJob.label}
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
