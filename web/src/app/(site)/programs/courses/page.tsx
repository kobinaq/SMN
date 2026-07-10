import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getCourses } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Self-Paced Courses",
  description: "Specialized marketing courses delivered via Selar.",
};

export default async function CoursesPage() {
  const courses = await getCourses();
  return (
    <>
      <PageHero
        eyebrow="Self-paced"
        title="Learn on your schedule. Delivered on Selar."
        description="Browse courses on strategy, AI, social systems, and more. Checkout and access happen on Selar."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          {courses.map((course) => (
            <article
              key={course.slug}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image src={course.image} alt="" fill className="object-cover" sizes="33vw" />
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
                <p className="mt-3 text-sm text-white/60 leading-relaxed">{course.summary}</p>
                <ul className="mt-4 space-y-1 text-sm text-white/45">
                  {course.outcomes.map((o) => (
                    <li key={o}>· {o}</li>
                  ))}
                </ul>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-baby-blue">{course.price}</span>
                  <a
                    href={course.selarUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-white hover:text-baby-blue"
                  >
                    Enroll on Selar <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
