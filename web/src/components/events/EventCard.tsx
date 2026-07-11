import Image from "next/image";
import { ArrowUpRight, Clock, MapPin } from "lucide-react";
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

  return (
    <article
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300",
        "hover:border-baby-blue/35 sm:rounded-[1.75rem]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.02]">
          <Image
            src={event.image}
            alt=""
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="image-matte" />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="rounded-full border border-white/15 bg-near-black/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mint backdrop-blur-sm">
            {event.type}
          </span>
          {event.price.toLowerCase().includes("free") ? (
            <span className="rounded-full border border-white/15 bg-near-black/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white/80 backdrop-blur-sm">
              Free
            </span>
          ) : null}
        </div>
        <div className="absolute bottom-3 left-3 flex h-14 w-14 flex-col items-center justify-center rounded-xl border border-white/15 bg-near-black/85 text-center backdrop-blur-sm sm:bottom-4 sm:left-4 sm:h-16 sm:w-16 sm:rounded-2xl">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-baby-blue sm:text-[10px]">
            {month}
          </span>
          <span className="font-display text-xl leading-none text-white sm:text-2xl">{day}</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="font-display text-xl leading-snug text-white transition group-hover:text-baby-blue sm:text-2xl">
          {event.title}
        </h3>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-white/45 sm:text-sm">
          <span className="inline-flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-baby-blue" strokeWidth={1.75} />
            {event.time}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-baby-blue" strokeWidth={1.75} />
            {event.format}
          </span>
        </div>
        <p className="mt-4 flex-1 text-sm leading-relaxed text-white/60">{event.summary}</p>
        <div className="mt-6 flex items-center justify-between gap-3 border-t border-white/10 pt-5">
          <p className="truncate text-xs text-white/40">Host · {event.host}</p>
          <a
            href={event.registrationUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-baby-blue transition hover:text-white"
          >
            Register
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
