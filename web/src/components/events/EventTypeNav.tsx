"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { eventTypes } from "@/lib/content";
import { cn } from "@/lib/utils";

export function EventTypeNav({
  counts,
}: {
  counts: Record<string, number>;
}) {
  const searchParams = useSearchParams();
  const active = searchParams.get("type") || "All";

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {eventTypes.map((type) => {
        const href =
          type === "All" ? "/events" : `/events?type=${encodeURIComponent(type)}`;
        const isActive = active === type;
        const count = counts[type] ?? 0;
        return (
          <Link
            key={type}
            href={href}
            scroll={false}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              isActive
                ? "border-deep-blue bg-deep-blue text-white"
                : "border-white/15 bg-white/5 text-white/65 hover:border-white/25 hover:text-white",
            )}
          >
            {type}
            <span
              className={cn(
                "rounded-full px-1.5 py-0.5 text-[10px] tabular-nums",
                isActive ? "bg-white/20 text-white" : "bg-white/10 text-white/45",
              )}
            >
              {count}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
