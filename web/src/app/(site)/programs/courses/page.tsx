import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { CourseCheckoutButton } from "@/components/courses/CourseCheckoutButton";
import { Masthead } from "@/components/site/kit";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { Button } from "@/components/ui/Button";
import { getMember } from "@/lib/auth/member";
import { getCourses } from "@/lib/cms";
import { cta } from "@/lib/cta";
import { courseCategories, seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";
import { formatMinorAmount } from "@/lib/payments/paystack";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Courses"),
  description:
    "Explore practical social media marketing, AI and digital marketing courses designed for modern marketers.",
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
      <Masthead
        image={img.learnSolo}
        alt="Marketer learning on a phone in the lounge"
        kicker="Academy · Courses"
        title="Learn marketing at your own pace."
        lede="Practical, focused courses designed to help you build specific marketing skills without committing to a full training programme. Enroll on SMN to unlock portal access."
        actions={
          <>
            <Button href="#catalogue">Explore courses</Button>
            <Button href="/programs/cohort" variant="secondary">
              Prefer live training?
            </Button>
          </>
        }
      />

      <section data-section-fade className="border-b border-edge-subtle bg-raised py-10 sm:py-12">
        <div className="container-wide flex flex-col gap-4 border-y border-edge-subtle py-8 sm:flex-row sm:items-end sm:justify-between sm:py-10">
          <div className="max-w-2xl">
            <p className="text-sm leading-relaxed text-text-2 sm:text-base">
              Whether you are starting out, developing existing skills, or learning something new,
              these courses are designed around the realities of modern marketing. The flagship
              programme is a live cohort with review, mentorship, and community.{" "}
              <Link href="/apply" className="text-accent transition hover:text-text-1">
                Apply separately
              </Link>
              .
            </p>
          </div>
          <Link
            href="/programs"
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-text-3 transition hover:text-accent"
          >
            All programmes
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section id="catalogue" data-section-fade className="scroll-mt-24 bg-canvas py-16 sm:py-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="font-display display-2 text-text-1">
              Pick a programme and enroll.
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {courseCategories.map((item) => (
              <div key={item.title} className=" border border-edge-subtle bg-raised p-4 sm:p-5">
                <h3 className="font-display text-base text-text-1 sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{item.body}</p>
              </div>
            ))}
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
                <article className="overflow-hidden border border-edge-subtle bg-raised">
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
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-text-3">
                        {featured.badge ? (
                          <span className="rounded-full bg-accent-strong px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-1">
                            {featured.badge}
                          </span>
                        ) : (
                          <span className="eyebrow text-ai">
                            Featured
                          </span>
                        )}
                        <span>
                          {featured.lessons} lessons · {featured.duration}
                          {featured.delivery ? ` · ${featured.delivery}` : ""}
                        </span>
                      </div>
                      <h3 className="mt-4 font-display display-3 text-text-1">
                        {featured.title}
                      </h3>
                      <p className="mt-4 text-sm leading-relaxed text-text-2 sm:text-base">
                        {featured.summary}
                      </p>
                      <div className="mt-8 flex flex-wrap items-center gap-4">
                        <span className="font-display text-xl text-accent">
                          {priceFor(featured)}
                        </span>
                        {featured.commerce === "apply" ? (
                          <Button href="/apply">{cta.applyCohort.shortLabel}</Button>
                        ) : featured.id ? (
                          <CourseCheckoutButton
                            courseId={featured.id}
                            amount={featured.amount}
                            label={cta.buyCourse.label}
                            signedIn={Boolean(member)}
                            variant="button"
                          />
                        ) : (
                          <span className="text-xs text-text-3">Coming soon</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {featured.outcomes?.length ? (
                    <div className="border-t border-edge-subtle px-6 py-8 sm:px-8 lg:px-10">
                      <p className="eyebrow text-text-3">
                        What you work through
                      </p>
                      <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {featured.outcomes.map((outcome) => (
                          <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-text-2">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
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
                      className="group flex flex-col overflow-hidden border border-edge-subtle bg-raised transition duration-300 hover:border-accent/30"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={course.image}
                          alt={course.title}
                          fill
                          className="object-cover transition duration-700 group-hover:scale-[1.03]"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-text-3">
                          {course.badge ? (
                            <span className="rounded-full bg-accent-strong px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-1">
                              {course.badge}
                            </span>
                          ) : null}
                          <span>
                            {course.lessons} lessons · {course.duration}
                          </span>
                        </div>
                        <h3 className="mt-4 font-display text-2xl text-text-1">{course.title}</h3>
                        <p className="mt-3 flex-1 text-sm leading-relaxed text-text-2">
                          {course.summary}
                        </p>
                        {course.outcomes?.length ? (
                          <ul className="mt-4 space-y-1 text-sm text-text-3">
                            {course.outcomes.slice(0, 3).map((outcome) => (
                              <li key={outcome}>· {outcome}</li>
                            ))}
                          </ul>
                        ) : null}
                        <div className="mt-6 flex items-center justify-between gap-3 border-t border-edge-subtle pt-5">
                          <span className="text-sm font-medium text-accent">{priceFor(course)}</span>
                          {course.commerce === "apply" ? (
                            <Button href="/apply" variant="secondary">
                              {cta.applyCohort.shortLabel}
                            </Button>
                          ) : course.id ? (
                            <CourseCheckoutButton
                              courseId={course.id}
                              amount={course.amount}
                              label={cta.buyCourse.label}
                              signedIn={Boolean(member)}
                            />
                          ) : (
                            <span className="text-xs text-text-3">Coming soon</span>
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
