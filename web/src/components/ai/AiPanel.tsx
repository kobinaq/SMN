"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { Copy, Sparkles } from "@/components/ui/icons";
import { AiMarkdown } from "@/components/ui/AiMarkdown";
import { Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

/**
 * Shared shell for every AI surface in the member product (Tutor, Career
 * Coach). Both previously hand-rolled their own header, bubbles, citations,
 * and composer; keeping one implementation is what makes "asking SMN's AI"
 * feel like one feature rather than two features that happen to both use an
 * LLM. Layout differs by mount context — docked panel vs. inline column —
 * which the `tone`/`className` props cover without forking the component.
 */

export type AiCitation = { id: string; label: string; href: string; excerpt: string };

export type AiMessage = {
  role: "member" | "assistant";
  content: string;
  citations?: AiCitation[];
  /** Optional per-message action, e.g. Career Coach's "Add to plan". */
  action?: { label: string; icon?: ReactNode; onClick: () => void };
};

export function AiHeader({
  eyebrow,
  title,
  grounding,
  action,
}: {
  eyebrow: string;
  title: string;
  grounding: string;
  action?: ReactNode;
}) {
  return (
    <header className="shrink-0 border-b border-edge-subtle px-5 py-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="eyebrow flex items-center gap-1.5 text-ai">
            <Sparkles className="h-3 w-3" aria-hidden />
            {eyebrow}
          </p>
          <h2 className="mt-1.5 font-display text-lg text-text-1">{title}</h2>
        </div>
        {action}
      </div>
      <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-ai-bg px-3 py-1.5 text-xs text-ai">
        {grounding}
      </p>
    </header>
  );
}

/** Suggestion buttons shown when a thread is empty. */
export function AiSuggestions({
  title = "Try one of these",
  suggestions,
  onPick,
}: {
  title?: string;
  suggestions: string[];
  onPick: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-text-3">{title}</p>
      <div className="rise-stagger grid gap-2">
        {suggestions.map((item, index) => (
          <button
            key={item}
            type="button"
            style={{ "--i": index } as React.CSSProperties}
            className={cn(
              "rounded-[var(--radius-md)] border border-edge-subtle bg-inset p-3 text-left text-sm text-text-2",
              "transition-[border-color,color,transform] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
              "hover:-translate-y-0.5 hover:border-ai/40 hover:text-text-1",
              "motion-reduce:hover:translate-y-0",
            )}
            onClick={() => onPick(item)}
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message, onCopy }: { message: AiMessage; onCopy: (content: string) => void }) {
  const isMember = message.role === "member";
  return (
    <div
      className={cn(
        "rise max-w-[85%] rounded-[var(--radius-md)] px-4 py-3 text-sm leading-relaxed",
        isMember
          ? "ml-auto border border-accent/25 bg-accent-bg text-text-1"
          : "border-l-2 border-ai bg-inset text-text-2",
      )}
    >
      <p className="eyebrow mb-1.5 flex items-center gap-1.5 text-text-3">
        {!isMember ? <Sparkles className="h-3 w-3 text-ai" aria-hidden /> : null}
        {isMember ? "You" : "SMN AI"}
      </p>
      {isMember ? (
        <p className="whitespace-pre-wrap">{message.content}</p>
      ) : (
        <AiMarkdown content={message.content} />
      )}

      {message.citations?.length ? (
        <div className="mt-3 space-y-1.5">
          <p className="eyebrow text-text-3">Sources</p>
          {message.citations.map((source) => (
            <details
              key={source.id}
              className="rounded-[var(--radius-sm)] bg-ai-bg px-3 py-2 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="cursor-pointer list-none text-xs font-medium text-ai">{source.label}</summary>
              {source.excerpt ? (
                <p className="mt-1.5 text-xs leading-relaxed text-text-2">{source.excerpt}</p>
              ) : null}
              <a href={source.href} className="mt-1.5 inline-block text-xs text-ai hover:underline">
                Open source →
              </a>
            </details>
          ))}
        </div>
      ) : null}

      {!isMember ? (
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
          {message.action ? (
            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-ai transition-colors hover:underline"
              onClick={message.action.onClick}
            >
              {message.action.icon}
              {message.action.label}
            </button>
          ) : null}
          <button
            type="button"
            className="inline-flex items-center gap-1.5 text-text-3 transition-colors hover:text-text-1"
            onClick={() => onCopy(message.content)}
          >
            <Copy className="h-3.5 w-3.5" aria-hidden />
            Copy
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Message list. Auto-scrolls to the newest message as the thread grows. */
export function AiThread({
  messages,
  busy,
  error,
  empty,
  onCopy,
  className,
}: {
  messages: AiMessage[];
  busy?: boolean;
  error?: string;
  empty?: ReactNode;
  onCopy: (content: string) => void;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages, busy]);

  return (
    <div ref={ref} className={cn("min-h-0 flex-1 space-y-3 overflow-y-auto overscroll-contain px-5 py-4", className)}>
      {!messages.length ? empty : null}

      {messages.map((message, index) => (
        <Bubble key={`${message.role}-${index}`} message={message} onCopy={onCopy} />
      ))}

      {busy ? (
        <div className="max-w-[85%] rounded-[var(--radius-md)] border-l-2 border-ai/40 bg-inset px-4 py-3" aria-live="polite">
          <span className="sr-only">Thinking…</span>
          <div className="flex gap-1.5" aria-hidden>
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-1.5 w-1.5 rounded-full bg-ai/70 motion-safe:animate-bounce"
                style={{ animationDelay: `${dot * 120}ms`, animationDuration: "900ms" }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-[var(--radius-md)] bg-danger-bg px-4 py-3 text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Composer + send. ⌘/Ctrl+Enter sends from anywhere in the textarea so a
 * multi-line question doesn't require reaching for the mouse.
 */
export function AiComposer({
  value,
  onChange,
  onSubmit,
  busy,
  label = "Your question",
  placeholder = "Ask a question…",
  hint = "⌘ + Enter to send",
  submitLabel = "Ask",
  footer,
}: {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  busy?: boolean;
  /**
   * Accessible name for the input. A placeholder is not a label — it
   * disappears the moment someone types, which leaves screen-reader users
   * with an anonymous text box.
   */
  label?: string;
  placeholder?: string;
  hint?: string;
  submitLabel?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="shrink-0 border-t border-edge-subtle px-5 py-4">
      <Textarea
        value={value}
        aria-label={label}
        maxLength={12000}
        placeholder={placeholder}
        className="min-h-20 focus:border-ai focus:ring-ai-bg"
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" variant="ai" disabled={busy || !value.trim()} onClick={onSubmit}>
          {busy ? "Thinking…" : submitLabel}
        </Button>
        <span className="text-xs text-text-3">{hint}</span>
        {footer ? <div className="ml-auto">{footer}</div> : null}
      </div>
    </div>
  );
}

/** Thumbs up/down on the latest answer. */
export function AiFeedback({
  onRate,
  message,
}: {
  onRate: (rating: "helpful" | "not-helpful") => void;
  message?: string;
}) {
  return (
    <div className="flex items-center gap-2 text-xs text-text-3">
      <span>Helpful?</span>
      <button type="button" onClick={() => onRate("helpful")} className="transition-colors hover:text-ai">
        Yes
      </button>
      <button type="button" onClick={() => onRate("not-helpful")} className="transition-colors hover:text-danger">
        No
      </button>
      {message ? <span aria-live="polite">{message}</span> : null}
    </div>
  );
}
