"use client";

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared control surface. Every text entry in the product routes through this
 * so focus rings, error states, and disabled styling stay identical — the
 * thing that was previously re-declared in each form.
 */
const controlBase = [
  "w-full rounded-[var(--radius-md)] border border-edge bg-inset text-text-1",
  "placeholder:text-text-3",
  "transition-[border-color,box-shadow,background] duration-[var(--dur-fast)] ease-[var(--ease-out)]",
  "hover:border-edge-strong",
  "focus:border-accent focus:outline-none focus:ring-[3px] focus:ring-accent-bg",
  "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-edge",
].join(" ");

/** 16px on small screens keeps iOS from zooming the viewport on focus. */
const controlSize = "px-3.5 py-2.5 text-base sm:text-sm";

const invalid = "border-danger hover:border-danger focus:border-danger focus:ring-danger-bg";

export type InputProps = InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean };

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, invalid: isInvalid, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(controlBase, controlSize, isInvalid && invalid, className)}
      {...props}
    />
  );
});

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean };

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, invalid: isInvalid, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      aria-invalid={isInvalid || undefined}
      className={cn(controlBase, controlSize, "min-h-24 resize-y leading-relaxed", isInvalid && invalid, className)}
      {...props}
    />
  );
});

/**
 * Label + control + hint/error, wired together by id so the hint and error are
 * announced with the control rather than floating near it visually only.
 */
export function Field({
  label,
  hint,
  error,
  required,
  htmlFor,
  className,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  htmlFor?: string;
  className?: string;
  children: ReactNode | ((props: { id: string; describedBy?: string; invalid: boolean }) => ReactNode);
}) {
  const generated = useId();
  const id = htmlFor || generated;
  const messageId = `${id}-message`;
  const describedBy = hint || error ? messageId : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="text-sm font-medium text-text-2">
        {label}
        {required ? <span className="ml-1 text-danger">*</span> : null}
      </label>
      {typeof children === "function" ? children({ id, describedBy, invalid: Boolean(error) }) : children}
      {error ? (
        <p id={messageId} role="alert" className="text-xs text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={messageId} className="text-xs text-text-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
