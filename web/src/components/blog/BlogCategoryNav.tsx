"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { blogCategories } from "@/lib/content";
import { cn } from "@/lib/utils";

export function BlogCategoryNav() {
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "All";

  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none">
      {blogCategories.map((cat) => {
        const href =
          cat === "All" ? "/insights" : `/insights?category=${encodeURIComponent(cat)}`;
        const isActive = active === cat;
        return (
          <Link
            key={cat}
            href={href}
            scroll={false}
            className={cn(
              "shrink-0 rounded-full border px-3.5 py-2 text-xs font-medium transition sm:px-4 sm:text-sm",
              isActive
                ? "border-deep-blue bg-deep-blue text-white"
                : "border-white/15 bg-white/5 text-white/65 hover:border-white/25 hover:text-white",
            )}
          >
            {cat}
          </Link>
        );
      })}
    </div>
  );
}
