import Link from "next/link";
import { useSearchParams, usePathname } from "next/navigation";
import { resourceTypes } from "@/lib/content";
import { cn } from "@/lib/utils";

function hrefForType(type: string) {
  if (type === "All") return "/resources";
  if (type === "Template") return "/resources/templates";
  if (type === "Guide") return "/resources/guides";
  return `/resources?type=${encodeURIComponent(type)}`;
}

export function ResourceTypeNav({
  counts,
  orientation = "horizontal",
}: {
  counts?: Record<string, number>;
  orientation?: "horizontal" | "vertical";
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryType = searchParams.get("type");
  const active =
    pathname === "/resources/templates"
      ? "Template"
      : pathname === "/resources/guides"
        ? "Guide"
        : queryType || "All";

  if (orientation === "vertical") {
    return (
      <nav className="space-y-1">
        {resourceTypes.map((type) => {
          const href = hrefForType(type);
          const isActive = active === type;
          const count = type === "All" ? counts?.All : counts?.[type];
          return (
            <Link
              key={type}
              href={href}
              scroll={false}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm transition",
                isActive
                  ? "bg-deep-blue text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white",
              )}
            >
              <span>{type}</span>
              {typeof count === "number" ? (
                <span
                  className={cn(
                    "text-xs tabular-nums",
                    isActive ? "text-white/70" : "text-white/30",
                  )}
                >
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
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {resourceTypes.map((type) => {
        const href = hrefForType(type);
        const isActive = active === type;
        return (
          <Link
            key={type}
            href={href}
            scroll={false}
            className={cn(
              "shrink-0 rounded-lg border px-3 py-2 text-xs font-medium transition sm:text-sm",
              isActive
                ? "border-deep-blue bg-deep-blue text-white"
                : "border-white/15 bg-transparent text-white/65 hover:border-white/25 hover:text-white",
            )}
          >
            {type}
          </Link>
        );
      })}
    </div>
  );
}
