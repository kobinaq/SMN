"use client";

import { useState } from "react";

export function MediaCopyButton({ url, label = "Copy URL" }: { url: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className="rounded-full border border-edge bg-inset px-3 py-1.5 text-xs text-text-1 transition hover:border-accent/40"
    >
      {copied ? "Copied" : label}
    </button>
  );
}
