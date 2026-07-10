import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description: "Flagship cohort and self-paced courses.",
};

const paths = [
  {
    href: "/programs/cohort",
    title: "Flagship Cohort",
    body: "Live Social Media Marketing & AI program with community, portfolio work, and client project opportunities.",
    meta: `${site.cohort.duration} · ${site.cohort.startDate}`,
  },
  {
    href: "/programs/courses",
    title: "Self-Paced Courses",
    body: "Courses on Selar covering strategy, AI, social systems, and more, on your schedule.",
    meta: "Flexible · Buy on Selar",
  },
];

export default function ProgramsPage() {
  return (
    <>
      <PageHero
        eyebrow="Programs"
        title="Options for beginners and experienced marketers."
        description="Choose a live cohort or self-paced courses. Both connect you back to the Network."
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
              <p className="mt-4 text-white/65 leading-relaxed">{path.body}</p>
              <span className="mt-8 inline-flex items-center gap-2 text-sm text-white/80 group-hover:text-baby-blue">
                Explore <ArrowRight className="h-4 w-4" />
              </span>
            </Link>
          ))}
        </div>
        <div className="container-wide mt-12">
          <Button href="/apply">Apply to the flagship cohort</Button>
        </div>
      </section>
    </>
  );
}
