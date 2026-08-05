import type { Metadata } from "next";
import { PageHero } from "@/components/layout/PageHero";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Post a Job",
  description:
    "Share a marketing role, freelance brief, or project opportunity with Social Marketers Network.",
  alternates: { canonical: "/employers/post-a-job" },
};

const tips = [
  "Role title, company, and location or remote preference",
  "Employment type — full-time, contract, freelance, or project",
  "What success looks like in the first 30–90 days",
  "Application link or how you want candidates to respond",
];

export default function PostJobPage() {
  return (
    <>
      <PageHero
        eyebrow="Employers · Jobs"
        title="Post a marketing role to the Network."
        description="Share openings with marketers who train for strategy, campaigns, and proof of work — not vanity metrics alone."
      />
      <section className="border-t border-white/10 bg-ink py-16 sm:py-20">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white">What to include</h2>
            <ul className="mt-6 space-y-3 text-white/70">
              {tips.map((item) => (
                <li key={item}>· {item}</li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-white/45">
              Staff review listings before they appear on the public careers board and member
              opportunities feed.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.hireTalent.href} variant="secondary">
                {cta.hireTalent.label}
              </Button>
              <Button href={cta.requestIntern.href} variant="ghost">
                {cta.requestIntern.label}
              </Button>
            </div>
          </div>
          <div
            id="job-posting-form"
            className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8"
          >
            <h3 className="font-display text-2xl text-white">Job posting request</h3>
            <p className="mt-2 text-sm text-white/55">
              Paste the role summary or link. We will follow up if we need more detail before
              publishing.
            </p>
            <div className="mt-6">
              <ContactForm defaultType="Job posting" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
