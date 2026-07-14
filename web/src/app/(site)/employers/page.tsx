import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Employers & partners",
  description:
    "Hire SMN talent, review portfolios, verify credentials, share opportunities, and partner with Social Marketers Network.",
  alternates: { canonical: "/employers" },
};

const offers = [
  "Discover marketers trained in strategy, research, brand, campaigns, and analytics",
  "Review portfolio evidence and public member profiles",
  "Verify credentials via SMN certificate links",
  "Share roles, internships, and project opportunities",
  "Partner on live client projects and marketing challenges",
  "Sponsor events or deliver guest sessions",
  "Mentor members through SMN mentorship",
];

export default function EmployersPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers & partners"
        title="Hire SMN talent and shape the next generation of marketers."
        description="SMN develops marketers with practical skills and proof of work. Use this page to hire, share opportunities, or partner — not to apply to a cohort."
      />
      <section className="border-t border-white/10 bg-ink py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">What employers get</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              {offers.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/45">
              We do not guarantee employment outcomes. We help members prepare for work and make it
              easier for brands to meet strong marketing talent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href="#employer-form">{cta.hireTalent.label}</Button>
              <Button href={cta.shareOpportunity.href} variant="secondary">
                {cta.shareOpportunity.label}
              </Button>
              <Button href="/contact" variant="ghost">
                {cta.partner.label}
              </Button>
            </div>
          </div>
          <div
            id="employer-form"
            className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8"
          >
            <h3 className="font-display text-2xl text-white">Hire or partner request</h3>
            <p className="mt-2 text-sm text-white/55">
              Tell us what you need. This is an employer enquiry — not a member application.
            </p>
            <div className="mt-6">
              <ContactForm defaultType="Talent request" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
