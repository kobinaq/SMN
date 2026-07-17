import Image from "next/image";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import type { EventItem } from "@/lib/content";
import { formatEventDate, formatEventDay } from "@/lib/events";
import { Button } from "@/components/ui/Button";

export function FeaturedEvent({ event }: { event: EventItem }) {
  const { day, month } = formatEventDay(event.date);

  return (
    <article className="overflow-hidden rounded-2xl border border-white/10 bg-surface sm:rounded-[2rem]">
      <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
        <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[420px]">
          <Image
            src={event.image}
            alt=""
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 55vw"
          />
          <div className="image-matte" />
          <div className="absolute left-4 top-4 flex items-center gap-2 sm:left-6 sm:top-6">
            <span className="rounded-full bg-deep-blue px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white sm:text-xs">
              Next up
            </span>
            <span className="rounded-full border border-white/20 bg-near-black/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mint backdrop-blur-sm sm:text-xs">
              {event.type}
            </span>
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-start gap-4">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 flex-col items-center justify-center rounded-2xl border border-white/10 bg-near-black text-center sm:h-20 sm:w-20">
              <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-baby-blue">
                {month}
              </span>
              <span className="font-display text-3xl leading-none text-white sm:text-4xl">
                {day}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
                {event.title}
              </h2>
              <p className="mt-2 text-sm text-white/45">Hosted by {event.host}</p>
            </div>
          </div>

          <p className="mt-5 text-sm leading-relaxed text-white/65 sm:mt-6 sm:text-base">
            {event.summary}
          </p>

          <ul className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2">
            <li className="flex items-center gap-2 text-sm text-white/60">
              <CalendarDays className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
              {formatEventDate(event.date)}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
              {event.time}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
              {event.format}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <Ticket className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} />
              {event.price}
            </li>
          </ul>

          {event.highlights.length > 0 ? (
            <ul className="mt-5 space-y-2 border-t border-white/10 pt-5 sm:mt-6">
              {event.highlights.slice(0, 3).map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
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
