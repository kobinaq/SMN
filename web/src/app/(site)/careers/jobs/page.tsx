import type { Metadata } from "next";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { Band, Masthead, Placeholder, SectionHead } from "@/components/site/kit";
import { cta } from "@/lib/cta";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";
import { getPublishedOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: seoTitle("Social Media Marketing Jobs & Internships Ghana"),
  description:
    "Browse marketing jobs, gigs, and internships from Social Marketers Network and partner employers. Open to the public. Sign in to apply.",
  alternates: { canonical: "/careers/jobs" },
};

/**
 * One board for every opening. Internships used to live on their own page,
 * which split the listings in two and left both halves looking empty — they
 * are a filter here instead, preselected by `?type=Internship`.
 */
export default async function CareersJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;
  const opportunities = await getPublishedOpportunities().catch(() => []);
  const internships = type === "Internship";

  return (
    <>
      <Masthead
        image={internships ? img.internPath : img.jobsFocus}
        alt="Marketers in a professional lounge conversation"
        kicker={internships ? "Careers · Internships" : "Careers · Jobs"}
        title={internships ? "Internships and placements." : "Marketing jobs and internships."}
        lede="Browse published roles publicly. Create a member account to apply, track activity, and strengthen your profile. Training and Experience help you show proof of work."
        actions={
          <>
            <Button href={cta.memberSignUp.href}>{cta.memberSignUp.label}</Button>
            <Button href={cta.requestIntern.href} variant="secondary">
              {cta.requestIntern.label}
            </Button>
          </>
        }
        meta="We do not guarantee employment. Placements depend on fit, readiness, and partner availability."
      />

      <Band size="lg">
        <div className="grid gap-10 rule pt-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-text-1">For learners</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
              Use internships and Experience placements to build workplace proof: briefs, campaigns,
              and collaboration, while you train in the Academy. Placements are not guaranteed.
            </p>
          </div>
          <div>
            <h2 className="font-display text-2xl text-text-1">For employers</h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2">
              Request an SMN intern for content, social, research, or campaign support, or host an
              Experience placement. Placements work best with a defined scope and a named contact.
            </p>
          </div>
        </div>
      </Band>

      <Band tone="raised" size="lg">
        <SectionHead
          align="stacked"
          kicker="Open listings"
          title="What is on the board"
          lede="Apply from a member account. Filter by type to see internships only."
        />
        <div className="mt-10">
          {opportunities.length ? (
            <OpportunityDirectory
              opportunities={opportunities}
              hrefPrefix="/careers/jobs"
              initialType={internships ? "Internship" : undefined}
            />
          ) : (
            <Placeholder
              title="Listings are being reviewed"
              body="New roles appear here when SMN publishes them. Employers can share openings at any time."
              actions={
                <>
                  <Button href={cta.postJob.href}>{cta.postJob.label}</Button>
                  <Button href={cta.memberSignUp.href} variant="secondary">
                    {cta.memberSignUp.label}
                  </Button>
                </>
              }
            />
          )}
        </div>
      </Band>
    </>
  );
}
