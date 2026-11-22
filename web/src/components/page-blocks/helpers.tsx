import Image from "next/image";
import { validateHref } from "@/lib/page-blocks/link-validation";
import { Button } from "@/components/ui/Button";
import { presetImage } from "@/lib/page-blocks/image-presets";
import type { LinkData, MediaRef } from "./types";

/** Defense in depth: validation runs on save, but a stored href is still checked before it becomes a link. */
export function safeHref(href: string | null | undefined): string | null {
  const value = (href ?? "").trim();
  return value && validateHref(value) === true ? value : null;
}

export function isExternal(href: string) {
  return href.startsWith("https://");
}

export function LinkButton({ link, variant = "primary" }: { link: LinkData; variant?: "primary" | "secondary" | "light" }) {
  const href = safeHref(link?.href);
  const label = link?.label?.trim();
  if (!href || !label) return null;
  return (
    <Button href={href} variant={variant} {...(isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {label}
    </Button>
  );
}

export function mediaOf(ref: MediaRef): { url: string; alt: string } | null {
  if (!ref || typeof ref !== "object" || !ref.url) return null;
  return { url: ref.url, alt: ref.alt ?? "" };
}

/** An uploaded image, or the built-in preset when nothing is uploaded. */
export function Picture({ media, preset, className }: { media: MediaRef; preset?: string | null; className?: string }) {
  const uploaded = mediaOf(media);
  const m = uploaded ?? presetImage(preset);
  if (!m) return null;
  return (
    <div className={`relative overflow-hidden rounded-2xl bg-inset ${className ?? "aspect-[4/3]"}`}>
      <Image src={m.url} alt={m.alt} fill unoptimized={Boolean(uploaded)} sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}
