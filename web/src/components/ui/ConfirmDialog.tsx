"use client";

import { useEffect, useId, useRef } from "react";
import { Button } from "@/components/ui/Button";

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  busy = false,
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
  onConfirm: () => void | Promise<void>;
  onClose: () => void;
  children?: React.ReactNode;
}) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    node?.querySelector<HTMLElement>("button, [href], input, textarea, select")?.focus();
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 backdrop-blur-sm sm:items-center animate-[staff-fade-in_var(--dur-fast)_var(--ease-out)_both]"
      role="presentation"
      onClick={onClose}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-edge bg-overlay p-5 shadow-[var(--shadow-3)] animate-[rise-in_var(--dur-base)_var(--ease-out)_both]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="font-display text-xl text-text-1">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-text-2">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={destructive ? "danger" : "primary"} onClick={() => void Promise.resolve(onConfirm())} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
