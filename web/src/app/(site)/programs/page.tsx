import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Flagship cohort programme and self-paced courses from Social Marketers Network.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const site = await getSiteSettings();

  return (
    <>
      <section className="relative min-h-[78svh] overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[85svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={img.cohortSpotlight}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/55" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/40" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(78svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(85svh-7rem)] sm:pb-20">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Choose how you learn with SMN.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            Apply to the live flagship cohort, or enroll in a self-paced course. Both put you inside
            the Network.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href={cta.viewCourses.href} variant="secondary">
              {cta.viewCourses.label}
            </Button>
          </div>
        </div>
      </section>

      <section data-section-fade className="border-b border-white/10 bg-ink py-16 sm:py-24 md:py-28">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Two paths
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Live cohort or self-paced — pick your pace.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
            <Link
              href="/programs/cohort"
              className="group relative min-h-[28rem] overflow-hidden rounded-[1.75rem] border border-white/10 sm:min-h-[32rem] sm:rounded-[2rem]"
            >
              <Image
                src={img.cohortPage}
                alt=""
                fill
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-near-black via-near-black/55 to-near-black/20" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-near-black/50 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-mint backdrop-blur-sm">
                  <Users className="h-3 w-3" strokeWidth={1.75} />
                  Flagship · Application
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

            <Link
              href="/programs/courses"
              className="group relative flex min-h-[22rem] flex-col justify-between overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:min-h-[28rem] sm:rounded-[2rem] sm:p-8 lg:min-h-full"
            >
              <div className="pointer-events-none absolute -right-8 top-0 h-48 w-48 rounded-full bg-baby-blue/10 blur-3xl transition duration-500 group-hover:bg-baby-blue/20" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                  <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                  Catalogue · Enroll on SMN
                </span>
                <h3 className="mt-5 font-display text-3xl text-white sm:text-4xl">Self-paced courses</h3>
                <p className="mt-4 text-sm leading-relaxed text-white/65 sm:text-base">
                  Strategy, AI, and social systems on your schedule. Purchase unlocks LMS or Classroom
                  access in the member portal.
                </p>
              </div>
              <div className="relative mt-10">
                <div className="relative mb-6 aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
                  <Image
                    src={img.courseGrowth}
                    alt=""
                    fill
                    className="object-cover transition duration-700 group-hover:scale-[1.03]"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                  />
                  <div className="image-matte" />
                </div>
                <span className="inline-flex items-center gap-2 text-sm font-medium text-white/85 transition group-hover:text-baby-blue">
                  View courses
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-near-black py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-10 border-y border-white/10 py-10 sm:grid-cols-3 sm:gap-8 sm:py-14">
            {[
              {
                label: "Live cohort",
                body: "Scheduled classes, review, mentors, and a shared cohort energy.",
              },
              {
                label: "Self-paced",
                body: "Buy a course, learn in the portal, move at the speed that fits your week.",
              },
              {
                label: "Same network",
                body: "Both paths connect you to community, events, and career tools on SMN.",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-mint">{item.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-[15px]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 sm:mt-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl text-white sm:text-4xl">Ready for the next intake?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Applications open on a rolling basis. Contact SMN for current fees after acceptance.
              </p>
            </div>
            <div className="btn-row-mobile">
              <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
              <Button href="/contact" variant="secondary">
                Ask a question
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
