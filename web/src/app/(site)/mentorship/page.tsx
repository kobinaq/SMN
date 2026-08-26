import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Band, CtaBand, Masthead, SectionHead, Sequence } from "@/components/site/kit";
import { menteeTopics, seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";

export const metadata: Metadata = {
  title: seoTitle("Marketing Mentorship"),
  description:
    "Learn from people already doing the work. SMN connects mentees with experienced marketing professionals, and reviews every mentor before they appear in the directory.",
  alternates: { canonical: "/mentorship" },
};

const sessions = [
  {
    title: "Career decisions",
    body: "Stuck on positioning, a role change, or what to learn next? Bring one decision.",
  },
  {
    title: "Marketing skills",
    body: "A live brief, a quiet channel, or a client who will not lock a goal.",
  },
  {
    title: "Portfolio development",
    body: "Walk through a case study with someone who hires or briefs marketers.",
  },
  {
    title: "Personal branding",
    body: "Get a clearer read on how you present your skills and the work you want next.",
  },
  {
    title: "Freelancing",
    body: "Offers, rates, client communication, and how to hold a professional relationship.",
  },
  {
    title: "Professional development",
    body: "What to learn next, and how to grow without collecting another unused course.",
  },
  {
    title: "Navigating the marketing industry",
    body: "The work rarely follows a straight line. Mentors help you choose the next move.",
  },
];

const steps = [
  {
    title: "Browse approved mentors",
    body: "The directory is staff-reviewed. Filter by specialty and how they like to work.",
  },
  {
    title: "Send a focused request",
    body: "From your member account, say the topic, the goal, and the format you need.",
  },
  {
    title: "SMN coordinates",
    body: "We review the request and make the introduction so the time stays useful for both sides.",
  },
];

const mentorFit = [
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

const mentorReview = [
  {
    title: "Apply from the portal",
    body: "Complete your member profile, then submit a mentor application with specialties and how you like to work.",
  },
  {
    title: "SMN reviews",
    body: "Staff read for experience, clarity, and fit before a profile becomes visible in the directory.",
  },
  {
    title: "You take requests",
    body: "Members send focused requests. SMN coordinates introductions so your time stays protected.",
  },
];

export default function MentorshipPage() {
  return (
    <>
      <Masthead
        image={img.mentorshipPair}
        alt="Mentor and member sitting together"
        kicker="Mentorship"
        title="Learn from people already doing the work."
        lede="Marketing careers rarely follow a straight line. Sometimes what you need is not another course. It is a conversation with someone who has already been where you are trying to go."
        actions={
          <>
            <Button href="/app/mentors">Find a mentor</Button>
            <Button href="#become-a-mentor" variant="secondary">
              Become a mentor
            </Button>
          </>
        }
      />

      <Band size="lg">
        <SectionHead
          kicker="For mentees"
          title="Bring one real question."
          lede="SMN connects mentees with experienced professionals who can offer perspective and practical advice on the things that actually stall a marketing career."
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <ul className="space-y-3">
            {menteeTopics.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-text-2">
                <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <div className="border-t border-edge-subtle">
            {sessions.map((item) => (
              <article key={item.title} className="border-b border-edge-subtle py-6">
                <h3 className="font-display text-xl text-text-1 sm:text-2xl">{item.title}</h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-2">{item.body}</p>
              </article>
            ))}
          </div>
        </div>
      </Band>

      <Band tone="raised" size="lg">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[5/4] overflow-hidden">
            <Image
              src={img.mentorshipTalk}
              alt="Two marketers in a one-to-one mentorship conversation"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <SectionHead align="stacked" kicker="How it works" title="Three steps, staff-coordinated." />
            <Sequence className="mt-8" items={steps} />
          </div>
        </div>
      </Band>

      <Band id="become-a-mentor" tone="light" size="lg" className="scroll-mt-24">
        <SectionHead
          kicker="Give back"
          title="Become a mentor."
          lede="If you have real experience, help marketers in the Network grow with clear, honest guidance. This is a reviewed directory, not an open listing."
          actions={<Button href="/app/mentors">Apply to mentor</Button>}
        />

        <div className="mt-14 grid gap-px overflow-hidden border border-edge-subtle bg-edge-subtle md:grid-cols-3">
          {mentorFit.map((item) => (
            <div key={item.title} className="bg-canvas p-7">
              <h3 className="font-display text-xl text-text-1">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-2">{item.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <h3 className="font-display display-3 text-text-1">How review works</h3>
            <Sequence className="mt-6" items={mentorReview} />
          </div>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image
              src={img.mentorListen}
              alt="Two marketers talking through a mentorship session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          </div>
        </div>
      </Band>

      <CtaBand
        kicker="Both sides"
        title="Find a mentor, or become one."
        lede="The directory lives in the member portal so requests stay relevant and easy to coordinate. Mentors apply separately and are reviewed by SMN before they appear."
        actions={
          <>
            <Button href="/app/mentors" variant="light">
              Find a mentor
            </Button>
            <Button href="/signup" variant="secondary">
              Create member account
            </Button>
          </>
        }
      />
    </>
  );
}
