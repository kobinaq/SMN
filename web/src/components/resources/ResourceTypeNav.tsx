"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { resourceTypes } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Type filter for the library. Templates and Guides used to be pages of their
 * own; they are query-param views of /resources now, so the active state comes
 * from the query alone — the old pathname comparison could never match, because
 * a pathname never carries a query string.
 */
function hrefForType(type: string) {
  return type === "All" ? "/resources" : `/resources?type=${encodeURIComponent(type)}`;
}

export function ResourceTypeNav({
  counts,
  orientation = "horizontal",
}: {
  counts?: Record<string, number>;
  orientation?: "horizontal" | "vertical";
}) {
  const active = useSearchParams().get("type") || "All";

  if (orientation === "vertical") {
    return (
      <nav className="border-t border-edge-subtle" aria-label="Resource types">
        {resourceTypes.map((type) => {
          const isActive = active === type;
          const count = counts?.[type];
          return (
            <Link
              key={type}
              href={hrefForType(type)}
              scroll={false}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "flex items-center justify-between border-b border-edge-subtle px-3 py-3 text-sm transition-colors",
                isActive ? "bg-accent-bg text-text-1" : "text-text-2 hover:bg-inset hover:text-text-1",
              )}
            >
              <span>{type}</span>
              {typeof count === "number" ? (
                <span className={cn("tnum text-xs", isActive ? "text-accent" : "text-text-3")}>
                  {count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>
    );
  }

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1" role="group" aria-label="Resource types">
      {resourceTypes.map((type) => {
        const isActive = active === type;
        return (
          <Link
            key={type}
            href={hrefForType(type)}
            scroll={false}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "shrink-0 border px-3.5 py-2 text-xs font-medium transition-colors sm:text-sm",
              isActive
                ? "border-accent bg-accent-bg text-text-1"
                : "border-edge text-text-2 hover:border-edge-strong hover:text-text-1",
            )}
          >
            {type}
          </Link>
        );
      })}
    </div>
  );
}
