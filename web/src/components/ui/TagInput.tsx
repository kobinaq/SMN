"use client";

import { useId, useState } from "react";
import { X } from "lucide-react";
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
    <div className={cn("block text-sm text-white/70", className)}>
      <label htmlFor={id}>{label}</label>
      <input type="hidden" name={name} value={tags.join(",")} readOnly />
      <div className="mt-2 flex min-h-12 flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-baby-blue/30 bg-baby-blue/10 px-2.5 py-1 text-xs text-baby-blue"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              className="rounded-full p-0.5 hover:bg-white/10"
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
          className="min-w-[8rem] flex-1 bg-transparent py-1 text-sm text-white outline-none placeholder:text-white/35"
        />
      </div>
      {hint ? <p className="mt-1 text-[11px] text-white/30">{hint}</p> : null}
    </div>
  );
}
