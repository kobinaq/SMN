"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { staffFieldClass } from "@/components/staff/ui";
import { useToast } from "@/components/ui/Toast";

export function EventCheckInForm({ eventId }: { eventId: string | number }) {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    try {
      const response = await fetch("/api/staff/events/check-in", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ticketCode: code, eventId }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Check-in failed.");
      const label = result.already ? "Already checked in" : "Checked in";
      setLast(label);
      toast.push(label, "success");
      setCode("");
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Check-in failed.", "error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <label className="block flex-1 text-sm text-white/70">
        Ticket code
        <input
          className={staffFieldClass}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="SMN-…"
          required
          autoFocus
        />
      </label>
      <Button type="submit" disabled={busy}>
        {busy ? "Checking…" : "Check in"}
      </Button>
      {last ? <p className="text-sm text-mint sm:pb-3">{last}</p> : null}
    </form>
  );
}
