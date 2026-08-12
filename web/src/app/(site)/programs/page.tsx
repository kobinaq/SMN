import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Target, Users } from "lucide-react";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Academy",
  description:
    "Training programs, self-paced courses, and marketing simulations from Social Marketers Network.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const site = await getSiteSettings();

  return (
    <>
      <CinematicPageHero
        image={img.academyGroup}
        alt="Social Marketers Network members gathered together"
        kicker="SMN Academy"
        title="Choose how you learn with SMN."
        description="Training programs, self-paced courses, and a simulation waitlist. Practical paths into the Network."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href={cta.viewCourses.href} variant="secondary">
              {cta.viewCourses.label}
            </Button>
          </>
        }
      />

      <section data-section-fade className="border-b border-white/10 bg-ink py-16 sm:py-24 md:py-28">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Train live, learn self-paced, or join the simulation waitlist.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
            <Link
              href="/programs/cohort"
              className="group relative min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[32rem] sm:rounded-[2rem]"
            >
              <Image
                src={img.cohortPage}
                alt="Social Marketers Network cohort in session"
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/55 to-near-black/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-near-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-mint backdrop-blur-sm">
                  <Users className="h-3 w-3" strokeWidth={1.75} />
                  Training Programs · Application
                </span>
                <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl md:text-5xl">
                  {site.cohort.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base">
                  Live Social Media Marketing & AI with mentorship, portfolio work, member-platform
                  access, and community.
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.14em] text-white/45">
                  {site.cohort.duration} · {site.cohort.startDate} · {site.cohort.seats} seats
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-white transition group-hover:text-baby-blue">
                  {cta.applyCohort.shortLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-5">
              <Link
                href="/programs/courses"
                className="group relative flex min-h-[16rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-7"
              >
                <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-baby-blue/10 blur-3xl transition duration-500 group-hover:bg-baby-blue/20" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                    <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Self-Paced Courses
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-white sm:text-3xl">
                    Learn on your schedule
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Strategy, AI, and social systems. Purchase unlocks portal access.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition group-hover:text-baby-blue">
                  View courses
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/simulations"
                className="group relative flex min-h-[14rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-near-black p-6 sm:rounded-[2rem] sm:p-7"
              >
                <div className="relative">
                  <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                    <Target className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Simulations · Waitlist
                  </span>
                  <h3 className="mt-4 font-display text-2xl text-white sm:text-3xl">
                    Practice scenarios, when they open
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">
                    Campaign briefs and decision drills. Join the waitlist for the next window.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-white/85 transition group-hover:text-baby-blue">
                  Join the waitlist
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-near-black py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-10 border-y border-white/10 py-10 sm:grid-cols-3 sm:gap-8 sm:py-14">
            {[
              {
                label: "Training programs",
                body: "Scheduled classes, review, mentors, and a shared cohort energy.",
              },
              {
                label: "Self-paced",
                body: "Buy a course, learn in the portal, move at the speed that fits your week.",
              },
              {
                label: "Simulations",
                body: "Upcoming practice scenarios. Join the waitlist for the next window.",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display text-lg text-white">{item.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-[15px]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 sm:mt-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl text-white sm:text-4xl">Not sure which path fits?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Ask about the live cohort, self-paced courses, or the simulation waitlist.
              </p>
            </div>
            <div className="btn-row-mobile">
              <Button href="/contact">Ask a question</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
