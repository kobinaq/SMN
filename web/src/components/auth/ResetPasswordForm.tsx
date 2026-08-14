"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const password = String(data.password || "");
    const confirm = String(data.confirm || "");
    if (password !== confirm) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }

    try {
      const res = await fetch("/api/member-auth/reset-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Unable to reset that password. Request a new link.");
        return;
      }
      setStatus("success");
      setMessage("Password updated. You can sign in now.");
      router.push("/login");
      router.refresh();
    } catch {
      setStatus("error");
      setMessage("Unable to reset that password. Try again.");
    }
  }

  if (!token) {
    return (
      <p className="text-sm text-white/55">
        This reset link is missing a token.{" "}
        <Link href="/forgot-password" className="text-baby-blue hover:text-white">
          Request a new link
        </Link>
        .
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <label className="block text-sm text-white/70" htmlFor="reset-password">
        New password
        <input
          id="reset-password"
          className={`${field} mt-2`}
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      <label className="block text-sm text-white/70" htmlFor="reset-confirm">
        Confirm password
        <input
          id="reset-confirm"
          className={`${field} mt-2`}
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
        />
      </label>
      <Button type="submit" className="w-full" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? "Saving…" : "Update password"}
      </Button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-mint"}`} role="status" aria-live="polite">
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
