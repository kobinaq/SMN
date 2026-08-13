import type { Metadata } from "next";
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
  "Employment type: full-time, contract, freelance, or project",
  "What success looks like in the first 30 to 90 days",
  "Application link or how you want candidates to respond",
];

export default function PostJobPage() {
  return (
    <section className="border-b border-white/10 bg-ink pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
      <div className="container-wide grid gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue">Partners</p>
          <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Post a marketing role to the Network.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Share openings with marketers who train for strategy, campaigns, and proof of work.
            Staff review listings before they appear on the public careers board.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/70">
            {tips.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
          className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-8 md:p-10"
        >
          <h2 className="font-display text-2xl text-white">Job posting request</h2>
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
  );
}
