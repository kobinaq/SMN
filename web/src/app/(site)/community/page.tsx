import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Handshake,
  MessageCircle,
  Sparkles,
  Users,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { getStories } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Join the Social Marketers Network WhatsApp community. Feedback, accountability, opportunities, and people who get it.",
};

const whoFor = [
  {
    title: "Beginners",
    body: "Starting out and tired of learning alone. Get direction, language, and people who have been where you are.",
  },
  {
    title: "Social media managers",
    body: "You already post. You want strategy, feedback, and a network that helps you level up past content execution.",
  },
  {
    title: "Freelancers & creatives",
    body: "Build systems, position your offer, and meet peers who take the craft seriously.",
  },
  {
    title: "Marketers & business owners",
    body: "Stay sharp on AI, social, and growth. Share problems, get honest takes, keep learning.",
  },
];

const channels = [
  {
    icon: MessageCircle,
    title: "Daily conversation",
    body: "Ask questions, share wins, drop work-in-progress. Fast feedback from people who speak marketing.",
  },
  {
    icon: Sparkles,
    title: "Feedback & critique",
    body: "Campaigns, captions, calendars, and portfolios. Get specific notes, not empty praise.",
  },
  {
    icon: CalendarDays,
    title: "Events & sessions",
    body: "Webinars, workshops, and live drop-ins announced first in community so you never miss a seat.",
  },
  {
    icon: Briefcase,
    title: "Opportunities",
    body: "Roles, freelance leads, collabs, and calls for talent when members and partners share openings.",
  },
  {
    icon: Users,
    title: "Accountability",
    body: "Weekly energy to ship. Find partners for practice projects and stay consistent.",
  },
  {
    icon: Handshake,
    title: "Mentor moments",
    body: "Office hours, AMAs, and guidance from experienced marketers, including Arielle and guests.",
  },
];

const principles = [
  {
    title: "Be useful",
    body: "Share what worked, what failed, and what you learned. Help others move faster.",
  },
  {
    title: "Be kind, stay sharp",
    body: "Honest feedback is welcome. Personal attacks and spam are not.",
  },
  {
    title: "No spam pitches",
    body: "Build relationships first. Cold promo dumps get removed.",
  },
  {
    title: "Show your work",
    body: "Drafts and works-in-progress are encouraged. That is how people improve.",
  },
];

const steps = [
  {
    step: "01",
    title: "Join WhatsApp",
    body: "Tap the invite, introduce yourself, and say what you are working on right now.",
  },
  {
    step: "02",
    title: "Show up weekly",
    body: "Ask one question, share one piece of work, or help someone else. Consistency compounds.",
  },
  {
    step: "03",
    title: "Go deeper",
    body: "Come to events, grab free resources, or apply to the cohort when you are ready for live training.",
  },
];

