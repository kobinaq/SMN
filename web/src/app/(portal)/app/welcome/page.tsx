import { ArrowRight } from "@/components/ui/icons";
import { WhatsAppUpdatesLink } from "@/components/join/WhatsAppUpdatesLink";
import { Button } from "@/components/ui/Button";
import { Card, Eyebrow } from "@/components/ui/Surface";
import { memberDisplayName, requireMember } from "@/lib/auth/member";
import { pageTitle } from "@/lib/brand";
import { getSiteSettings } from "@/lib/cms";
import { cta } from "@/lib/cta";
import {
  firstRunAreas,
  firstRunCohortBody,
  firstRunCohortTitle,
  firstRunCopy,
  firstRunTitle,
} from "@/lib/pages/join";

export const metadata = {
  title: pageTitle(firstRunCopy.metaTitle),
};

/** First-run screen after Join TSA: what a new member can do now. */
export default async function MemberWelcomePage() {
  const member = await requireMember("/app/welcome");
  const site = await getSiteSettings();
  const name = memberDisplayName(member);

  return (
    <div className="space-y-8">
      <section className="rise">
        <Eyebrow>{firstRunCopy.eyebrow}</Eyebrow>
        <h1 className="mt-3 font-display text-2xl text-text-1 sm:text-3xl md:text-4xl">{firstRunTitle(name)}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-text-2 sm:text-base">{firstRunCopy.intro}</p>
      </section>

      <section aria-labelledby="first-run-areas-heading">
        <h2 id="first-run-areas-heading" className="font-display text-xl text-text-1">
          {firstRunCopy.areasHeading}
        </h2>
        <ul className="rise-stagger mt-4 grid gap-3 sm:grid-cols-2">
          {firstRunAreas.map((area, index) => (
            <li key={area.key} style={{ "--i": index } as React.CSSProperties}>
              <Card href={area.href} className="h-full">
                <h3 className="font-display text-lg text-text-1 transition-colors group-hover:text-accent">
                  {area.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{area.body}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-accent">
                  {area.cta}
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <Card as="section" className="border-accent/25">
        <Eyebrow>{firstRunCopy.cohortEyebrow}</Eyebrow>
        <h2 className="mt-2 font-display text-xl text-text-1">{firstRunCohortTitle(site.cohort)}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">{firstRunCohortBody(site.cohort)}</p>
        <div className="btn-row-mobile mt-5">
          <Button href={cta.applyCohort.href} variant="secondary">
            {cta.applyCohort.label}
          </Button>
          <Button href={cta.viewCohort.href} variant="ghost">
            {cta.viewCohort.label}
          </Button>
        </div>
      </Card>

      <Card as="section">
        <h2 className="font-display text-xl text-text-1">{firstRunCopy.profileHeading}</h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-2">{firstRunCopy.profileBody}</p>
        <div className="btn-row-mobile mt-5">
          <Button href="/app/profile">{firstRunCopy.profileLabel}</Button>
          <Button href="/app" variant="secondary">
            {firstRunCopy.homeLabel}
          </Button>
        </div>
        <div className="mt-4">
          <WhatsAppUpdatesLink href={site.whatsappInvite} />
        </div>
      </Card>
    </div>
  );
}
