"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { staffFieldClass } from "@/components/staff/ui";
import { enquiryStatuses, enquiryStatusLabels } from "@/lib/enquiries/options";

export function EnquiryStatusSelect({ id, status }: { id: string | number; status: string }) {
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
          collection: "enquiries",
          action: "update",
          id,
          data: { status: next },
        }),
      });
      if (!response.ok) throw new Error("Unable to update status.");
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
      aria-label="Enquiry status"
      onChange={(event) => onChange(event.target.value)}
    >
      {enquiryStatuses.map((item) => (
        <option key={item} value={item}>
          {enquiryStatusLabels[item]}
        </option>
      ))}
    </select>
  );
}
