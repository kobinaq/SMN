import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { getPublishedOpportunities } from "@/lib/opportunities";

export const metadata: Metadata = {
  title: "Internships",
  description:
    "Marketing internship opportunities through Social Marketers Network. Browse publicly and apply as a member.",
  alternates: { canonical: "/careers/internships" },
};

export default async function CareersInternshipsPage() {
  const opportunities = (await getPublishedOpportunities().catch(() => [])).filter(
    (item) => item.type === "Internship",
  );

  return (
    <>
      <PageHero
        eyebrow="Careers · Internships"
        title="Internship pathways for emerging marketers."
        description="Browse internship briefs openly. Members apply from the portal; employers can request SMN interns for projects and campaigns."
      />
      <section className="border-t border-white/10 bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide space-y-10">
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl text-white">For learners</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Use internships to build workplace proof — briefs, campaigns, and collaboration —
                while you train in the Academy.
              </p>
              <div className="btn-row-mobile mt-6">
                <Button href={cta.memberSignUp.href}>{cta.memberSignUp.label}</Button>
                <Button href="/programs" variant="secondary">
                  Explore the Academy
                </Button>
              </div>
            </div>
            <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-8">
              <h2 className="font-display text-2xl text-white">For employers</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Request an SMN intern for content, social, research, or campaign support. We help
                match motivated marketers with clear scopes.
              </p>
              <div className="btn-row-mobile mt-6">
                <Button href={cta.requestIntern.href}>{cta.requestIntern.label}</Button>
                <Button href={cta.hireTalent.href} variant="secondary">
                  {cta.hireTalent.label}
                </Button>
              </div>
            </div>
          </div>

          {opportunities.length ? (
            <OpportunityDirectory opportunities={opportunities} />
          ) : (
            <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-7 sm:p-10">
              <h2 className="font-display text-xl text-white">Internship listings coming soon</h2>
              <p className="mt-2 text-sm text-white/50">
                Published internship roles will appear here. Employers can request an intern now.
              </p>
              <div className="btn-row-mobile mt-6">
                <Button href={cta.requestIntern.href} variant="secondary">
                  {cta.requestIntern.label}
                </Button>
                <Button href={cta.browseJobs.href}>Browse other jobs</Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
