"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input } from "@/components/ui/Field";

/**
 * Authenticated "change my password" form. Shared by the member portal and the
 * staff app — only the endpoint and minimum length differ (members 8, staff 10).
 * Requires the current password so a hijacked session alone cannot rotate it.
 */
export function ChangePasswordForm({
  endpoint,
  minLength = 8,
}: {
  endpoint: string;
  minLength?: number;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    const currentPassword = String(data.currentPassword || "");
    const newPassword = String(data.newPassword || "");
    const confirm = String(data.confirm || "");

    if (newPassword.length < minLength) {
      setStatus("error");
      setMessage(`New password must be at least ${minLength} characters.`);
      return;
    }
    if (newPassword !== confirm) {
      setStatus("error");
      setMessage("New passwords do not match.");
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) {
        setStatus("error");
        setMessage(json.error || "Unable to update your password. Try again.");
        return;
      }
      setStatus("success");
      setMessage("Password updated.");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Unable to update your password. Try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Field label="Current password" htmlFor="change-current-password">
        <Input
          id="change-current-password"
          name="currentPassword"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      <Field label="New password" htmlFor="change-new-password" hint={`At least ${minLength} characters.`}>
        <Input
          id="change-new-password"
          name="newPassword"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
        />
      </Field>
      <Field label="Confirm new password" htmlFor="change-confirm-password">
        <Input
          id="change-confirm-password"
          name="confirm"
          type="password"
          required
          minLength={minLength}
          autoComplete="new-password"
        />
      </Field>
      <Button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}>
        {status === "loading" ? "Saving…" : "Update password"}
      </Button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-danger" : "text-ai"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
