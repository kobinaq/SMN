import type { Metadata } from "next";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";
import { img } from "@/lib/images";
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
      <CinematicPageHero
        image={img.internPath}
        alt="Two emerging marketers talking in the lounge"
        kicker="Careers · Internships"
        title="Internship pathways for emerging marketers."
        description="Browse briefs openly. Members apply from the portal. Employers can request SMN interns for scoped campaign work."
        size="compact"
        actions={
          <>
            <Button href={cta.memberSignUp.href}>{cta.memberSignUp.label}</Button>
            <Button href={cta.requestIntern.href} variant="secondary">
              {cta.requestIntern.label}
            </Button>
          </>
        }
      />
      <section className="bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide space-y-10">
          <div className="grid gap-10 border-y border-white/10 py-10 lg:grid-cols-2 lg:gap-16">
            <div>
              <h2 className="font-display text-2xl text-white">For learners</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Use internships to build workplace proof: briefs, campaigns, and collaboration,
                while you train in the Academy.
              </p>
            </div>
            <div>
              <h2 className="font-display text-2xl text-white">For employers</h2>
              <p className="mt-3 text-sm leading-relaxed text-white/55">
                Request an SMN intern for content, social, research, or campaign support. Placements
                work best with a defined scope and a named point of contact.
              </p>
            </div>
          </div>

          {opportunities.length ? (
            <OpportunityDirectory
              opportunities={opportunities}
              hrefPrefix="/careers/jobs"
            />
          ) : (
            <EmptyProof
              title="Internship listings coming soon"
              body="Published internship roles will appear here. Employers can request an intern now."
              href={cta.requestIntern.href}
              label={cta.requestIntern.label}
              secondaryHref={cta.browseJobs.href}
              secondaryLabel={cta.browseJobs.label}
            />
          )}
        </div>
      </section>
    </>
  );
}
