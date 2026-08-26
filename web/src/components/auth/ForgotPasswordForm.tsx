"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { site } from "@/lib/site";

const field =
  "field w-full border border-edge-subtle bg-inset px-4 py-3.5 text-text-1 placeholder:text-text-3 sm:py-3";

export function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/member-auth/forgot-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        message?: string;
        emailDeliveryConfigured?: boolean;
        error?: string;
      };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Unable to process request. Try again or contact support.");
        return;
      }
      setStatus("success");
      setMessage(
        json.message ||
          (json.emailDeliveryConfigured
            ? "If an account exists for that email, reset instructions will be sent."
            : `Password reset email is not configured yet. Contact ${site.email} for help signing in.`),
      );
    } catch {
      setStatus("error");
      setMessage("Unable to process request. Try again or contact support.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <label className="block text-sm text-text-2" htmlFor="forgot-email">
        Email
        <input
          id="forgot-email"
          className={`${field} mt-2`}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          inputMode="email"
        />
      </label>
      <Button type="submit" className="w-full" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send reset link"}
      </Button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-ai"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
      <p className="pt-2 text-center text-sm text-text-3">
        <Link href="/login" className="text-accent hover:text-text-1">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
