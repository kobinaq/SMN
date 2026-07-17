"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { staffFieldClass } from "@/components/staff/ui";
import { StaffMediaField } from "@/components/staff/StaffMediaField";

export type StaffField =
  | {
      name: string;
      label: string;
      type: "text" | "email" | "url" | "number" | "textarea" | "datetime-local" | "password";
      required?: boolean;
      placeholder?: string;
      advanced?: boolean;
    }
  | { name: string; label: string; type: "select"; required?: boolean; options: Array<{ label: string; value: string }>; advanced?: boolean }
  | { name: string; label: string; type: "checkbox"; required?: boolean; advanced?: boolean }
  | { name: string; label: string; type: "media"; required?: boolean; advanced?: boolean };

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
  const [advancedOpen, setAdvancedOpen] = useState(false);

  const primaryFields = useMemo(() => fields.filter((field) => !field.advanced), [fields]);
  const advancedFields = useMemo(() => fields.filter((field) => field.advanced), [fields]);

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

  function renderField(field: StaffField) {
    const wide = field.type === "textarea" || field.type === "checkbox" || field.type === "media";
    return (
      <label key={field.name} className={`block text-sm text-white/70 ${wide ? "md:col-span-2" : ""}`}>
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
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        ) : field.type === "checkbox" ? (
          <input
            className="ml-3 mt-3"
            type="checkbox"
            checked={Boolean(values[field.name])}
            onChange={(event) => setValues((current) => ({ ...current, [field.name]: event.target.checked }))}
          />
        ) : field.type === "media" ? (
          <StaffMediaField
            name={field.name}
            label={field.label}
            required={field.required}
            value={String(values[field.name] || "")}
            onChange={(next) => setValues((current) => ({ ...current, [field.name]: next }))}
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
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      {primaryFields.map(renderField)}
      {advancedFields.length ? (
        <div className="md:col-span-2">
          <button
            type="button"
            className="text-xs text-white/45 hover:text-white/70"
            onClick={() => setAdvancedOpen((value) => !value)}
            aria-expanded={advancedOpen}
          >
            {advancedOpen ? "Hide advanced" : "Advanced"}
          </button>
          {advancedOpen ? <div className="mt-4 grid gap-4 md:grid-cols-2">{advancedFields.map(renderField)}</div> : null}
        </div>
      ) : null}
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? "Saving…" : submitLabel}
        </Button>
        {message ? (
          <span className="text-sm text-white/50" aria-live="polite">
            {message}
          </span>
        ) : null}
      </div>
    </form>
  );
}

export function StaffDeleteButton({ collection, id, redirectTo }: { collection: string; id: string | number; redirectTo: string }) {
  const router = useRouter();
  const toast = useToast();
  const [busy, setBusy] = useState(false);
  const [open, setOpen] = useState(false);
  async function remove() {
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
      toast.push("Record deleted.", "success");
      setOpen(false);
      router.push(redirectTo);
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to delete.", "error");
      setBusy(false);
    }
  }
  return (
    <>
      <Button type="button" variant="secondary" disabled={busy} onClick={() => setOpen(true)}>
        {busy ? "Deleting…" : "Delete"}
      </Button>
      <ConfirmDialog
        open={open}
        title="Delete this record?"
        description="This cannot be undone."
        confirmLabel="Delete"
        destructive
        busy={busy}
        onClose={() => !busy && setOpen(false)}
        onConfirm={remove}
      />
    </>
  );
}
