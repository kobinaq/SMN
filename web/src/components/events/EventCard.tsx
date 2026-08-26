import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "@/components/ui/icons";
import type { EventItem } from "@/lib/content";
import { formatEventDay } from "@/lib/events";
import { cn } from "@/lib/utils";

export function EventCard({
  event,
  priority = false,
  className,
}: {
  event: EventItem;
  priority?: boolean;
  className?: string;
}) {
  const { day, month } = formatEventDay(event.date);
  const href = `/events/${event.slug}`;

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden border border-edge-subtle bg-raised transition duration-300",
        "hover:border-accent/35",
        className,
      )}
    >
      <Link href={href} className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.02]">
          <Image
            src={event.image}
            alt={event.title}
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full border border-edge bg-canvas/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-ai backdrop-blur-sm">
            {event.type}
          </span>
          {event.price.toLowerCase().includes("free") ? (
            <span className="rounded-full border border-edge bg-canvas/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-text-2 backdrop-blur-sm">
              Free
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-3 left-3 flex h-14 w-14 flex-col items-center justify-center border border-edge bg-canvas/85 text-center backdrop-blur-sm sm:bottom-4 sm:left-4 sm:h-16 sm:w-16 sm:">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-accent sm:text-[10px]">
            {month}
          </span>
          <span className="font-display text-xl leading-none text-text-1 sm:text-2xl">{day}</span>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl leading-snug text-text-1 transition group-hover:text-accent sm:text-2xl">
          <Link href={href}>{event.title}</Link>
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-text-3 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
            {event.time || "See details"}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-accent" strokeWidth={1.75} />
            {event.format}
          </span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-text-2">{event.summary}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-edge-subtle pt-5">
          <p className="truncate text-xs text-text-3">Host · {event.host}</p>
          <Link
            href={href}
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-accent transition hover:text-text-1"
          >
            Details
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
