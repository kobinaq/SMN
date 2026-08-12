import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Ticket } from "@/components/ui/icons";
import { EventCard } from "@/components/events/EventCard";
import { EventRegisterButton } from "@/components/events/EventRegisterButton";
import { Reveal } from "@/components/motion/Reveal";
import { Button } from "@/components/ui/Button";
import { getMember } from "@/lib/auth/member";
import { formatEventDate, formatEventDay, getEventBySlug, getEventCalendar, getNextEvent } from "@/lib/events";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

async function resolvePublishedEventId(slug: string) {
  try {
    const payload = await getPayloadClient();
    const found = await payload.find({
      collection: "events",
      limit: 1,
      depth: 0,
      overrideAccess: true,
      where: {
        and: [{ slug: { equals: slug } }, { status: { equals: "published" } }],
      },
    });
    return found.docs[0]?.id ?? null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return {
    title: event.title,
    description: event.summary,
    alternates: { canonical: `/events/${slug}` },
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const [member, calendar] = await Promise.all([getMember(), getEventCalendar()]);
  const eventId = event.id ?? (await resolvePublishedEventId(slug));

  const pricing = event.pricing || (event.price.toLowerCase().includes("free") ? "free" : "paid");
  const { day, month } = formatEventDay(event.date);
  const related = getNextEvent(calendar.filter((item) => item.slug !== event.slug));
  const ticketsHref = member
    ? "/app/events"
    : `/login?callbackUrl=${encodeURIComponent("/app/events")}`;

  return (
    <article className="bg-near-black">
      <header className="relative min-h-[72svh] overflow-hidden border-b border-white/10 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:min-h-[82svh] sm:pt-28">
        <div className="absolute inset-0">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-near-black via-near-black/88 to-near-black/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-near-black via-transparent to-near-black/40" />
        </div>

        <div className="container-wide relative z-10 flex min-h-[calc(72svh-5.5rem)] flex-col justify-end pb-14 sm:min-h-[calc(82svh-7rem)] sm:pb-20">
          <Link
            href="/events"
            className="text-sm text-white/55 transition hover:text-white"
          >
            Events
          </Link>
          <div className="mt-6 flex flex-wrap items-end gap-5">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border border-white/15 bg-near-black/70 text-center backdrop-blur-sm sm:h-20 sm:w-20">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                {month}
              </span>
              <span className="font-display text-3xl leading-none text-white sm:text-4xl">
                {day}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-sm tracking-[0.08em] text-baby-blue sm:text-base">
                {event.type}
              </p>
              <h1 className="mt-2 max-w-3xl text-balance font-display text-[2.2rem] leading-[1.05] text-white sm:text-5xl md:text-6xl">
                {event.title}
              </h1>
            </div>
          </div>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
            {event.summary}
          </p>
        </div>
      </header>

      <section className="bg-ink py-12 sm:py-16 md:py-20">
        <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <Reveal>
            <ul className="grid gap-3 sm:grid-cols-2">
              <li className="flex items-center gap-2 text-sm text-white/60">
                <CalendarDays className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
                {formatEventDate(event.date)}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Clock className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
                {event.time || "See schedule"}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <MapPin className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
                {event.venue || event.format}
              </li>
              <li className="flex items-center gap-2 text-sm text-white/60">
                <Ticket className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
                {event.price}
              </li>
            </ul>
            {event.address ? (
              <p className="mt-4 text-sm text-white/45">{event.address}</p>
            ) : null}
            {event.highlights?.length ? (
              <ul className="mt-8 space-y-3 border-t border-white/10 pt-8">
                {event.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed text-white/60">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </Reveal>

          <aside>
            <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-7 lg:sticky lg:top-28">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                Register
              </p>
              <p className="mt-3 text-sm text-white/50">Hosted by {event.host}</p>
              <p className="mt-2 font-display text-2xl text-white">{event.price}</p>
              <div className="mt-6 flex flex-col gap-3">
                {eventId ? (
                  <EventRegisterButton eventId={eventId} pricing={pricing} signedIn={Boolean(member)} />
                ) : (
                  <Button href="/contact" variant="secondary">
                    Ask about registration
                  </Button>
                )}
                <Button href={ticketsHref} variant="secondary">
                  My tickets
                </Button>
              </div>
              {!eventId ? (
                <p className="mt-4 text-xs leading-relaxed text-white/40">
                  This listing is preview-only until staff publish it in Events. Seed demo events are
                  not open for registration.
                </p>
              ) : !member ? (
                <p className="mt-4 text-xs text-white/40">Member sign-in required to register.</p>
              ) : null}
            </div>
          </aside>
        </div>
      </section>

      {related ? (
        <section className="border-t border-white/10 bg-near-black py-12 sm:py-16 md:py-20">
          <div className="container-wide">
            <h2 className="font-display text-2xl text-white sm:text-3xl">Up next</h2>
            <p className="mt-2 max-w-xl text-sm text-white/50">
              Another session on the calendar if this one is not the right fit.
            </p>
            <div className="mt-8 max-w-xl">
              <EventCard event={related} />
            </div>
          </div>
        </section>
      ) : null}
    </article>
  );
}
