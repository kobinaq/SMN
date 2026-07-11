"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

function safeCallbackUrl(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes(String.fromCharCode(92))) {
    return "/app";
  }
  return value;
}

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = safeCallbackUrl(searchParams.get("callbackUrl"));
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/members/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        errors?: { message?: string }[];
        message?: string;
      };
      if (!res.ok) {
        throw new Error(
          json.errors?.[0]?.message || json.message || "Invalid email or password.",
        );
      }
      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to sign in.");
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
      <input
        className={field}
        name="password"
        type="password"
        required
        autoComplete="current-password"
        placeholder="Password"
      />
      <div className="flex justify-end">
        <Link
          href="/forgot-password"
          className="text-xs text-baby-blue transition hover:text-white"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Signing in…" : "Sign in"}
      </Button>
      {message ? <p className="text-sm text-red-300">{message}</p> : null}
      <p className="pt-2 text-center text-sm text-white/45">
        New here?{" "}
        <Link href="/signup" className="text-baby-blue hover:text-white">
          Create a member account
        </Link>
      </p>
    </form>
  );
}
