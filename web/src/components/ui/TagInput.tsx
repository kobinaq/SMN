"use client";

import { useId, useState } from "react";
import { X } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export function TagInput({
  name,
  label,
  initial = [],
  placeholder = "Type and press Enter",
  hint,
  className,
}: {
  name: string;
  label: string;
  initial?: string[];
  placeholder?: string;
  hint?: string;
  className?: string;
}) {
  const id = useId();
  const [tags, setTags] = useState(initial);
  const [draft, setDraft] = useState("");

  function addTag(raw: string) {
    const value = raw.trim().replace(/,/g, "");
    if (!value) return;
    setTags((current) => (current.includes(value) ? current : [...current, value]));
    setDraft("");
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text-2">
        {label}
      </label>
      <input type="hidden" name={name} value={tags.join(",")} readOnly />
      <div className="flex min-h-12 flex-wrap items-center gap-2 rounded-[var(--radius-md)] border border-edge bg-inset px-3 py-2 transition-colors duration-[var(--dur-fast)] hover:border-edge-strong focus-within:border-accent focus-within:ring-[3px] focus-within:ring-accent-bg">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-accent/25 bg-accent-bg px-2.5 py-1 text-xs text-accent"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 transition-colors hover:bg-off-white/10"
              onClick={() => setTags((current) => current.filter((item) => item !== tag))}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" || event.key === ",") {
              event.preventDefault();
              addTag(draft);
            } else if (event.key === "Backspace" && !draft && tags.length) {
              setTags((current) => current.slice(0, -1));
            }
          }}
          onBlur={() => addTag(draft)}
          placeholder={tags.length ? "" : placeholder}
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-text-1 outline-none placeholder:text-text-3"
        />
      </div>
      {hint ? <p className="text-xs text-text-3">{hint}</p> : null}
    </div>
  );
}
