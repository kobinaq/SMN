"use client";

import { useEffect, useId, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";

/**
 * False while rendering on the server, true once mounted in the browser —
 * `document.body` does not exist during SSR, so the portal has to wait. Written
 * as a store subscription rather than setState-in-an-effect so it settles in
 * the first client render instead of costing an extra pass.
 */
const noopSubscribe = () => () => {};
function useMounted() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

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
  const mounted = useMounted();

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const node = panelRef.current;
    // Fields before buttons: a dialog that asks for a reason should land the
    // caret in the field, not on Cancel.
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

  // A failed submit puts the operator back in the field they need to correct.
  useEffect(() => {
    if (!open || !error) return;
    panelRef.current?.querySelector<HTMLElement>("textarea, input")?.focus();
  }, [error, open]);

  if (!open || !mounted) return null;

  // Portalled to <body> so an ancestor with overflow, transform or a stacking
  // context of its own cannot clip or trap the dialog.
  return createPortal(
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
        aria-describedby={error ? errorId : undefined}
        className="w-full max-w-md rounded-[var(--radius-lg)] border border-edge bg-overlay p-5 shadow-[var(--shadow-3)] animate-[rise-in_var(--dur-base)_var(--ease-out)_both]"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id={titleId} className="font-display text-xl text-text-1">
          {title}
        </h2>
        {description ? <p className="mt-2 text-sm leading-relaxed text-text-2">{description}</p> : null}
        {children ? <div className="mt-4">{children}</div> : null}
        {error ? (
          <p
            id={errorId}
            className="mt-3 rounded-[var(--radius-md)] bg-danger-bg px-3 py-2 text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        ) : null}
        <div className="mt-6 flex flex-wrap justify-end gap-2">
          <Button type="button" variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button type="button" variant={destructive ? "danger" : "primary"} onClick={() => void Promise.resolve(onConfirm())} disabled={busy}>
            {busy ? "Working…" : confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
