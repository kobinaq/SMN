"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { staffFieldClass } from "@/components/staff/ui";

const statuses = ["received", "reviewing", "accepted", "waitlisted", "declined"] as const;

export function ApplicationStatusSelect({
  id,
  status,
}: {
  id: string | number;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [busy, setBusy] = useState(false);

  async function onChange(next: string) {
    setValue(next);
    setBusy(true);
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "cohort-applications",
          action: "update",
          id,
          data: { status: next },
        }),
      });
      if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.error || "Unable to update status.");
      }
      router.refresh();
    } catch {
      setValue(status);
    } finally {
      setBusy(false);
    }
  }

  return (
    <select
      className={`${staffFieldClass} mt-0 min-w-36`}
      value={value}
      disabled={busy}
      onChange={(event) => onChange(event.target.value)}
    >
      {statuses.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
}
