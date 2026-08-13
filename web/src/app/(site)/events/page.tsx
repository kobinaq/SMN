import type { Metadata } from "next";
import { Suspense } from "react";
import {
  ArrowRight,
  Sparkles,
  Users,
  Video,
  MessageCircle,
} from "@/components/ui/icons";
import { EventCard } from "@/components/events/EventCard";
import { EventTypeNav } from "@/components/events/EventTypeNav";
import { FeaturedEvent } from "@/components/events/FeaturedEvent";
import { CinematicPageHero } from "@/components/layout/CinematicPageHero";
import { EmptyProof } from "@/components/layout/EmptyProof";
import { Button } from "@/components/ui/Button";
import { seoTitle } from "@/lib/brand";
import { eventTypes } from "@/lib/content";
import { formatEventDate, getEventCalendar, getNextEvent } from "@/lib/events";
import { img } from "@/lib/images";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: seoTitle("Marketing Events Ghana"),
  description:
    "Come learn with us. Free webinars, workshops, community events, and industry conversations from Social Marketers Network.",
};

type Props = {
  searchParams: Promise<{ type?: string }>;
};

const formats = [
  {
    icon: Video,
    title: "Webinars",
    body: "Accessible sessions on practical marketing topics.",
  },
  {
    icon: Sparkles,
    title: "Workshops",
    body: "Hands-on learning around specific skills and challenges.",
  },
  {
    icon: Users,
    title: "Community events",
    body: "Spaces for marketers to meet, connect, and share.",
  },
  {
    icon: MessageCircle,
    title: "Industry conversations",
    body: "Conversations with practitioners about the realities and future of marketing.",
  },
];

const expect = [
  {
    title: "Practical, not fluffy",
    body: "You leave with a workflow, a framework, or feedback you can use the same week.",
  },
  {
    title: "Space to ask questions",
    body: "Live Q&A and room to talk about real client and career situations.",
  },
  {
    title: "Connected to the Network",
    body: "Events sit alongside WhatsApp, resources, and the flagship cohort, not isolated one-offs.",
  },
];

export default async function EventsPage({ searchParams }: Props) {
  const { type } = await searchParams;
  const all = await getEventCalendar();
  const active =
    type && eventTypes.includes(type as (typeof eventTypes)[number]) ? type : "All";

  const next = getNextEvent(all);
  const showFeatured = active === "All" && Boolean(next);

  const displayList =
    active === "All"
      ? all.filter((e) => e.slug !== next?.slug)
      : all.filter((e) => e.type === active);

  const counts: Record<string, number> = { All: all.length };
  for (const e of all) {
    counts[e.type] = (counts[e.type] || 0) + 1;
  }

  const freeCount = all.filter((e) => e.price.toLowerCase().includes("free")).length;

  return (
    <>
      <CinematicPageHero
        image={img.eventsGathering}
        alt="Circle discussion during an SMN workshop"
        kicker="Events"
        title="Come learn with us."
        description="From free webinars and workshops to community events and industry conversations, SMN creates spaces where marketers can learn, connect, and exchange ideas."
        actions={
          <>
            {next ? <Button href={`/events/${next.slug}`}>Register for next event</Button> : null}
            <Button
              href={site.whatsappInvite}
              target="_blank"
              rel="noreferrer"
              variant="secondary"
            >
              Join WhatsApp
            </Button>
          </>
        }
      />

      <section className="border-b border-white/10 bg-near-black">
        <div className="container-wide py-8 sm:py-10">
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="rounded-2xl border border-white/10 bg-ink p-4 sm:p-5">
              <p className="font-display text-2xl text-white sm:text-3xl">{all.length}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/40 sm:text-xs">
                upcoming sessions
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink p-4 sm:p-5">
              <p className="font-display text-2xl text-mint sm:text-3xl">{freeCount}</p>
              <p className="mt-1 text-[11px] leading-snug text-white/40 sm:text-xs">
                free or open entry
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-ink p-4 sm:p-5">
              <p className="font-display text-lg leading-tight text-white sm:text-xl">
                {next ? formatEventDate(next.date).split(",")[0] : "TBA"}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-white/40 sm:text-xs">
                next on the calendar
              </p>
            </div>
          </div>
          <div className="mt-8 sm:mt-10">
            <Suspense fallback={<div className="h-10 animate-pulse rounded-full bg-white/5" />}>
              <EventTypeNav counts={counts} />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Featured + list */}
      <section className="bg-ink pb-16 pt-8 sm:pb-24 sm:pt-12 md:pb-28">
        <div className="container-wide space-y-12 sm:space-y-16">
          {showFeatured && next ? <FeaturedEvent event={next} /> : null}

          {displayList.length > 0 ? (
            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3 sm:mb-8">
                <div>
                  <h2 className="font-display text-xl text-white sm:text-2xl">
                    {active === "All" ? "More on the calendar" : active}
                  </h2>
                  <p className="mt-1 text-sm text-white/40">
                    {displayList.length} event{displayList.length === 1 ? "" : "s"}
                    {active === "All" ? " · register via the event link" : ""}
                  </p>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
                {displayList.map((event, i) => (
                  <EventCard key={event.slug} event={event} priority={i < 2} />
                ))}
              </div>
            </div>
          ) : !showFeatured ? (
            <EmptyProof
              title={
                all.length === 0
                  ? "New dates coming soon"
                  : `No ${active.toLowerCase()}s listed yet`
              }
              body={
                all.length === 0
                  ? "Join WhatsApp so you hear about the next webinar or workshop first."
                  : "Check back soon, or browse all upcoming sessions."
              }
              href={all.length === 0 ? site.whatsappInvite : "/events"}
              label={all.length === 0 ? "Join WhatsApp" : "Show all events"}
            />
          ) : null}
        </div>
      </section>

      {/* Formats */}
      <section className="border-y border-white/10 bg-near-black py-16 sm:py-20">
        <div className="container-wide">
            <h2 className="max-w-xl font-display text-2xl text-white sm:text-3xl">
              Event types
            </h2>
            <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5">
            {formats.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/10 bg-ink p-5 sm:rounded-[1.5rem] sm:p-6"
              >
                <item.icon className="h-5 w-5 text-baby-blue" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-lg text-white sm:text-xl">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What to expect */}
      <section className="bg-ink py-16 sm:py-20">
        <div className="container-wide grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
          <div>
            <h2 className="font-display text-2xl text-white sm:text-3xl md:text-4xl">
              Spaces where marketers can learn, connect, and exchange ideas
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
              Most sessions are free. Some have limited seats so the room stays useful. Register
              early, show up ready to participate, and bring a real question when you can.
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4">
            {expect.map((item, i) => (
              <div
                key={item.title}
                className="flex gap-4 rounded-2xl border border-white/10 bg-surface p-5 sm:p-6"
              >
                <span className="font-display text-sm text-baby-blue">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-lg text-white">{item.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/55">{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="border-t border-white/10 bg-near-black py-14 sm:py-16">
        <div className="container-wide">
          <div className="grid gap-6 rounded-2xl border border-white/10 bg-ink p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-10 sm:rounded-[2rem] sm:p-8 md:p-10">
            <div>
              <h2 className="font-display text-xl text-white sm:text-2xl md:text-3xl">
                Come learn with us
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/55">
                Join the community for reminders and recaps, or apply to live training when you
                want a full programme.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:items-end">
              <Button href="/apply">
                Apply to cohort
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
