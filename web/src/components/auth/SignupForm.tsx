"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

export function SignupForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    if (String(data.password) !== String(data.confirm)) {
      setStatus("error");
      setMessage("Passwords do not match.");
      return;
    }
    if (String(data.password).length < 8) {
      setStatus("error");
      setMessage("Password must be at least 8 characters.");
      return;
    }

    try {
      const createRes = await fetch("/api/member-auth/signup", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
          name: data.name,
        }),
      });
      const createJson = (await createRes.json().catch(() => ({}))) as {
        errors?: { message?: string }[];
        message?: string;
        doc?: unknown;
      };
      if (!createRes.ok) {
        throw new Error(
          createJson.errors?.[0]?.message ||
            createJson.message ||
            "Could not create account.",
        );
      }

      router.push("/app");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to sign up.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <label htmlFor="signup-name" className="sr-only">
        Full name
      </label>
      <input
        id="signup-name"
        className={field}
        name="name"
        required
        autoComplete="name"
        placeholder="Full name"
      />
      <label htmlFor="signup-email" className="sr-only">
        Email
      </label>
      <input
        id="signup-email"
        className={field}
        name="email"
        type="email"
        required
        autoComplete="email"
        placeholder="Email"
        inputMode="email"
      />
      <label htmlFor="signup-password" className="sr-only">
        Password (minimum 8 characters)
      </label>
      <input
        id="signup-password"
        className={field}
        name="password"
        type="password"
        required
        autoComplete="new-password"
        placeholder="Password (min 8 characters)"
      />
      <label htmlFor="signup-confirm" className="sr-only">
        Confirm password
      </label>
      <input
        id="signup-confirm"
        className={field}
        name="confirm"
        type="password"
        required
        autoComplete="new-password"
        placeholder="Confirm password"
      />
      <Button type="submit" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? "Creating account…" : "Create account"}
      </Button>
      {message ? <p className="text-sm text-red-300">{message}</p> : null}
      <p className="pt-2 text-center text-sm text-white/45">
        Already have an account?{" "}
        <Link href="/login" className="text-baby-blue hover:text-white">
          Sign in
        </Link>
      </p>
    </form>
  );
}
