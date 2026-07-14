import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { getCourses } from "@/lib/cms";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Self-paced courses",
  description:
    "Individual marketing courses available for purchase on Selar. Separate from the flagship cohort application.",
  alternates: { canonical: "/programs/courses" },
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      <PageHero
        eyebrow="Individual courses · Paid on Selar"
        title="Self-paced courses on your schedule."
        description="These are individual course purchases on Selar — not the flagship cohort. Cohort membership requires an application. Member-platform LMS courses may also be granted after enrolment."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide mb-8 rounded-2xl border border-white/10 bg-surface p-5 text-sm text-white/60">
          <strong className="text-white">How this differs from the cohort:</strong> Buy a course on
          Selar for self-paced access. To join the live flagship programme,{" "}
          <a href="/apply" className="text-baby-blue hover:text-white">
            apply for the next cohort
          </a>
          .
        </div>
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image src={course.image} alt="" fill className="object-cover" sizes="33vw" />
                <div className="image-matte" />
              </div>
              <div className="p-6">
                <div className="flex items-center gap-2 text-xs text-white/40">
                  {course.badge ? (
                    <span className="rounded-full bg-deep-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                      {course.badge}
                    </span>
                  ) : null}
                  <span>
                    {course.lessons} lessons · {course.duration}
                  </span>
                </div>
                <h2 className="mt-4 font-display text-2xl text-white">{course.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{course.summary}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/35">
                  Learning outcomes
                </p>
                <ul className="mt-2 space-y-1 text-sm text-white/45">
                  {course.outcomes.map((o) => (
                    <li key={o}>· {o}</li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <span className="text-sm text-baby-blue">{course.price}</span>
                  <a
                    href={course.selarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-white hover:text-baby-blue"
                  >
                    {cta.buyOnSelar.label} <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
        <div className="container-wide mt-12">
          <Button href={cta.applyCohort.href} variant="secondary">
            Prefer the live cohort? {cta.applyCohort.shortLabel}
          </Button>
        </div>
      </section>
    </>
  );
}
