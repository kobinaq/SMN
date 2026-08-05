import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Target, Users, Zap } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { Button } from "@/components/ui/Button";
import { ContactForm } from "@/components/forms/ContactForm";
import { cta } from "@/lib/cta";

export const metadata: Metadata = {
  title: "Marketing Simulations",
  description:
    "Practice real marketing scenarios — campaigns, briefs, and decision-making — open to everyone, not just SMN members.",
  alternates: { canonical: "/simulations" },
};

const scenarios = [
  {
    title: "Campaign war room",
    body: "Respond to a live brief: audience, offer, channel mix, and a one-week content plan under time pressure.",
  },
  {
    title: "Brand crisis desk",
    body: "Triage a public complaint thread, draft responses, and decide what gets escalated versus handled in-public.",
  },
  {
    title: "Growth experiment lab",
    body: "Pick a hypothesis, design a lightweight test, and report what you would measure next.",
  },
];

const steps = [
  {
    icon: Target,
    label: "Pick a scenario",
    body: "Choose a marketing situation that matches the skill you want to stretch.",
  },
  {
    icon: Zap,
    label: "Work the brief",
    body: "Ship decisions and artifacts — not slides for their own sake. Think like a marketer on the clock.",
  },
  {
    icon: Users,
    label: "Get feedback",
    body: "Compare approaches, learn from the network, and carry the proof into your portfolio.",
  },
];

export default function SimulationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Academy · Simulations"
        title="Marketing simulations open to everyone."
        description="Practice strategy, content, and campaign judgment in realistic scenarios. You do not need a member account to explore — join when you want deeper feedback and portfolio tracking."
      />

      <section className="border-t border-white/10 bg-ink py-16 sm:py-20 md:py-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              What you practice
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Real briefs. Real trade-offs. No spectator mode.
            </h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {scenarios.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.5rem] border border-white/10 bg-surface p-6 sm:p-7"
              >
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-near-black py-16 sm:py-20 md:py-24">
        <div className="container-wide">
          <div className="max-w-2xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              How it works
            </p>
            <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">
              Three steps from brief to better judgment.
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <div key={step.label}>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-ink text-baby-blue">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="mt-5 font-display text-xl text-white">{step.label}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-20 md:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              Start with a simulation interest note.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/55 sm:text-base">
              Tell us which scenario you want first. Public access is open — members get structured
              feedback, credentials, and portfolio space when you are ready.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-white/70">
              <li>· Open to learners, freelancers, and career switchers</li>
              <li>· Pairs with cohort training and self-paced courses</li>
              <li>· Built for portfolio-ready decisions, not theory quizzes</li>
            </ul>
            <div className="btn-row-mobile mt-8">
              <Button href={cta.applyCohort.href}>{cta.applyCohort.shortLabel}</Button>
              <Button href={cta.viewCourses.href} variant="secondary">
                {cta.viewCourses.label}
              </Button>
            </div>
            <p className="mt-6 text-sm text-white/40">
              Prefer live training?{" "}
              <Link href="/programs" className="text-baby-blue hover:text-white">
                Explore the Academy
                <ArrowRight className="ml-1 inline h-3.5 w-3.5" />
              </Link>
            </p>
          </div>
          <div
            id="simulation-interest"
            className="rounded-[2rem] border border-white/10 bg-surface p-6 md:p-8"
          >
            <h3 className="font-display text-2xl text-white">Register your interest</h3>
            <p className="mt-2 text-sm text-white/55">
              No member account required. We will follow up with the next simulation window.
            </p>
            <div className="mt-6">
              <ContactForm defaultType="General enquiry" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
