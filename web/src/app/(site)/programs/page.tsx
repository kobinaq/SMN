import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { getSiteSettings } from "@/lib/cms";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Programmes",
  description: "Flagship cohort programme and self-paced courses.",
  alternates: { canonical: "/programs" },
};

export default async function ProgramsPage() {
  const site = await getSiteSettings();

  const paths = [
    {
      href: "/programs/cohort",
      title: "Flagship cohort",
      body: "Live Social Media Marketing & AI programme with application review, mentorship, portfolio work, member-platform access, and community.",
      meta: `${site.cohort.duration} · ${site.cohort.startDate} · Application required`,
      cta: cta.applyCohort.shortLabel,
    },
    {
      href: "/programs/courses",
      title: "Self-paced courses",
      body: "Individual courses covering strategy, AI, social systems, and more. Purchase and access on Selar.",
      meta: "Flexible · Buy on Selar",
      cta: "View courses",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Programmes"
        title="Choose how you want to learn."
        description="Apply to the live flagship cohort, or buy an individual self-paced course. Both connect you back to the Network."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-5 md:grid-cols-2">
          {paths.map((path) => (
            <Link
              key={path.href}
              href={path.href}
              className="group rounded-[2rem] border border-white/10 bg-surface p-8 transition hover:border-baby-blue/40"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-baby-blue">{path.meta}</p>
              <h2 className="mt-4 font-display text-3xl text-white">{path.title}</h2>
              <p className="mt-4 leading-relaxed text-white/65">{path.body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-baby-blue">
                {path.cta} <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="container-wide mt-12">
          <Button href={cta.applyCohort.href}>{cta.applyCohort.label}</Button>
        </div>
      </section>
    </>
  );
}
