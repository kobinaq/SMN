import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Briefcase, GraduationCap, Users } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Careers",
  description:
    "Marketing job opportunities, internships, and mentorship through Social Marketers Network.",
  alternates: { canonical: "/careers" },
};

const paths = [
  {
    href: "/careers/jobs",
    icon: Briefcase,
    label: "Job opportunities",
    title: "Browse marketing roles",
    body: "Open listings from SMN and partner employers. Sign in as a member when you are ready to apply.",
  },
  {
    href: "/careers/internships",
    icon: GraduationCap,
    label: "Internships",
    title: "Find internship pathways",
    body: "Entry roles and internship briefs for marketers building proof of work and workplace experience.",
  },
  {
    href: "/mentorship",
    icon: Users,
    label: "Mentorship",
    title: "Get guidance that compounds",
    body: "Connect with practitioners who have done the work — brand, agency, freelance, and alumni mentors.",
  },
];

export default function CareersHubPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="Jobs, internships, and mentorship for marketers."
        description="Explore opportunities publicly. Apply and track activity from your member account when you are ready."
      />
      <section className="border-t border-white/10 bg-ink py-16 sm:py-20 md:py-24">
        <div className="container-wide">
          <div className="grid gap-5 lg:grid-cols-3">
            {paths.map((path) => (
              <Link
                key={path.href}
                href={path.href}
                className="group flex flex-col rounded-[1.75rem] border border-white/10 bg-surface p-6 transition hover:border-baby-blue/35 sm:p-8"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-baby-blue">
                  <path.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
                  {path.label}
                </p>
                <h2 className="mt-2 font-display text-2xl text-white group-hover:text-baby-blue">
                  {path.title}
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/55">{path.body}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm text-baby-blue">
                  Explore
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
          <div className="mt-14 flex flex-col items-start justify-between gap-6 border-t border-white/10 pt-10 md:flex-row md:items-end">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl text-white sm:text-3xl">Hiring marketers?</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Share roles, request interns, or hire SMN talent with portfolio evidence.
              </p>
            </div>
            <div className="btn-row-mobile">
              <Button href={cta.hireTalent.href}>{cta.hireTalent.label}</Button>
              <Button href={cta.postJob.href} variant="secondary">
                {cta.postJob.label}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
