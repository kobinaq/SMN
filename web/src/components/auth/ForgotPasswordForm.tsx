"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

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
      // Always show success-style message to avoid email enumeration
      if (!res.ok) {
        const json = (await res.json().catch(() => ({}))) as {
          errors?: { message?: string }[];
        };
        // Payload may error if email not configured — still guide the user
        console.warn("[forgot-password]", json);
      }
      setStatus("success");
      setMessage(
        "If an account exists for that email, password reset instructions will be sent when email is configured. For now, contact the team if you need help.",
      );
    } catch {
      setStatus("error");
      setMessage("Unable to process request. Try again or contact support.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <input
        className={field}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        inputMode="email"
      />
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Sending…" : "Send reset link"}
      </Button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-mint"}`}>
          {message}
        </p>
      ) : null}
      <p className="pt-2 text-center text-sm text-white/45">
        <Link href="/login" className="text-baby-blue hover:text-white">
          Back to sign in
        </Link>
      </p>
    </form>
  );
}
