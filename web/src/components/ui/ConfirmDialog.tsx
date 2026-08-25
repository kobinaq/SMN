"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
  error,
  onConfirm,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  busy?: boolean;
  error?: string;
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const titleId = useId();
  const errorId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    node?.querySelector<HTMLElement>("textarea, input, select, button, [href]")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !error) return;
    panelRef.current?.querySelector<HTMLElement>("textarea, input")?.focus();
  }, [error, open]);

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center" role="presentation" onClick={onClose}>
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={error ? errorId : undefined}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-near-black p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="font-display text-xl text-white">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-white/55">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {error ? (
          <p id={errorId} className="mt-3 text-sm text-red-300" role="alert">
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              void Promise.resolve(onConfirm());
            }}
            disabled={busy}
            className={destructive ? "border-red-300/40 bg-red-400/15 text-red-100" : undefined}
          >
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
