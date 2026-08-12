import type { Metadata } from "next";
import Image from "next/image";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { Button } from "@/components/ui/Button";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: "Become a Mentor",
  description: "Mentor marketers in the Social Marketers Network. Staff review every profile before it goes live.",
  alternates: { canonical: "/mentorship/become-a-mentor" },
};

const fit = [
  {
    title: "You have done the work",
    body: "Brand, agency, freelance, or in-house. You can talk about real briefs, not only theory.",
  },
  {
    title: "You can spare a focused hour",
    body: "Portfolio reviews, office hours, or one-to-one guidance. Set availability and pause whenever you need.",
  },
  {
    title: "You give honest notes",
    body: "Members come for a clear read. Kind is required. Vague praise is not useful.",
  },
];

const review = [
  {
    n: "01",
    title: "Apply from the portal",
    body: "Complete your member profile, then submit a mentor application with specialties and how you like to work.",
  },
  {
    n: "02",
    title: "SMN reviews",
    body: "Staff read for experience, clarity, and fit before a profile becomes visible in the directory.",
  },
  {
    n: "03",
    title: "You take requests",
    body: "Members send focused requests. SMN coordinates introductions so your time stays protected.",
  },
];

export default function BecomeMentorPage() {
  return (
    <>
      <CinematicPageHero
        image={img.mentorSupport}
        alt="Two members of the Network in a supportive moment"
        kicker="Give back"
        title="Become a mentor"
        description="If you have real experience, help marketers in the Network grow with clear, honest guidance."
        actions={
          <>
            <Button href="/app/mentors">Apply to mentor</Button>
            <Button href="/signup" variant="secondary">
              Create account
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-2xl font-display text-3xl text-white sm:text-4xl">
            Who this is for
          </h2>
          <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
            {fit.map((item) => (
              <div key={item.title}>
                <h3 className="font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h2 className="font-display text-3xl text-white sm:text-4xl">
              A reviewed directory, not an open listing
            </h2>
            <ol className="mt-8 space-y-0 border-l border-white/10 pl-5">
              {review.map((step) => (
                <li key={step.n} className="relative pb-7 last:pb-0">
                  <span className="absolute -left-[1.4rem] top-1.5 h-2 w-2 rounded-full bg-mint" />
                  <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/35">
                    {step.n}
                  </p>
                  <p className="mt-1.5 font-display text-lg text-white">{step.title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[4/5]">
            <Image
              src={img.mentorListen}
              alt="Two marketers talking through a mentorship session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
            <div className="image-matte" />
          </div>
        </div>
      </section>

      <section className="border-t border-white/10 bg-ink py-16 sm:py-20">
        <div className="container-wide">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-10 md:p-14">
            <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
              Apply from your member account
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Sign in, finish your profile, and submit the mentor application from the directory.
              You will hear from SMN after review.
            </p>
            <div className="btn-row-mobile mt-8">
              <Button href="/app/mentors" variant="light">
                Apply to mentor
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
