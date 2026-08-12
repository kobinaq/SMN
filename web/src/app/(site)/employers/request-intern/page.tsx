import type { Metadata } from "next";
import { ContactForm } from "@/components/forms/ContactForm";
import { Button } from "@/components/ui/Button";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Request an Intern",
  description:
    "Request a Social Marketers Network intern for campaigns, content, research, or social support.",
  alternates: { canonical: "/employers/request-intern" },
};

const needs = [
  "Role focus, duration, and location or remote preference",
  "Must-have skills and the work they will actually do",
  "A named point of contact and a habit of giving feedback",
  "A defined scope. Internships fail when the brief is “help with social”",
];

export default function RequestInternPage() {
  return (
    <section className="border-b border-white/10 bg-ink pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
      <div className="container-wide grid gap-12 py-14 sm:py-20 lg:grid-cols-2 lg:gap-16">
        <div>
          <p className="font-display text-sm tracking-[0.08em] text-baby-blue">Employers</p>
          <h1 className="mt-4 font-display text-4xl text-white sm:text-5xl md:text-6xl">
            Request an SMN intern for your next campaign.
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/60 sm:text-base">
            Tell us the role, timeline, and skills you need. We match motivated marketers from the
            Network. Placements are not guaranteed.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-white/70">
            {needs.map((item) => (
              <li key={item} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
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
          className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-8 md:p-10"
        >
          <h2 className="font-display text-2xl text-white">Intern request</h2>
          <p className="mt-2 text-sm text-white/55">
            Include role focus, duration, location or remote preference, and any must-have skills.
          </p>
          <div className="mt-6">
            <ContactForm defaultType="Intern request" />
          </div>
        </div>
      </div>
    </section>
  );
}
