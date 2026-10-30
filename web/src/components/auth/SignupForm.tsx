"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { signupCopy } from "@/lib/pages/join";
import { validateSignup, type SignupErrors, type SignupField } from "@/lib/signup-validation";

const field =
  "field mt-2 w-full border border-edge-subtle bg-inset px-4 py-3.5 text-text-1 placeholder:text-text-3 sm:py-3";
const invalidField = "border-red-300/70";

const order: SignupField[] = ["name", "email", "password", "confirm"];

const inputs: Record<
  SignupField,
  { id: string; type: string; autoComplete: string; inputMode?: "email" }
> = {
  name: { id: "signup-name", type: "text", autoComplete: "name" },
  email: { id: "signup-email", type: "email", autoComplete: "email", inputMode: "email" },
  password: { id: "signup-password", type: "password", autoComplete: "new-password" },
  confirm: { id: "signup-confirm", type: "password", autoComplete: "new-password" },
};

export function SignupForm() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [errors, setErrors] = useState<SignupErrors>({});
  const [formError, setFormError] = useState("");

  function focusField(name: SignupField) {
    const el = formRef.current?.elements.namedItem(name);
    if (el instanceof HTMLInputElement) el.focus();
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError("");
    const data = new FormData(e.currentTarget);
    const values = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      password: String(data.get("password") ?? ""),
      confirm: String(data.get("confirm") ?? ""),
    };

    const found = validateSignup(values);
    setErrors(found);
    const firstInvalid = order.find((key) => found[key]);
    if (firstInvalid) {
      setStatus("error");
      focusField(firstInvalid);
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/member-auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email.trim(),
          password: values.password,
          name: values.name.trim(),
        }),
      });
      if (!res.ok) {
        setStatus("error");
        setFormError(signupCopy.errors.server);
        formErrorRef.current?.focus();
        return;
      }
      router.push("/signup/confirmed");
      router.refresh();
    } catch {
      setStatus("error");
      setFormError(signupCopy.errors.network);
      formErrorRef.current?.focus();
    }
  }

  const hasFieldErrors = order.some((key) => errors[key]);

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      noValidate
      aria-describedby="signup-required-note"
      className="space-y-4"
    >
      <p id="signup-required-note" className="text-xs text-text-3">
        {signupCopy.requiredNote}
      </p>

      {order.map((key) => {
        const config = inputs[key];
        const copy = signupCopy.fields[key];
        const hint = "hint" in copy ? copy.hint : undefined;
        const hintId = hint ? `${config.id}-hint` : undefined;
        const errorId = `${config.id}-error`;
        const error = errors[key];
        const describedBy = [hintId, error ? errorId : undefined].filter(Boolean).join(" ") || undefined;
        return (
          <div key={key}>
            <label htmlFor={config.id} className="block text-sm font-medium text-text-1">
              {copy.label}
              <span aria-hidden="true" className="ml-0.5 text-accent">
                *
              </span>
            </label>
            {hint ? (
              <p id={hintId} className="mt-1 text-xs text-text-3">
                {hint}
              </p>
            ) : null}
            <input
              id={config.id}
              name={key}
              type={config.type}
              required
              autoComplete={config.autoComplete}
              inputMode={config.inputMode}
              className={`${field} ${error ? invalidField : ""}`}
              aria-invalid={error ? true : undefined}
              aria-describedby={describedBy}
            />
            {error ? (
              <p id={errorId} className="mt-1.5 text-sm text-red-300">
                {error}
              </p>
            ) : null}
          </div>
        );
      })}

      <div role="alert" aria-live="assertive">
        {hasFieldErrors ? <p className="text-sm text-red-300">{signupCopy.errors.summary}</p> : null}
        {formError ? (
          <p ref={formErrorRef} tabIndex={-1} id="signup-form-error" className="text-sm text-red-300">
            {formError}{" "}
            <Link href="/login" className="underline hover:text-text-1">
              Sign in
            </Link>{" "}
            or{" "}
            <Link href="/forgot-password" className="underline hover:text-text-1">
              reset your password
            </Link>
            .
          </p>
        ) : null}
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={status === "loading"}
        aria-busy={status === "loading" || undefined}
      >
        {status === "loading" ? signupCopy.submittingLabel : signupCopy.submitLabel}
      </Button>

      <p className="text-center text-sm text-text-3">
        {signupCopy.signInPrompt}{" "}
        <Link
          href="/login"
          className="inline-flex min-h-11 items-center px-1 text-accent hover:text-text-1"
        >
          {signupCopy.signInLabel}
        </Link>
      </p>
    </form>
  );
}
