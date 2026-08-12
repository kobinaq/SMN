import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCheckoutButton } from "@/components/courses/CourseCheckoutButton";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { Button } from "@/components/ui/Button";
import { getMember } from "@/lib/auth/member";
import { getCourses } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
import { formatMinorAmount } from "@/lib/payments/paystack";

export const metadata: Metadata = {
  title: "Self-paced courses",
  description:
    "Individual marketing programmes with checkout on SMN. Separate from the flagship cohort application.",
  alternates: { canonical: "/programs/courses" },
};

type CourseRecord = Awaited<ReturnType<typeof getCourses>>[number] & {
  id?: string | number;
  amount?: number | null;
  currency?: string;
  delivery?: string;
};

function priceFor(course: CourseRecord) {
  return typeof course.amount === "number" && course.amount >= 100
    ? formatMinorAmount(course.amount, course.currency || "GHS")
    : course.price;
}

export default async function CoursesPage() {
  const [courses, member] = await Promise.all([getCourses(), getMember()]);
  const list = courses as CourseRecord[];
  const [featured, ...rest] = list;

  return (
    <>
      <CinematicPageHero
        image={img.courseGrowth}
        alt="Marketer working through a growth programme"
        kicker="Academy · Courses"
        title="Self-paced courses on your schedule."
        description="Enroll on SMN to unlock LMS or Classroom access. The flagship cohort still requires an application."
        actions={
          <>
            <Button href="#catalogue">Browse catalogue</Button>
            <Button href="/programs/cohort" variant="secondary">
              Prefer the live cohort?
            </Button>
          </>
        }
      />

      <section data-section-fade className="border-b border-white/10 bg-ink py-10 sm:py-12">
        <div className="container-wide flex flex-col gap-4 border-y border-white/10 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed text-white/60 sm:text-base">
              Courses are individual purchases with portal access. The flagship programme is a live
              cohort with review, mentorship, and community.{" "}
              <Link href="/apply" className="text-baby-blue transition hover:text-white">
                Apply separately
              </Link>
              .
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-white/50 transition hover:text-baby-blue"
          >
            All programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="catalogue" data-section-fade className="scroll-mt-24 bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Pick a programme and enroll.
            </h2>
          </div>

          {!list.length ? (
            <div className="mt-12">
              <EmptyProof
                title="Courses will appear here when published"
                body="The live cohort is open for applications while the catalogue is being prepared."
                href={cta.applyCohort.href}
                label={cta.applyCohort.label}
              />
            </div>
          ) : (
            <div className="mt-12 space-y-6 sm:mt-14">
              {featured ? (
                <article className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface sm:rounded-[2rem]">
                  <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
                    <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[480px]">
                      <Image
                        src={featured.image}
                        alt={featured.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 1024px) 100vw, 55vw"
                        priority
                      />
                      <div className="image-matte" />
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                        {featured.badge ? (
                          <span className="rounded-full bg-deep-blue px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
                            {featured.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-mint">
                            Featured
                          </span>
                        )}
                        <span>
                          {featured.lessons} lessons · {featured.duration}
                          {featured.delivery ? ` · ${featured.delivery}` : ""}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">
                        {featured.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                        {featured.summary}
                      </p>
                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <span className="font-display text-xl text-baby-blue">
                          {priceFor(featured)}
                        </span>
                        {featured.id ? (
                          <CourseCheckoutButton
                            courseId={featured.id}
                            amount={featured.amount}
                            label={cta.buyCourse.label}
                            signedIn={Boolean(member)}
                            variant="button"
                          />
                        ) : (
                          <span className="text-xs text-white/35">Configure in staff catalogue</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {featured.outcomes?.length ? (
                    <div className="border-t border-white/10 px-6 py-8 sm:px-8 lg:px-10">
                      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                        What you work through
                      </p>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.outcomes.map((outcome) => (
                          <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-white/60">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                            <span>{outcome}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </article>
              ) : null}

              {rest.length ? (
                <div data-stagger className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {rest.map((course) => (
                    <article
                      key={course.slug}
                      data-stagger-item
                      className="group flex flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="image-matte" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-white/40">
                          {course.badge ? (
                            <span className="rounded-full bg-deep-blue px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white">
                              {course.badge}
                            </span>
                          ) : null}
                          <span>
                            {course.lessons} lessons · {course.duration}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-2xl text-white">{course.title}</h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">
                          {course.summary}
                        </p>
                        {course.outcomes?.length ? (
                          <ul className="mt-4 space-y-1 text-sm text-white/40">
                            {course.outcomes.slice(0, 3).map((outcome) => (
                              <li key={outcome}>· {outcome}</li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
                          <span className="text-sm font-medium text-baby-blue">{priceFor(course)}</span>
                          {course.id ? (
                            <CourseCheckoutButton
                              courseId={course.id}
                              amount={course.amount}
                              label={cta.buyCourse.label}
                              signedIn={Boolean(member)}
                            />
                          ) : (
                            <span className="text-xs text-white/35">Coming soon</span>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              ) : null}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
