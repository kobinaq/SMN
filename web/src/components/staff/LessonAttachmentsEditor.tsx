"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { staffFieldClass } from "@/components/staff/ui";
import { useToast } from "@/components/ui/Toast";

export type LessonAttachmentRow = {
  key: string;
  label: string;
  fileId: string | number;
  url?: string;
};

export function LessonAttachmentsEditor({
  lessonId,
  initial,
}: {
  lessonId: string | number;
  initial: LessonAttachmentRow[];
}) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [label, setLabel] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function persist(next: LessonAttachmentRow[]) {
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/staff/records", {
        method: "POST",
        credentials: "include",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          collection: "lms-lessons",
          action: "update",
          id: lessonId,
          data: {
            attachments: next.map((row) => ({ label: row.label, file: row.fileId })),
          },
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to update attachments.");
      setRows(next);
      toast.push("Documents saved.", "success");
      setMessage("Documents saved.");
    } catch (error) {
      const text = error instanceof Error ? error.message : "Unable to update attachments.";
      setMessage(text);
      toast.push(text, "error");
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File) {
    if (!label.trim()) {
      setMessage("Add a label before uploading a document.");
      return;
    }
    setBusy(true);
    setMessage("");
    try {
      const form = new FormData();
      form.set("file", file);
      form.set("alt", label.trim());
      const uploadResponse = await fetch("/api/staff/media", {
        method: "POST",
        credentials: "include",
        body: form,
      });
      const uploaded = await uploadResponse.json();
      if (!uploadResponse.ok) throw new Error(uploaded.error || "Upload failed.");
      const next = [
        ...rows,
        {
          key: `${uploaded.id}-${Date.now()}`,
          label: label.trim(),
          fileId: uploaded.id,
          url: uploaded.url || "",
        },
      ];
      setLabel("");
      await persist(next);
    } catch (error) {
      const text = error instanceof Error ? error.message : "Upload failed.";
      setMessage(text);
      toast.push(text, "error");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-display text-lg text-white">Documents & downloads</h3>
        <p className="mt-1 text-sm text-white/50">
          Upload PDFs, slides, worksheets, or other files learners can download. This is separate from YouTube video.
        </p>
      </div>

      {rows.length ? (
        <ul className="space-y-2">
          {rows.map((row) => (
            <li
              key={row.key}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 px-3 py-3 text-sm"
            >
              <span>
                <b className="text-white">{row.label}</b>
                {row.url ? (
                  <a href={row.url} target="_blank" rel="noreferrer" className="ml-2 text-baby-blue hover:underline">
                    Open
                  </a>
                ) : null}
              </span>
              <button
                type="button"
                disabled={busy}
                className="text-xs text-red-200 hover:underline disabled:opacity-50"
                onClick={() => void persist(rows.filter((item) => item.key !== row.key))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl border border-dashed border-white/15 px-4 py-5 text-sm text-white/45">
          No documents attached yet.
        </p>
      )}

      <div className="grid gap-3 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block text-sm text-white/70">
          Document label
          <input
            className={staffFieldClass}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder="e.g. Campaign brief PDF"
            disabled={busy}
          />
        </label>
        <label className="block text-sm text-white/70">
          Upload file
          <input
            className={`${staffFieldClass} file:mr-3 file:rounded-full file:border-0 file:bg-baby-blue/20 file:px-3 file:py-1 file:text-baby-blue`}
            type="file"
            disabled={busy}
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void upload(file);
              event.currentTarget.value = "";
            }}
          />
        </label>
      </div>
      {message ? (
        <p className="text-sm text-white/50" role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
      <Button type="button" variant="secondary" disabled={busy || !rows.length} onClick={() => void persist(rows)}>
        {busy ? "Saving…" : "Save document list"}
      </Button>
    </div>
  );
}
