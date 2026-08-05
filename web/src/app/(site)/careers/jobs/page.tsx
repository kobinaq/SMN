import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { getPublishedOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Job opportunities",
  description:
    "Browse marketing jobs and gigs from Social Marketers Network and partner employers. Open to the public — sign in to apply.",
  alternates: { canonical: "/careers/jobs" },
};

export default async function CareersJobsPage() {
  const opportunities = (await getPublishedOpportunities().catch(() => [])).filter(
    (item) => item.type !== "Internship",
  );

  return (
    <>
      <PageHero
        eyebrow="Careers · Jobs"
        title="Marketing jobs & gigs."
        description="Browse published roles publicly. Create a member account to apply, track activity, and strengthen your profile for employers."
      />
      <section className="border-t border-white/10 bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide space-y-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <p className="max-w-2xl text-sm text-white/50">
              Listings open in the member portal when you apply. Internships live on a separate board.
            </p>
            <div className="btn-row-mobile">
              <Button href={cta.memberSignUp.href} variant="secondary">
                {cta.memberSignUp.label}
              </Button>
              <Button href={cta.browseInternships.href} variant="ghost">
                View internships
              </Button>
            </div>
          </div>
          {opportunities.length ? (
            <OpportunityDirectory opportunities={opportunities} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-7 sm:p-10">
              <h2 className="font-display text-xl text-white">Listings are being reviewed</h2>
              <p className="mt-2 text-sm text-white/50">
                New roles appear here when SMN publishes them. Employers can share openings anytime.
              </p>
              <div className="btn-row-mobile mt-6">
                <Button href={cta.postJob.href} variant="secondary">
                  {cta.postJob.label}
                </Button>
                <Button href={cta.memberSignUp.href}>{cta.memberSignUp.label}</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
