"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { enquiryErrorMessage, submitEnquiry, type FieldErrors } from "@/lib/enquiries";
import { subscribePrivacy } from "@/lib/pages/chrome";
import { cn } from "@/lib/utils";

export function NewsletterForm({
  className,
  id = "newsletter-email",
  buttonLabel = "Subscribe",
  successMessage = "You're on the list.",
  privacy = false,
}: {
  className?: string;
  id?: string;
  buttonLabel?: string;
  successMessage?: string;
  privacy?: boolean;
}) {
  const pathname = usePathname() || "/";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const loading = status === "loading";
  const emailError = fieldErrors.email?.[0];
  const emailErrorId = emailError ? `${id}-error` : undefined;

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setFieldErrors({});
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const result = await submitEnquiry({
      type: "newsletter",
      email: String(data.email ?? ""),
      sourcePage: pathname,
      website: String(data.website ?? ""),
    });
    if (result.ok) {
      setStatus("success");
      setStatusMessage(successMessage);
      form.reset();
      return;
    }
    setStatus("error");
    setFieldErrors(result.error === "validation_error" ? result.fieldErrors : {});
    setStatusMessage(result.error === "validation_error" ? "" : enquiryErrorMessage(result));
  }

  return (
    <form onSubmit={onSubmit} className={cn("flex flex-col gap-3 sm:flex-row", className)} aria-busy={loading} noValidate>
      <input type="text" name="website" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <input
        id={id}
        name="email"
        type="email"
        required
        disabled={loading}
        autoComplete="email"
        placeholder="Email address"
        aria-invalid={emailError ? true : undefined}
        aria-describedby={emailErrorId}
        className="field min-w-0 flex-1 rounded-full border border-edge-subtle bg-inset px-5 py-3 text-text-1 placeholder:text-text-3"
      />
      <Button type="submit" disabled={loading} className="shrink-0">
        {loading ? "Sending…" : buttonLabel}
      </Button>
      {privacy ? (
        <p className="text-xs leading-relaxed text-text-3 sm:basis-full">
          {subscribePrivacy}{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-text-1">
            Privacy policy
          </Link>
          .
        </p>
      ) : null}
      {emailError ? (
        <p id={emailErrorId} className="text-sm text-danger sm:basis-full">
          {emailError}
        </p>
      ) : null}
      <p className="text-sm sm:basis-full" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}
