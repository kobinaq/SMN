import Image from "next/image";
import { CalendarDays, Clock, MapPin, Ticket } from "@/components/ui/icons";
import type { EventItem } from "@/lib/content";
import { formatEventDate, formatEventDay } from "@/lib/events";
import { Button } from "@/components/ui/Button";

export function FeaturedEvent({ event }: { event: EventItem }) {
  const { day, month } = formatEventDay(event.date);

  return (
    <article className="overflow-hidden border border-edge-subtle bg-raised">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
            <span className="rounded-full bg-accent-strong px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-text-1 sm:text-xs">
              Next up
            </span>
            <span className="rounded-full border border-edge bg-canvas/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ai backdrop-blur-sm sm:text-xs">
              {event.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center border border-edge-subtle bg-canvas text-center sm:h-20 sm:w-20">
              <span className="eyebrow text-accent">
                {month}
              </span>
              <span className="font-display text-3xl leading-none text-text-1 sm:text-4xl">
                {day}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl leading-tight text-text-1 sm:text-3xl md:text-4xl">
                {event.title}
              </h2>
              <p className="mt-2 text-sm text-text-3">Hosted by {event.host}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-text-2 sm:mt-6 sm:text-base">
            {event.summary}
          </p>

          <ul className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2">
            <li className="flex items-center gap-2 text-sm text-text-2">
              <CalendarDays className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              {formatEventDate(event.date)}
            </li>
            <li className="flex items-center gap-2 text-sm text-text-2">
              <Clock className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              {event.time}
            </li>
            <li className="flex items-center gap-2 text-sm text-text-2">
              <MapPin className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              {event.format}
            </li>
            <li className="flex items-center gap-2 text-sm text-text-2">
              <Ticket className="h-4 w-4 shrink-0 text-accent" strokeWidth={1.75} />
              {event.price}
            </li>
          </ul>

          {event.highlights.length > 0 ? (
            <ul className="mt-5 space-y-2 border-t border-edge-subtle pt-5 sm:mt-6">
              {event.highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2 text-sm text-text-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ai" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="btn-row-mobile mt-7 sm:mt-8">
            <Button href={`/events/${event.slug}`}>
              {event.pricing === "paid" || !event.price.toLowerCase().includes("free")
                ? "View & register"
                : "Register free"}
            </Button>
            <Button href="/community" variant="secondary">
              Join community first
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
