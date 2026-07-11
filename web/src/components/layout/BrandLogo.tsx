import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const LOGO_SRC = "/images/Logos/Logo on white.png";

/**
 * Brand wordmark. `unoptimized` so the browser loads the same URL as any
 * preload (avoids Next.js optimizer URL mismatch warnings).
 */
export function BrandLogo({
  className,
  width = 314,
  height = 161,
  priority = false,
}: {
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}) {
  return (
    <Image
      src={LOGO_SRC}
      alt={site.name}
      width={width}
      height={height}
      className={cn("w-auto", className)}
      priority={priority}
      unoptimized
    />
  );
}
