"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { staffFieldClass } from "@/components/staff/ui";

export function MediaUploadForm() {
  const router = useRouter();
  const [alt, setAlt] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("alt", alt || "Uploaded media");
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch("/api/staff/media", { method: "POST", credentials: "include", body: data });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Upload failed.");
      setMessage("Upload complete.");
      form.reset();
      setAlt("");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
      <label className="block text-sm text-white/70">
        Alt text
        <input className={staffFieldClass} value={alt} onChange={(event) => setAlt(event.target.value)} required />
      </label>
      <label className="block text-sm text-white/70">
        File
        <input className={staffFieldClass} name="file" type="file" accept="image/*,application/pdf" required />
      </label>
      <div className="md:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={busy}>{busy ? "Uploading…" : "Upload media"}</Button>
        {message ? <span className="text-sm text-white/50">{message}</span> : null}
      </div>
    </form>
  );
}
