"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { enquiryErrorMessage, enquiryLimits, submitEnquiry, type FieldErrors } from "@/lib/enquiries";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";

/** Public enquiry types. Hire / job / intern options are retired from the UI
 *  (T3); the contact API still accepts those strings if posted directly. */
const types = [
  "General enquiry",
  "Partnership",
  "Training request",
  "Collaboration",
  "Sponsorship",
  "Speaking request",
  "Simulation waitlist",
  "Other",
] as const;

const partnerTypes = new Set([
  "Partnership",
  "Training request",
  "Collaboration",
  "Sponsorship",
]);

export function ContactForm({
  defaultType,
  submitLabel = "Send message",
  successMessage = "Message sent. We’ll get back to you soon.",
  hideType = false,
}: {
  defaultType?: string;
  submitLabel?: string;
  successMessage?: string;
  hideType?: boolean;
}) {
  const pathname = usePathname() || "/";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const loading = status === "loading";
  // Unknown or retired ?type= values (Talent request, Intern request, Job posting)
  // fall back to the blank default option.
  const selectedType = types.includes(defaultType as (typeof types)[number]) ? defaultType : undefined;
  const isEmployer = Boolean(selectedType && partnerTypes.has(selectedType));

  useEffect(() => {
    if (isEmployer) trackEvent("employer_enquiry_start", { location: "contact_form" });
  }, [isEmployer]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setFieldErrors({});
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const subject = String(data.subject ?? "").trim();
    const note = String(data.message ?? "").trim();
    const result = await submitEnquiry({
      type: "contact",
      name: String(data.name ?? ""),
      email: String(data.email ?? ""),
      message: note ? (subject ? `Enquiry type: ${subject}\n\n${note}` : note) : "",
      sourcePage: pathname,
      website: String(data.website ?? ""),
    });
    if (result.ok) {
      setStatus("success");
      setStatusMessage(successMessage);
      if (isEmployer) trackEvent("employer_enquiry_complete", { location: "contact_form" });
      form.reset();
      return;
    }
    setStatus("error");
    setFieldErrors(result.error === "validation_error" ? result.fieldErrors : {});
    setStatusMessage(result.error === "validation_error" ? "" : enquiryErrorMessage(result));
  }

  const field =
    "field w-full border border-edge-subtle bg-inset px-4 py-3.5 text-text-1 placeholder:text-text-3 sm:py-3";

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4" aria-busy={loading} noValidate>
      <input type="text" name="website" className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-text-3" htmlFor="contact-name">
            Full name
          </label>
          <input
            id="contact-name"
            className={field}
            name="name"
            required
            maxLength={enquiryLimits.name}
            disabled={loading}
            placeholder="Full name"
            autoComplete="name"
            aria-invalid={fieldErrors.name ? true : undefined}
            aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          />
          {fieldErrors.name?.[0] ? (
            <p id="contact-name-error" className="mt-1.5 text-sm text-danger">
              {fieldErrors.name[0]}
            </p>
          ) : null}
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-text-3" htmlFor="contact-email">
            Email
          </label>
          <input
            id="contact-email"
            className={field}
            name="email"
            type="email"
            required
            disabled={loading}
            placeholder="Email"
            autoComplete="email"
            inputMode="email"
            aria-invalid={fieldErrors.email ? true : undefined}
            aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          />
          {fieldErrors.email?.[0] ? (
            <p id="contact-email-error" className="mt-1.5 text-sm text-danger">
              {fieldErrors.email[0]}
            </p>
          ) : null}
        </div>
      </div>
      {hideType ? (
        <input type="hidden" name="subject" value={selectedType ?? "General enquiry"} />
      ) : (
        <div>
          <label className="mb-1.5 block text-xs text-text-3" htmlFor="contact-type">
            Enquiry type
          </label>
          <Select
            id="contact-type"
            className={cn(field, "bg-raised")}
            name="subject"
            required
            disabled={loading}
            defaultValue={selectedType ?? ""}
          >
            <option value="" disabled>
              Enquiry type
            </option>
            {types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div>
        <label className="mb-1.5 block text-xs text-text-3" htmlFor="contact-message">
          Message
        </label>
        <textarea
          id="contact-message"
          className={cn(field, "min-h-32 resize-y")}
          name="message"
          required
          maxLength={enquiryLimits.message}
          disabled={loading}
          placeholder="How can we help?"
          aria-invalid={fieldErrors.message ? true : undefined}
          aria-describedby={fieldErrors.message ? "contact-message-error" : undefined}
        />
        {fieldErrors.message?.[0] ? (
          <p id="contact-message-error" className="mt-1.5 text-sm text-danger">
            {fieldErrors.message[0]}
          </p>
        ) : null}
      </div>
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : submitLabel}
      </Button>
      <p className="text-sm" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}
