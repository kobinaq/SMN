import type { Metadata } from "next";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
import { getPublishedOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Job opportunities",
  description:
    "Browse marketing jobs and gigs from Social Marketers Network and partner employers. Open to the public. Sign in to apply.",
  alternates: { canonical: "/careers/jobs" },
};

export default async function CareersJobsPage() {
  const opportunities = (await getPublishedOpportunities().catch(() => [])).filter(
    (item) => item.type !== "Internship",
  );

  return (
    <>
      <CinematicPageHero
        image={img.resBrief}
        alt="Campaign brief checklist"
        kicker="Careers · Jobs"
        title="Marketing jobs and gigs."
        description="Browse published roles publicly. Create a member account to apply, track activity, and strengthen your profile."
        size="compact"
        actions={
          <>
            <Button href={cta.memberSignUp.href}>{cta.memberSignUp.label}</Button>
            <Button href={cta.browseInternships.href} variant="secondary">
              View internships
            </Button>
          </>
        }
      />
      <section className="bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide space-y-8">
          <p className="max-w-2xl text-sm text-white/50">
            Apply from a member account. Internships live on a separate board.
          </p>
          {opportunities.length ? (
            <OpportunityDirectory
              opportunities={opportunities}
              hrefPrefix="/careers/jobs"
            />
          ) : (
            <EmptyProof
              title="Listings are being reviewed"
              body="New roles appear here when SMN publishes them. Employers can share openings anytime."
              href={cta.postJob.href}
              label={cta.postJob.label}
              secondaryHref={cta.memberSignUp.href}
              secondaryLabel={cta.memberSignUp.label}
            />
          )}
        </div>
      </section>
    </>
  );
}
