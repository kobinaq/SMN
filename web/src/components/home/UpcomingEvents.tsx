import Link from "next/link";
import { ArrowUpRight } from "@/components/ui/icons";
import { Button } from "@/components/ui/Button";
import { Band, SectionHead } from "@/components/site/kit";
import type { EventItem } from "@/lib/content";

/** Next few events as a ruled schedule — a listing, not a card grid. */
export function UpcomingEvents({ events }: { events: EventItem[] }) {
  if (!events.length) return null;

  return (
    <Band fade>
      <SectionHead
        align="stacked"
        kicker="Diary"
        title="What is coming up"
        actions={
          <Button href="/events" variant="secondary">
            All events
          </Button>
        }
      />
      <ul className="mt-10 border-t border-edge-subtle">
        {events.map((event) => (
          <li key={event.slug} className="border-b border-edge-subtle">
            <Link
              href={`/events/${event.slug}`}
              className="group grid gap-2 py-6 transition-colors hover:bg-raised sm:grid-cols-[10rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-8 sm:px-4"
            >
              <span className="tnum text-sm text-text-3">
                {new Date(event.date).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                {event.time ? ` · ${event.time}` : ""}
              </span>
              <span className="font-display text-xl text-text-1 transition-colors group-hover:text-accent sm:text-2xl">
                {event.title}
              </span>
              <span className="flex items-center gap-2 eyebrow text-text-3">
                {event.type}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-[var(--dur-fast)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </Band>
  );
}
