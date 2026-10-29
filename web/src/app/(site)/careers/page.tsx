import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Band, CtaBand, Masthead, SectionHead } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Marketing Career Training"),
  description:
    "Marketing jobs, internships, and mentorship through Social Marketers Network. Browse openings publicly. Apply from a member account.",
  alternates: { canonical: "/careers" },
};

const routes = [
  {
    kicker: "Job opportunities",
    title: "Browse marketing roles",
    body: "Open listings from SMN and partner employers. Sign in when you are ready to apply.",
    href: "/careers/jobs",
    action: "View jobs",
  },
  {
    kicker: "Internships",
    title: "Find internship pathways",
    body: "Entry roles, briefs, and Experience Programme placements for marketers building workplace proof.",
    href: "/careers/jobs?type=Internship",
    action: "View internships",
  },
  {
    kicker: "Mentorship",
    title: "Get guidance on real work",
    body: "Brand, agency, freelance, and alumni mentors. Bring one clear question.",
    href: "/mentorship",
    action: "How it works",
  },
];

export default function CareersHubPage() {
  return (
    <>
      <Masthead
        image={img.careersWork}
        alt="Two marketers collaborating with a tablet"
        kicker="Careers"
        title="Jobs, internships, and mentorship."
        lede="Browse openings publicly. Apply and track activity from a member account. Internships and Experience placements are how many members turn training into workplace proof."
        actions={
          <>
            <Button href={cta.browseJobs.href}>{cta.browseJobs.label}</Button>
            <Button href="/mentorship" variant="secondary">
              How mentorship works
            </Button>
          </>
        }
      />

      <Band size="lg">
        <SectionHead
          kicker="Three routes"
          title="Where do you want to start?"
          lede="Everything here is open to browse. You only need an account at the point of applying."
        />

        <div className="mt-12 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-3">
          {routes.map((route) => (
            <Link
              key={route.title}
              href={route.href}
              className="group flex flex-col justify-between bg-canvas p-7 transition-colors hover:bg-inset sm:p-9"
            >
              <div>
                <p className="eyebrow text-accent">{route.kicker}</p>
                <h2 className="mt-4 font-display text-2xl text-text-1">{route.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-text-2">{route.body}</p>
              </div>
              <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                {route.action}
                <ArrowRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </Band>

      <Band tone="raised" size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={img.jobsFocus}
              alt="Marketers in a professional lounge conversation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHead
              align="stacked"
              kicker="What we do not promise"
              title="No guaranteed placement."
              lede="SMN does not guarantee employment. What we do is make you legible to employers: real briefs, portfolio evidence, professional feedback, and a network that can vouch for the work."
            />
          </div>
        </div>
      </Band>

      <CtaBand
        kicker="For employers"
        title="Hiring marketers?"
        lede="Share roles, request interns, host an Experience placement, or hire SMN talent with portfolio evidence."
        actions={
          <>
            <Button href={cta.hireTalent.href} variant="light">
              {cta.hireTalent.label}
            </Button>
            <Button href={cta.postJob.href} variant="secondary">
              {cta.postJob.label}
            </Button>
          </>
        }
      />
    </>
  );
}
