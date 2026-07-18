import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CourseCheckoutButton } from "@/components/courses/CourseCheckoutButton";
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
      <section className="relative min-h-[72svh] overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[82svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={img.courseGrowth}
            alt=""
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/90 to-near-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/40" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(72svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(82svh-7rem)] sm:pb-20">
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
            Social Marketers Network
          </p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[2.35rem] leading-[1.05] text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Self-paced courses on your schedule.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            Enroll on SMN to unlock LMS or Classroom access. The flagship cohort still requires an
            application.
          </p>
          <div className="btn-row-mobile mt-8">
            <Button href="#catalogue">Browse catalogue</Button>
            <Button href="/programs/cohort" variant="secondary">
              Prefer the live cohort?
            </Button>
          </div>
        </div>
      </section>

      <section data-section-fade className="border-b border-white/10 bg-ink py-10 sm:py-12">
        <div className="container-wide flex flex-col gap-4 border-y border-white/10 py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">
              How this differs
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/60 sm:text-base">
              Courses are individual purchases with portal access. The flagship programme is a live
              cohort with review, mentorship, and community —{" "}
              <Link href="/apply" className="text-baby-blue transition hover:text-white">
                apply separately
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
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">
              Catalogue
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl md:text-5xl">
              Pick a programme and enroll.
            </h2>
          </div>

          {!list.length ? (
            <p className="mt-12 text-sm text-white/50">Courses will appear here when published.</p>
          ) : (
            <div className="mt-12 space-y-6 sm:mt-14">
              {featured ? (
                <article className="grid overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface sm:rounded-[2rem] lg:grid-cols-[1.15fr_0.85fr]">
                  <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]">
                    <Image
                      src={featured.image}
                      alt=""
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
                      </span>
                    </div>
                    <h3 className="mt-4 font-display text-3xl text-white sm:text-4xl">{featured.title}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
                      {featured.summary}
                    </p>
                    {featured.outcomes?.length ? (
                      <ul className="mt-5 space-y-1.5 text-sm text-white/45">
                        {featured.outcomes.slice(0, 4).map((outcome) => (
                          <li key={outcome} className="flex gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-baby-blue" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <span className="font-display text-xl text-baby-blue">{priceFor(featured)}</span>
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
                          alt=""
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

          <div className="mt-16 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-12 sm:mt-20 md:flex-row md:items-end">
            <div className="max-w-lg">
              <h2 className="font-display text-3xl text-white">Want the live cohort instead?</h2>
              <p className="mt-3 text-sm text-white/55">
                Apply for review, mentorship, and a shared intake — separate from catalogue checkout.
              </p>
            </div>
            <div className="btn-row-mobile">
              <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
              <Button href="/programs/cohort" variant="secondary">
                Cohort details
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
