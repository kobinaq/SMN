import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * Think Social Academy logo (T12). Two lockups, each in two colours:
 *
 * - `full`: the stacked THINK / SOCIAL / ACADEMY lockup (558x320).
 * - `mark`: the THINK wordmark (566x192), for tight spaces.
 *
 * `tone="white"` is for dark and deep-blue grounds (every public header and
 * footer state today); `tone="blue"` (#2b4c7f) is for light grounds.
 *
 * Intrinsic width/height are the real file sizes so the box is reserved
 * before the image loads (no layout shift); the rendered size comes from a
 * height class plus `w-auto`. `unoptimized` keeps the browser on the same
 * URL as any preload, and the files are already small palette PNGs.
 */
const LOGOS = {
  full: {
    white: "/brand/tsa-logo-full-white.png",
    blue: "/brand/tsa-logo-full-blue.png",
    width: 558,
    height: 320,
  },
  mark: {
    white: "/brand/tsa-logo-mark-white.png",
    blue: "/brand/tsa-logo-mark-blue.png",
    width: 566,
    height: 192,
  },
} as const;

export type BrandLogoVariant = keyof typeof LOGOS;
export type BrandLogoTone = "white" | "blue";

export function BrandLogo({
  className,
  variant = "full",
  tone = "white",
  priority = false,
}: {
  className?: string;
  variant?: BrandLogoVariant;
  tone?: BrandLogoTone;
  priority?: boolean;
}) {
  const logo = LOGOS[variant];
  return (
    <Image
      src={logo[tone]}
      alt={site.name}
      width={logo.width}
      height={logo.height}
      className={cn("w-auto", className)}
      priority={priority}
      unoptimized
    />
  );
}
