"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { staffFieldClass } from "@/components/staff/ui";

export type StaffField =
  | { name: string; label: string; type: "text" | "email" | "url" | "number" | "textarea" | "datetime-local" | "password"; required?: boolean; placeholder?: string }
  | { name: string; label: string; type: "select"; required?: boolean; options: Array<{ label: string; value: string }> }
  | { name: string; label: string; type: "checkbox"; required?: boolean };

export function StaffRecordForm({
  collection,
  action = "create",
  id,
  fields,
  initial = {},
  submitLabel = "Save",
  onSuccessHref,
}: {
  collection: string;
  action?: "create" | "update";
  id?: string | number;
  fields: StaffField[];
  initial?: Record<string, string | number | boolean | null | undefined>;
  submitLabel?: string;
  onSuccessHref?: string;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string | boolean>>(() => {
    const next: Record<string, string | boolean> = {};
    for (const field of fields) {
      const value = initial[field.name];
      if (field.type === "checkbox") next[field.name] = Boolean(value);
      else next[field.name] = value == null ? "" : String(value);
    }
    return next;
  });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data: Record<string, unknown> = {};
    for (const field of fields) {
      const raw = values[field.name];
      if (field.type === "checkbox") data[field.name] = Boolean(raw);
      else if (field.type === "number") data[field.name] = raw === "" ? null : Number(raw);
      else data[field.name] = raw;
    }
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ collection, action, id, data }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to save.");
      setMessage("Saved.");
      if (onSuccessHref) {
        router.push(action === "create" ? `${onSuccessHref}/${result.id}` : onSuccessHref);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      {fields.map((field) => (
        <label key={field.name} className={`block text-sm text-white/70 ${field.type === "textarea" || field.type === "checkbox" ? "md:col-span-2" : ""}`}>
          {field.label}
          {field.type === "textarea" ? (
            <textarea
              className={`${staffFieldClass} min-h-36`}
              required={field.required}
              value={String(values[field.name] || "")}
              placeholder={field.placeholder}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            />
          ) : field.type === "select" ? (
            <Select
              className={staffFieldClass}
              required={field.required}
              value={String(values[field.name] || "")}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            >
              <option value="">Select…</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </Select>
          ) : field.type === "checkbox" ? (
            <input
              className="ml-3 mt-3"
              type="checkbox"
              checked={Boolean(values[field.name])}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))}
            />
          ) : (
            <input
              className={staffFieldClass}
              type={field.type}
              required={field.required}
              value={String(values[field.name] || "")}
              placeholder={field.placeholder}
              onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.value }))}
            />
          )}
        </label>
      ))}
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Saving…" : submitLabel}</Button>
        {message ? <span className="text-sm text-white/50" aria-live="polite">{message}</span> : null}
      </div>
    </form>
  );
}

export function StaffDeleteButton({ collection, id, redirectTo }: { collection: string; id: string | number; redirectTo: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  async function remove() {
    if (!window.confirm("Delete this record? This cannot be undone.")) return;
    setBusy(true);
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ collection, action: "delete", id }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to delete.");
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to delete.");
      setBusy(false);
    }
  }
  return (
    <Button type="button" variant="secondary" disabled={busy} onClick={remove}>
      {busy ? "Deleting…" : "Delete"}
    </Button>
  );
}
