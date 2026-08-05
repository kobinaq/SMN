import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Request an Intern",
  description:
    "Request a Social Marketers Network intern for campaigns, content, research, or social support.",
  alternates: { canonical: "/employers/request-intern" },
};

const benefits = [
  "Scoped support from marketers trained in strategy, content, and social systems",
  "Clear briefs and coordination through SMN — not cold outreach spam",
  "Portfolio-minded interns who treat your work as evidence, not busywork",
  "Option to convert strong performers into longer engagements or hires",
];

export default function RequestInternPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers · Internships"
        title="Request an SMN intern for your next campaign."
        description="Tell us the role, timeline, and skills you need. We match motivated marketers from the Network."
      />
      <section className="border-t border-white/10 bg-ink py-16 sm:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">What you get</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              {benefits.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/45">
              Internships work best with a defined scope, a point of contact, and feedback. We do not
              guarantee placements.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.hireTalent.href} variant="secondary">
                {cta.hireTalent.label}
              </Button>
              <Button href={cta.postJob.href} variant="ghost">
                {cta.postJob.label}
              </Button>
            </div>
          </div>
          <div
            id="intern-request-form"
            className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8"
          >
            <h3 className="font-display text-2xl text-white">Intern request</h3>
            <p className="mt-2 text-sm text-white/55">
              Include role focus, duration, location or remote preference, and any must-have skills.
            </p>
            <div className="mt-6">
              <ContactForm defaultType="Intern request" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
