"use client";
/* eslint-disable @next/next/no-img-element */

import { useCallback, useEffect, useId, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { staffEase } from "@/components/staff/motion";
import { Button } from "@/components/ui/Button";

type MediaItem = {
  id: string | number;
  alt?: string | null;
  url?: string | null;
  mimeType?: string | null;
};

export function StaffMediaField({
  name,
  value,
  onChange,
  label,
  required,
}: {
  name: string;
  value: string;
  onChange: (next: string) => void;
  label?: string;
  required?: boolean;
}) {
  const dialogId = useId();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<MediaItem | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/staff/media", { credentials: "include" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to load media.");
      setItems(Array.isArray(result.docs) ? result.docs : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }
    const match = items.find((item) => String(item.id) === String(value));
    if (match) {
      setPreview(match);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/staff/media?id=${encodeURIComponent(String(value))}`, {
          credentials: "include",
        });
        const result = await response.json();
        if (!cancelled && response.ok && result.doc) setPreview(result.doc);
      } catch {
        /* ignore preview miss */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [value, items]);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  async function upload(file: File) {
    setUploading(true);
    setError("");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("alt", file.name);
      const response = await fetch("/api/staff/media", { method: "POST", credentials: "include", body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      onChange(String(result.id));
      setOpen(false);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const filtered = items.filter((item) => {
    const needle = query.trim().toLowerCase();
    if (!needle) return true;
    return [item.alt || "", String(item.id)].join(" ").toLowerCase().includes(needle);
  });

  return (
    <div className="mt-2 space-y-2">
      <input type="hidden" name={name} value={value} required={required} readOnly />
      {value && preview ? (
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-2">
          <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-near-black/50">
            {preview.url && preview.mimeType?.startsWith("image/") ? (
              <img src={preview.url} alt={preview.alt || ""} className="h-full w-full object-cover" />
            ) : (
              <span className="px-1 text-[10px] text-white/40">File</span>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm text-white">{preview.alt || label || "Selected media"}</p>
            <p className="text-xs text-white/40">Attached</p>
          </div>
          <button
            type="button"
            className="rounded-full border border-white/15 px-3 py-1.5 text-xs text-white/70 hover:border-baby-blue/40"
            onClick={() => setOpen(true)}
          >
            Change
          </button>
          <button
            type="button"
            aria-label="Clear media"
            className="rounded-md p-1.5 text-white/40 hover:bg-white/5 hover:text-white"
            onClick={() => onChange("")}
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-white/15 bg-white/[.03] px-4 py-6 text-sm text-white/55 transition hover:border-baby-blue/35 hover:text-white"
          style={{ transitionTimingFunction: staffEase }}
        >
          <ImagePlus className="h-4 w-4" strokeWidth={1.5} />
          Choose media
        </button>
      )}

      {open ? (
        <div className="fixed inset-0 z-[60] flex items-end justify-center p-4 sm:items-center" role="dialog" aria-modal aria-labelledby={dialogId}>
          <button type="button" className="absolute inset-0 bg-near-black/70 backdrop-blur-sm" aria-label="Close" onClick={() => setOpen(false)} />
          <div
            className="relative z-10 flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-[1.5rem] border border-white/10 bg-surface shadow-[0_32px_80px_rgba(0,0,0,0.5)]"
            style={{ animation: `staff-fade-in 220ms ${staffEase} both` }}
          >
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <h2 id={dialogId} className="font-display text-lg text-white">
                Choose media
              </h2>
              <button type="button" className="rounded-md p-1.5 text-white/45 hover:bg-white/5 hover:text-white" onClick={() => setOpen(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap items-center gap-3 border-b border-white/10 px-5 py-3">
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search…"
                className="min-w-[12rem] flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/35 focus:border-baby-blue/40"
              />
              <label className="inline-flex cursor-pointer items-center">
                <span className="sr-only">Upload</span>
                <input
                  type="file"
                  className="hidden"
                  disabled={uploading}
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void upload(file);
                  }}
                />
                <span className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80 hover:border-baby-blue/40">
                  {uploading ? "Uploading…" : "Upload new"}
                </span>
              </label>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              {error ? <p className="mb-3 text-sm text-red-300">{error}</p> : null}
              {loading ? (
                <p className="py-10 text-center text-sm text-white/45">Loading…</p>
              ) : filtered.length ? (
                <div className="grid gap-3 sm:grid-cols-3">
                  {filtered.map((item) => {
                    const active = String(item.id) === String(value);
                    const isImage = !!item.mimeType?.startsWith("image/") && !!item.url;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          onChange(String(item.id));
                          setPreview(item);
                          setOpen(false);
                        }}
                        className={cn(
                          "overflow-hidden rounded-2xl border text-left transition",
                          active ? "border-baby-blue/50 ring-1 ring-baby-blue/30" : "border-white/10 hover:border-white/25",
                        )}
                      >
                        <div className="flex aspect-video items-center justify-center bg-near-black/40">
                          {isImage ? (
                            <img src={item.url!} alt={item.alt || ""} className="h-full w-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-white/40">{item.mimeType || "File"}</span>
                          )}
                        </div>
                        <div className="px-3 py-2">
                          <p className="truncate text-xs text-white">{item.alt || "Untitled"}</p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="py-10 text-center text-sm text-white/45">No media yet. Upload one above.</p>
              )}
            </div>
            <div className="flex justify-end border-t border-white/10 px-5 py-3">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
