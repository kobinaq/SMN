"use client";

import Link from "next/link";
import { useState } from "react";
import { UserCircle } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import type { HeaderTone } from "@/lib/header-chrome";

const LABEL = "Member sign in";

/**
 * Icon-only account link with a real tooltip (hover, keyboard focus; Escape
 * dismisses). Tooltip colors follow the header tone so the tip stays legible
 * over the dark home hero and over light pages. Desktop pins the tip to the
 * end of the control so it is not clipped at the right viewport edge.
 */
export function MemberSignInIcon({
  href,
  onClick,
  className,
  tooltipSide = "bottom",
  tooltipAlign = "center",
  tone = "ink",
}: {
  href: string;
  onClick?: () => void;
  className?: string;
  tooltipSide?: "bottom" | "top";
  tooltipAlign?: "center" | "end";
  tone?: HeaderTone;
}) {
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const visible = (hovered || focused) && !dismissed;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => {
        setDismissed(false);
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      onKeyDown={(event) => {
        if (event.key === "Escape" && visible) setDismissed(true);
      }}
    >
      <Link
        href={href}
        aria-label={LABEL}
        onClick={onClick}
        onFocus={(event) => {
          if (event.currentTarget.matches(":focus-visible")) {
            setDismissed(false);
            setFocused(true);
          }
        }}
        onBlur={() => setFocused(false)}
        className={cn(
          "inline-flex min-h-11 min-w-11 items-center justify-center rounded-full text-text-1 transition hover:bg-inset focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          className,
        )}
      >
        <UserCircle className="h-7 w-7" aria-hidden />
      </Link>
      <span
        role="tooltip"
        className={cn(
          "pointer-events-none absolute z-[70] whitespace-nowrap rounded-md px-2.5 py-1.5 text-xs font-medium shadow-lg transition-opacity duration-150",
          tone === "light"
            ? "border border-[#202938]/15 bg-[#f7f9fc] text-[#202938]"
            : "border border-[#202938]/20 bg-[#202938] text-[#f7f9fc]",
          tooltipSide === "bottom" ? "top-full mt-2" : "bottom-full mb-2",
          tooltipAlign === "end" ? "right-0" : "left-1/2 -translate-x-1/2",
          visible ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        {LABEL}
      </span>
    </span>
  );
}