export default async function CommunityPage() {
  const stories = await getStories();
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10 bg-near-black pt-[calc(5.5rem+env(safe-area-inset-top))] pb-14 sm:pt-32 sm:pb-20 md:pt-36 md:pb-24">
        <div className="container-wide">
          <div className="grid items-end gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-baby-blue sm:text-xs">
                Community
              </p>
              <h1 className="mt-3 max-w-2xl font-display text-[1.85rem] leading-tight text-white sm:mt-4 sm:text-4xl md:text-5xl lg:text-6xl">
                The room marketers wish they had earlier
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-5 sm:text-base md:text-lg">
                Social Marketers Network is more than classes. It is a living WhatsApp community for
                beginners, social managers, freelancers, and marketers who want strategy, practice,
                and people in their corner.
              </p>
              <div className="btn-row-mobile mt-8 sm:mt-10">
                <Button href={site.whatsappInvite} target="_blank" rel="noreferrer">
                  Join WhatsApp
                </Button>
                <Button href="/apply" variant="secondary">
                  Apply to cohort
                </Button>
              </div>
              <p className="mt-5 text-xs text-white/35 sm:text-sm">
                Free to join · Cohort members get private groups after acceptance
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl sm:rounded-[1.5rem]">
                <Image
                  src={img.communityPortrait}
                  alt="SMN community member"
                  fill
                  className="object-cover"
                  sizes="40vw"
                  priority
                />
                <div className="image-matte" />
              </div>
              <div className="mt-6 grid gap-3 sm:mt-10 sm:gap-4">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[1.5rem]">
                  <Image
                    src={img.communityCollab}
                    alt="Members collaborating"
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                  <div className="image-matte" />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[1.5rem]">
                  <Image
                    src={img.communityEvent}
                    alt="Community event"
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                  <div className="image-matte" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-white/10 bg-ink">
        <div className="container-wide grid grid-cols-2 gap-6 py-8 sm:grid-cols-4 sm:gap-4 sm:py-10">
          {[
            { label: "Home base", value: "WhatsApp" },
            { label: "Focus", value: "Strategy + AI" },
            { label: "For", value: "Marketers at every stage" },
            { label: "Vibe", value: "Helpful, not hype" },
          ].map((item) => (
            <div key={item.label} className="text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/35 sm:text-xs">
                {item.label}
              </p>
              <p className="mt-2 font-display text-lg text-white sm:text-xl">{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Who it's for */}
      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
            Who thrives here
          </p>
          <h2 className="mt-3 max-w-2xl font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
            Built for people who take marketing seriously
          </h2>
          <div className="mt-8 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
            {whoFor.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-surface p-5 sm:rounded-[1.5rem] sm:p-6"
              >
                <h3 className="font-display text-lg text-white sm:text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What you get */}
      <section className="border-y border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
                Inside WhatsApp
              </p>
              <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
                What actually happens in the community
              </h2>
            </div>
            <p className="max-w-sm text-sm text-white/50">
              Not a silent group. A working room for questions, drafts, and real marketing work.
            </p>
          </div>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
            {channels.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-surface p-5 transition hover:border-baby-blue/30 sm:rounded-[1.5rem] sm:p-6"
              >
                <item.icon className="h-5 w-5 text-baby-blue" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Culture + image */}
      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[2rem] lg:aspect-[5/4]">
            <Image
              src={img.communityCulture}
              alt="Learning together in the Network"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
              Culture
            </p>
            <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
              Helpful, honest, and serious about growth
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:mt-5 sm:text-base">
              SMN exists because marketing careers move faster with community. We celebrate wins,
              critique work with care, and stay curious about strategy and AI without the noise.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {principles.map((p) => (
                <div key={p.title} className="rounded-2xl border border-white/10 bg-surface p-4 sm:p-5">
                  <h3 className="font-display text-base text-white">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/55">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to join */}
      <section className="border-y border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
            Get started
          </p>
          <h2 className="mt-3 max-w-xl font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
            Three simple steps
          </h2>
          <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/10 bg-surface p-6 sm:rounded-[1.5rem] sm:p-8"
              >
                <p className="font-display text-sm text-baby-blue">{item.step}</p>
                <h3 className="mt-3 font-display text-xl text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{item.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:mt-12 sm:flex-row sm:items-center">
            <Button href={site.whatsappInvite} target="_blank" rel="noreferrer">
              Join the WhatsApp community
            </Button>
            <Button href="/events" variant="secondary">
              See upcoming events
            </Button>
          </div>
        </div>
      </section>

      {/* Member voices — published only */}
      <section className="bg-near-black py-16 sm:py-24">
        <div className="container-wide">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
                Member voices
              </p>
              <h2 className="mt-3 font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
                What people say about the room
              </h2>
            </div>
            <Link
              href="/stories"
              className="inline-flex items-center gap-1.5 text-sm text-baby-blue transition hover:text-white"
            >
              More stories <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {stories.length ? (
            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2">
              {stories.map((story) => (
                <figure
                  key={story.name}
                  className="rounded-2xl border border-white/10 bg-surface p-5 sm:rounded-[1.75rem] sm:p-7"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-14 w-14 overflow-hidden rounded-full border border-white/10">
                      <Image
                        src={story.image}
                        alt={story.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div>
                      <figcaption className="font-display text-lg text-white">{story.name}</figcaption>
                      <p className="text-sm text-white/45">{story.role}</p>
                    </div>
                  </div>
                  <blockquote className="mt-5 text-sm leading-relaxed text-white/70 sm:text-base">
                    “{story.quote}”
                  </blockquote>
                </figure>
              ))}
            </div>
          ) : (
            <p className="mt-10 max-w-2xl text-sm text-white/55">
              Published member testimonials will appear here once confirmed in the CMS. Until then,
              join the community and meet people directly.
            </p>
          )}
        </div>
      </section>

      {/* Pathways */}
      <section className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
            Keep going
          </p>
          <h2 className="mt-3 max-w-xl font-display text-2xl text-white sm:mt-4 sm:text-3xl md:text-4xl">
            Community is the base. Learning goes further.
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-3 sm:gap-5">
            {[
              {
                title: "Flagship cohort",
                body: "Live Social Media Marketing & AI with practice, portfolio work, and community.",
                href: "/programs/cohort",
                cta: "View cohort",
              },
              {
                title: "Free resources",
                body: "Templates, prompts, and checklists you can use this week.",
                href: "/resources",
                cta: "Browse library",
              },
              {
                title: "Insights",
                body: "Strategy, AI, and career notes from Arielle and the Network.",
                href: "/insights",
                cta: "Read the blog",
              },
            ].map((card) => (
              <Link
                key={card.href}
                href={card.href}
                className="group flex flex-col rounded-2xl border border-white/10 bg-surface p-6 transition hover:border-baby-blue/35 sm:rounded-[1.5rem] sm:p-7"
              >
                <h3 className="font-display text-xl text-white group-hover:text-baby-blue">
                  {card.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{card.body}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-baby-blue">
                  {card.cta}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-near-black py-16 sm:py-20">
        <div className="container-wide overflow-hidden rounded-2xl border border-white/10 bg-deep-blue p-6 sm:rounded-[2rem] sm:p-10 md:p-14">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-[10px] uppercase tracking-[0.22em] text-baby-blue sm:text-xs">
                Join today
              </p>
              <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl md:text-4xl">
                You do not have to figure marketing out alone
              </h2>
              <p className="mt-4 max-w-xl text-sm text-white/70 sm:text-base">
                Come introduce yourself, ask a question, or share what you are building. The Network
                is ready when you are.
              </p>
            </div>
            <div className="btn-row-mobile lg:justify-end">
              <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="light">
                Join WhatsApp
              </Button>
              <Button href="/contact" variant="secondary">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
