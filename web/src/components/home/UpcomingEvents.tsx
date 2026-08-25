import { ArrowUpRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import type { EventItem } from "@/lib/content";

export function UpcomingEvents({ events }: { events: EventItem[] }) {
  if (!events.length) return null;

  return (
    <section data-section-fade className="border-t border-white/10 bg-near-black py-12 sm:py-16">
      <div className="container-wide">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <h2 className="font-display text-2xl text-white sm:text-3xl">Upcoming</h2>
          <Button href="/events" variant="ghost" className="w-full sm:w-auto">
            All events
          </Button>
        </div>
        <ul className="mt-8 divide-y divide-white/10 border-y border-white/10">
          {events.map((event) => (
            <li key={event.slug}>
              <a
                href={`/events/${event.slug}`}
                className="group flex flex-col gap-2 py-5 transition sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.16em] text-white/40">{event.type}</p>
                  <p className="mt-1 font-display text-xl text-white group-hover:text-baby-blue">
                    {event.title}
                  </p>
                </div>
                <p className="flex items-center gap-2 text-sm text-white/50 sm:shrink-0">
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {event.time ? ` · ${event.time}` : ""}
                  <ArrowUpRight className="h-4 w-4" />
                </p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
