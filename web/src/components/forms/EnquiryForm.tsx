"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  enquiryErrorMessage,
  enquiryLimits,
  submitEnquiry,
  type EnquiryField as ApiField,
  type EnquiryType,
  type FieldErrors,
} from "@/lib/enquiries";
import { cn } from "@/lib/utils";

export type EnquiryField = {
  name: string;
  label: string;
  kind: "text" | "email" | "textarea";
  autoComplete?: string;
  /** Which API field this input fills. Unmapped inputs are folded into `message`. */
  api?: "name" | "email" | "phone" | "organisation" | "message";
};

function Honeypot() {
  return (
    <input
      type="text"
      name="website"
      className="sr-only"
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
    />
  );
}

function fieldErrorText(errors: FieldErrors, field: ApiField | undefined): string | undefined {
  if (!field) return undefined;
  return errors[field]?.[0];
}

export function EnquiryForm({
  idPrefix,
  fields,
  enquiryType,
  submitLabel,
  successMessage,
}: {
  idPrefix: string;
  fields: readonly EnquiryField[];
  enquiryType: Exclude<EnquiryType, "newsletter">;
  submitLabel: string;
  successMessage: string;
}) {
  const pathname = usePathname() || "/";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const fieldClass =
    "field w-full border border-edge-subtle bg-inset px-4 py-3.5 text-text-1 placeholder:text-text-3 sm:py-3";
  const loading = status === "loading";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setStatusMessage("");
    setFieldErrors({});
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    let name = "";
    let email = "";
    let phone = "";
    let organisation = "";
    let message = "";
    const notes: string[] = [];

    for (const field of fields) {
      const value = String(data[field.name] ?? "").trim();
      if (field.api === "name") name = value;
      else if (field.api === "email") email = value;
      else if (field.api === "phone") phone = value;
      else if (field.api === "organisation") organisation = value;
      else if (field.api === "message") message = value;
      else if (value) notes.push(`${field.label}: ${value}`);
    }

    const result = await submitEnquiry({
      type: enquiryType,
      email,
      name,
      phone,
      organisation,
      message: [message, ...notes].filter(Boolean).join("\n"),
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
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4" aria-busy={loading} noValidate>
      <Honeypot />
      {fields.map((field) => {
        const id = `${idPrefix}-${field.name}`;
        const error = fieldErrorText(fieldErrors, field.api);
        const errorId = error ? `${id}-error` : undefined;
        const maxLength =
          field.api === "name"
            ? enquiryLimits.name
            : field.api === "phone"
              ? enquiryLimits.phone
              : field.api === "organisation"
                ? enquiryLimits.organisation
                : field.api === "message"
                  ? enquiryLimits.message
                  : undefined;
        return (
          <div key={field.name}>
            <label className="mb-1.5 block text-xs text-text-3" htmlFor={id}>
              {field.label}
            </label>
            {field.kind === "textarea" ? (
              <textarea
                id={id}
                name={field.name}
                required
                maxLength={maxLength}
                disabled={loading}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId}
                className={cn(fieldClass, "min-h-32 resize-y")}
              />
            ) : (
              <input
                id={id}
                name={field.name}
                type={field.kind}
                required
                maxLength={maxLength}
                disabled={loading}
                autoComplete={field.autoComplete}
                aria-invalid={error ? true : undefined}
                aria-describedby={errorId}
                className={fieldClass}
              />
            )}
            {error ? (
              <p id={errorId} className="mt-1.5 text-sm text-danger">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}
      <Button type="submit" disabled={loading} className="w-full sm:w-auto">
        {loading ? "Sending…" : submitLabel}
      </Button>
      <p className="text-sm text-text-1" role="status" aria-live="polite">
        {statusMessage}
      </p>
    </form>
  );
}
