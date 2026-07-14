"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export function CopyLinkButton({
  url,
  label = "Copy link",
  className,
}: {
  url: string;
  label?: string;
  className?: string;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  async function copy() {
    const absolute =
      url.startsWith("http://") || url.startsWith("https://")
        ? url
        : `${window.location.origin}${url.startsWith("/") ? "" : "/"}${url}`;
    try {
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      toast.push("Link copied.", "success");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.push("Could not copy the link.", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={
        className ||
        "inline-flex min-h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/80 transition hover:border-baby-blue/40"
      }
    >
      {copied ? "Copied" : label}
    </button>
  );
}
