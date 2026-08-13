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
} from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { excerptStoryQuote } from "@/lib/content";
import { seoTitle } from "@/lib/brand";
import { img } from "@/lib/images";
import { site } from "@/lib/site";
import { getStories } from "@/lib/cms";

export const metadata: Metadata = {
  title: seoTitle("Marketing Community in Ghana"),
  description:
    "Join a growing community of aspiring and professional marketers learning, connecting, finding mentors and discovering opportunities.",
};

export const revalidate = 60;

const whoFor = [
  {
    title: "Starting out",
    body: "Build your foundation, discover your strengths, and stop learning marketing in isolation.",
  },
  {
    title: "Building your career",
    body: "Develop strategic skills, get feedback, and strengthen your professional profile.",
  },
  {
    title: "Already in marketing",
    body: "Stay current, sharpen your thinking, and connect with people across the industry.",
  },
  {
    title: "Building a business",
    body: "Understand marketing better and meet people who can help you grow.",
  },
];

const channels = [
  {
    icon: Sparkles,
    title: "Learn together",
    body: "Discuss marketing ideas, industry changes, tools, and trends.",
  },
  {
    icon: MessageCircle,
    title: "Ask questions",
    body: "Get perspectives from other members and experienced professionals.",
  },
  {
    icon: Handshake,
    title: "Find mentors",
    body: "Connect with people who can help you navigate your career.",
  },
  {
    icon: Briefcase,
    title: "Discover opportunities",
    body: "Access relevant jobs, internships, projects, and industry opportunities.",
  },
  {
    icon: Users,
    title: "Build relationships",
    body: "Meet people who could become collaborators, colleagues, clients, or friends.",
  },
  {
    icon: CalendarDays,
    title: "Keep growing",
    body: "Stay connected to learning long after you have completed a course.",
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
  const communityStories = stories.slice(0, 4);
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
                You should not have to figure out your marketing career alone
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60 sm:mt-5 sm:text-base md:text-lg">
                The Social Marketers Network is a community for people learning, working, and
                growing in marketing. A place to ask questions, exchange ideas, find mentors,
                discover opportunities, and build relationships with people who understand the
                industry you are navigating.
              </p>
              <div className="btn-row-mobile mt-8 sm:mt-10">
                <Button href={site.whatsappInvite} target="_blank" rel="noreferrer">
                  Join the Network
                </Button>
                <Button href="/events" variant="secondary">
                  See upcoming events
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
                  alt="Two SMN members sitting together"
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
                    alt="Members in a focused table conversation"
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                  <div className="image-matte" />
                </div>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl sm:rounded-[1.5rem]">
                  <Image
                    src={img.communityEvent}
                    alt="Two members at an SMN gathering"
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
          <h2 className="max-w-2xl font-display text-2xl text-white sm:text-3xl md:text-4xl">
            Built for people learning, working, and growing in marketing
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
              <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
                What happens inside the Network?
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
              alt="Networking during an SMN session"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="image-matte" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
              The marketing community you wish you had started with.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/65 sm:mt-5 sm:text-base">
              Whether you are taking your first steps into marketing or have years of experience,
              there is room for you here. Helpful, honest, and serious about growth.
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
          <h2 className="max-w-xl font-display text-2xl text-white sm:text-3xl md:text-4xl">
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
        </div>
      </section>

      {communityStories.length ? (
        <section className="bg-near-black py-16 sm:py-24">
          <div className="container-wide">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
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
            <div className="mt-10 grid gap-5 sm:mt-12 md:grid-cols-2">
              {communityStories.map((story) => (
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
                    “{excerptStoryQuote(story.quote)}”
                  </blockquote>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Pathways */}
      <section className="border-t border-white/10 bg-ink py-16 sm:py-24">
        <div className="container-wide">
          <h2 className="max-w-xl font-display text-2xl text-white sm:text-3xl md:text-4xl">
            Community is the base. Learning goes further.
          </h2>
          <div className="mt-10 grid gap-4 sm:mt-12 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {[
              {
                title: "Flagship training",
                body: "Live Social Media Marketing and AI with practice, portfolio work, and community.",
                href: "/programs/cohort",
                cta: "View training",
              },
              {
                title: "Events",
                body: "Webinars, workshops, and community gatherings announced first in the Network.",
                href: "/events",
                cta: "See upcoming events",
              },
              {
                title: "Mentorship",
                body: "Guidance from people already doing the work. Bring one clear question.",
                href: "/mentorship",
                cta: "How mentorship works",
              },
              {
                title: "Free resources",
                body: "Templates, frameworks, and prompts you can use this week.",
                href: "/resources",
                cta: "Explore free resources",
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
              <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
                You should not have to figure marketing out alone
              </h2>
              <p className="mt-4 max-w-xl text-sm text-white/70 sm:text-base">
                Come introduce yourself, ask a question, or share what you are building. The Network
                is ready when you are.
              </p>
            </div>
            <div className="btn-row-mobile lg:justify-end">
              <Button href={site.whatsappInvite} target="_blank" rel="noreferrer" variant="light">
                Join SMN
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
