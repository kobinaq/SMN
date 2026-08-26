import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Handshake, Target, Users } from "@/components/ui/icons";
import { Masthead } from "@/components/site/kit";
import { Button } from "@/components/ui/Button";
import { seoTitle } from "@/lib/brand";
import { getSiteSettings } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Marketing Academy Ghana"),
  description:
    "Training programmes, self-paced courses, marketing simulations, and the SMN Experience Programme from Social Marketers Network.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const site = await getSiteSettings();

  return (
    <>
      <Masthead
        image={img.academyGroup}
        alt="Social Marketers Network members gathered together"
        kicker="SMN Academy"
        title="Choose how you learn with SMN."
        lede="Live training, self-paced courses, a simulation waitlist, and the Experience Programme. Practical paths into the Network."
        actions={
          <>
            <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
            <Button href={cta.viewCourses.href} variant="secondary">
              {cta.viewCourses.label}
            </Button>
          </>
        }
      />

      <section data-section-fade className="border-b border-edge-subtle bg-raised py-16 sm:py-24 md:py-28">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-display display-2 text-text-1">
              Train live, learn self-paced, practise, then gain experience.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.35fr_0.85fr] lg:gap-5">
            <Link
              href="/programs/cohort"
              className="group relative min-h-[28rem] overflow-hidden border border-edge-subtle sm:min-h-[32rem]"
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
                <span className="inline-flex w-fit items-center gap-2 rounded-full border border-edge bg-canvas/50 px-3 py-1 eyebrow text-ai backdrop-blur-sm">
                  <Users className="h-3 w-3" strokeWidth={1.75} />
                  Training · Application
                </span>
                <h3 className="mt-4 font-display display-2 text-text-1">
                  {site.cohort.name}
                </h3>
                <p className="mt-3 max-w-lg text-sm leading-relaxed text-text-2 sm:text-base">
                  Become the marketer businesses need. Live Social Media Marketing and AI with
                  mentorship, portfolio work, and community.
                </p>
                <p className="mt-4 eyebrow text-text-3">
                  {site.cohort.duration} · {site.cohort.startDate} · {site.cohort.seats} seats
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-text-1 transition group-hover:text-accent">
                  {cta.applyCohort.shortLabel}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>

            <div className="grid gap-5">
              <Link
                href="/programs/courses"
                className="group relative flex min-h-[12rem] flex-col justify-between overflow-hidden border border-edge-subtle bg-raised p-6 sm:p-7"
              >
                <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-accent/10 blur-3xl transition duration-500 group-hover:bg-accent/20" />
                <div className="relative">
                  <span className="inline-flex items-center gap-2 eyebrow text-accent">
                    <BookOpen className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Courses
                  </span>
                  <h3 className="mt-4 font-display display-3 text-text-1">
                    Learn marketing at your own pace
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    Practical, focused courses for specific skills. Purchase unlocks portal access.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-text-1/85 transition group-hover:text-accent">
                  {cta.viewCourses.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/experience#simulations"
                className="group relative flex min-h-[11rem] flex-col justify-between overflow-hidden border border-edge-subtle bg-canvas p-6 sm:p-7"
              >
                <div className="relative">
                  <span className="inline-flex items-center gap-2 eyebrow text-ai">
                    <Target className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Simulations · Waitlist
                  </span>
                  <h3 className="mt-4 font-display display-3 text-text-1">
                    Do not just learn marketing. Practise it.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    Realistic challenges, when they open. Join the waitlist for the next window.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-text-1/85 transition group-hover:text-accent">
                  Join the waitlist
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>

              <Link
                href="/experience"
                className="group relative flex min-h-[11rem] flex-col justify-between overflow-hidden border border-edge-subtle bg-raised p-6 sm:p-7"
              >
                <div className="relative">
                  <span className="inline-flex items-center gap-2 eyebrow text-accent">
                    <Handshake className="h-3.5 w-3.5" strokeWidth={1.75} />
                    Experience Programme
                  </span>
                  <h3 className="mt-4 font-display display-3 text-text-1">
                    From training into professional experience
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-text-2">
                    Selected participants are matched with brands, agencies, and marketers for
                    applied work.
                  </p>
                </div>
                <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-medium text-text-1/85 transition group-hover:text-accent">
                  {cta.viewExperience.label}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section data-section-fade className="bg-canvas py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-10 border-y border-edge-subtle py-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-8 sm:py-14">
            {[
              {
                label: "Training",
                body: "Scheduled classes, review, mentors, and a shared cohort energy.",
              },
              {
                label: "Courses",
                body: "Buy a course, learn in the portal, move at the speed that fits your week.",
              },
              {
                label: "Simulations",
                body: "Upcoming practice scenarios. Join the waitlist for the next window.",
              },
              {
                label: "Experience",
                body: "Applied placements after training. Intern, volunteer, or project-based work.",
              },
            ].map((item) => (
              <div key={item.label}>
                <p className="font-display text-lg text-text-1">{item.label}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-2 sm:text-[15px]">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-14 flex flex-col items-start justify-between gap-6 sm:mt-16 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="font-display display-3 text-text-1">Not sure which path fits?</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-2">
                Ask about the live cohort, self-paced courses, the simulation waitlist, or Experience.
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
