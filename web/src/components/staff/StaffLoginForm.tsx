"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35";

export function StaffLoginForm({ bootstrap }: { bootstrap: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/staff";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch(bootstrap ? "/api/staff-auth/bootstrap" : "/api/staff-auth/login", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(bootstrap ? { name, email, password } : { email, password }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to sign in.");
      router.push(callbackUrl);
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign in.");
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      {bootstrap ? (
        <label className="block text-sm text-white/70">
          Full name
          <input className={field} value={name} onChange={(event) => setName(event.target.value)} required minLength={2} />
        </label>
      ) : null}
      <label className="block text-sm text-white/70">
        Work email
        <input
          className={field}
          name="email"
          type="email"
          autoComplete="username"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm text-white/70">
        Password
        <input
          className={field}
          name="password"
          type="password"
          autoComplete={bootstrap ? "new-password" : "current-password"}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={bootstrap ? 10 : 1}
        />
      </label>
      {error ? (
        <p className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200" role="alert">
          {error}
        </p>
      ) : null}
      <Button type="submit" disabled={busy} className="w-full min-h-11">
        {busy ? "Please wait…" : bootstrap ? "Create first staff account" : "Sign in"}
      </Button>
    </form>
  );
}
