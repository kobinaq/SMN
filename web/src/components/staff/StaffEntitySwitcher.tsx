"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { staffEase } from "@/components/staff/motion";

export type StaffEntityOption = {
  id: string | number;
  label: string;
  detail?: string | null;
  searchText?: string;
};

function recentKey(storageKey: string) {
  return `smn-staff-recent:${storageKey}`;
}

function readRecent(storageKey: string): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(recentKey(storageKey));
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : [];
  } catch {
    return [];
  }
}

function writeRecent(storageKey: string, id: string) {
  if (typeof window === "undefined") return;
  const next = [id, ...readRecent(storageKey).filter((item) => item !== id)].slice(0, 6);
  sessionStorage.setItem(recentKey(storageKey), JSON.stringify(next));
}

export function StaffEntitySwitcher({
  items,
  value,
  onSelectHref,
  onSelect,
  placeholder = "Find…",
  storageKey = "entity",
  emptyLabel = "No matches",
  className,
}: {
  items: StaffEntityOption[];
  value?: string | number | null;
  /** Prefer href navigation when selecting (server pages). */
  onSelectHref?: (item: StaffEntityOption) => string;
  onSelect?: (item: StaffEntityOption) => void;
  placeholder?: string;
  storageKey?: string;
  emptyLabel?: string;
  className?: string;
}) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [recentIds, setRecentIds] = useState<string[]>([]);

  const selected = useMemo(
    () => items.find((item) => String(item.id) === String(value)) ?? null,
    [items, value],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const base = !needle
      ? items
      : items.filter((item) => {
          const hay = [item.label, item.detail || "", item.searchText || ""].join(" ").toLowerCase();
          return hay.includes(needle);
        });

    if (!needle && recentIds.length) {
      const recentSet = new Set(recentIds);
      const recent = recentIds
        .map((id) => base.find((item) => String(item.id) === id))
        .filter(Boolean) as StaffEntityOption[];
      const rest = base.filter((item) => !recentSet.has(String(item.id)));
      return [...recent, ...rest];
    }
    return base;
  }, [items, query, recentIds]);

  useEffect(() => {
    setRecentIds(readRecent(storageKey));
  }, [storageKey]);

  useEffect(() => {
    setHighlight(0);
  }, [query, open]);

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const choose = useCallback(
    (item: StaffEntityOption) => {
      writeRecent(storageKey, String(item.id));
      setRecentIds(readRecent(storageKey));
      setOpen(false);
      setQuery("");
      onSelect?.(item);
      if (onSelectHref) {
        window.location.href = onSelectHref(item);
      }
    },
    [onSelect, onSelectHref, storageKey],
  );

  function openPicker() {
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }

  return (
    <div ref={rootRef} className={cn("relative w-full max-w-md", className)}>
      {selected && !open ? (
        <div className="flex items-center gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{selected.label}</p>
              {selected.detail ? <p className="truncate text-xs text-white/40">{selected.detail}</p> : null}
            </div>
          </div>
          <button
            type="button"
            onClick={openPicker}
            className="shrink-0 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/70 transition hover:border-baby-blue/40 hover:text-white"
            style={{ transitionTimingFunction: staffEase }}
          >
            Change
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={openPicker}
          className={cn(
            "flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[.04] px-4 py-2.5 text-left text-sm transition hover:border-white/20",
            open && "border-baby-blue/40",
          )}
          style={{ transitionTimingFunction: staffEase }}
          aria-expanded={open}
          aria-controls={listId}
        >
          <span className="flex min-w-0 items-center gap-2 text-white/55">
            <Search className="h-4 w-4 shrink-0 text-white/35" strokeWidth={1.5} />
            <span className="truncate">{selected ? selected.label : placeholder}</span>
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-white/35" strokeWidth={1.5} />
        </button>
      )}

      {open ? (
        <div
          className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-white/10 bg-surface shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          style={{ animation: `staff-fade-in 180ms ${staffEase} both` }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Search className="h-4 w-4 text-white/35" strokeWidth={1.5} />
            <input
              ref={inputRef}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={placeholder}
              className="min-w-0 flex-1 bg-transparent py-1.5 text-sm text-white outline-none placeholder:text-white/35"
              aria-autocomplete="list"
              aria-controls={listId}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown") {
                  event.preventDefault();
                  setHighlight((current) => Math.min(current + 1, Math.max(filtered.length - 1, 0)));
                } else if (event.key === "ArrowUp") {
                  event.preventDefault();
                  setHighlight((current) => Math.max(current - 1, 0));
                } else if (event.key === "Enter" && filtered[highlight]) {
                  event.preventDefault();
                  choose(filtered[highlight]);
                }
              }}
            />
            <button
              type="button"
              className="rounded-md p-1 text-white/40 hover:bg-white/5 hover:text-white"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <ul id={listId} role="listbox" className="max-h-64 overflow-y-auto py-1">
            {filtered.length ? (
              filtered.map((item, index) => {
                const active = String(item.id) === String(value);
                const href = onSelectHref?.(item);
                const rowClass = cn(
                  "flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition",
                  index === highlight ? "bg-white/[.06] text-white" : "text-white/70 hover:bg-white/[.04]",
                );
                const body = (
                  <>
                    <span className="min-w-0">
                      <span className="block truncate font-medium">{item.label}</span>
                      {item.detail ? <span className="mt-0.5 block truncate text-xs text-white/40">{item.detail}</span> : null}
                    </span>
                    {active ? <Check className="h-4 w-4 shrink-0 text-baby-blue" strokeWidth={1.75} /> : null}
                  </>
                );
                if (href && !onSelect) {
                  return (
                    <li key={item.id} role="option" aria-selected={active}>
                      <Link
                        href={href}
                        className={rowClass}
                        onMouseEnter={() => setHighlight(index)}
                        onClick={() => writeRecent(storageKey, String(item.id))}
                      >
                        {body}
                      </Link>
                    </li>
                  );
                }
                return (
                  <li key={item.id} role="option" aria-selected={active}>
                    <button
                      type="button"
                      className={rowClass}
                      onMouseEnter={() => setHighlight(index)}
                      onClick={() => choose(item)}
                    >
                      {body}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="px-3 py-6 text-center text-sm text-white/40">{emptyLabel}</li>
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
