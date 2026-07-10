"use client";

import Image from "next/image";
import { site } from "@/lib/site";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/lib/utils";

/**
 * logo-on-blue = white wordmark (for dark backgrounds)
 * logo-on-white = blue wordmark (for light backgrounds)
 */
export function Logo({
  className,
  priority,
}: {
  className?: string;
  priority?: boolean;
}) {
  const { theme } = useTheme();
  const src =
    theme === "light" ? "/brand/logo-on-white.png" : "/brand/logo-on-blue.png";

  return (
    <Image
      src={src}
      alt={site.name}
      width={160}
      height={48}
      className={cn("h-9 w-auto md:h-10", className)}
      priority={priority}
    />
  );
}
