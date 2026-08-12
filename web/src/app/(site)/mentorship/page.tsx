import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Button } from "@/components/ui/Button";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Mentorship",
  description:
    "Get guidance from brand marketers, agency leaders, consultants, and alumni in the Social Marketers Network.",
  alternates: { canonical: "/mentorship" },
};

const sessions = [
  {
    title: "Portfolio review",
    body: "Walk through a case study with someone who hires or briefs marketers. Leave with a clearer story, not a pile of vague compliments.",
  },
  {
    title: "Career question",
    body: "Stuck on positioning, a role change, or what to learn next? Bring one decision. Get a direct read from someone who has made it.",
  },
  {
    title: "Stuck campaign",
    body: "A live brief, a quiet channel, or a client who will not lock a goal. Mentors help you choose the next move, not a new template.",
  },
];

const steps = [
  {
    n: "01",
    title: "Browse approved mentors",
    body: "The directory is staff-reviewed. Filter by specialty and how they like to work.",
  },
  {
    n: "02",
    title: "Send a focused request",
    body: "From your member account, say the topic, the goal, and the format you need.",
  },
  {
    n: "03",
    title: "SMN coordinates",
    body: "We review the request and make the introduction so the time stays useful for both sides.",
  },
];

export default function MentorshipPage() {
  return (
    <>
      <CinematicPageHero
        image={img.communityCollab}
        alt="Marketers collaborating during an SMN session"
        kicker="Mentorship"
        title="Guidance from people who have done the work."
        description="Brand marketers, agency leads, consultants, founders, and alumni. You bring a real question. They help you move."
        actions={
          <>
            <Button href="/app/mentors">Browse mentors</Button>
            <Button href="/mentorship/become-a-mentor" variant="secondary">
              Become a mentor
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl md:text-5xl">
              What a session is for
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55 sm:text-base">
              Mentorship at SMN is not a lecture series. It is a working conversation about one
              problem you actually have.
            </p>
          </div>
          <div className="space-y-0 border-t border-white/10">
            {sessions.map((item) => (
              <article key={item.title} className="border-b border-white/10 py-6 sm:py-7">
                <h3 className="font-display text-xl text-white sm:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/60">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[5/4]">
            <Image
              src={img.communityEvent}
              alt="SMN community session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">How it works</h2>
            <ol className="mt-8 space-y-0 border-l border-white/10 pl-5">
              {steps.map((step) => (
                <li key={step.n} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-baby-blue" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                    {step.n}
                  </p>
                  <p className="mt-1.5 font-display text-lg text-white">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-20">
        <div className="container-wide">
          <div className="grid gap-8 overflow-hidden rounded-2xl border border-white/10 bg-surface p-6 sm:rounded-[2rem] sm:p-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <h2 className="font-display text-2xl text-white sm:text-3xl">Find your mentor</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                The directory lives in the member portal so requests stay relevant and easy to
                coordinate. Create an account if you do not have one yet.
              </p>
            </div>
            <div className="btn-row-mobile lg:justify-end">
              <Button href="/app/mentors">Browse mentors</Button>
              <Button href="/signup" variant="secondary">
                Create account
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
