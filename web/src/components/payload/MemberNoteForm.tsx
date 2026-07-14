"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function MemberNoteForm({ memberId }: { memberId: string | number }) {
  const router = useRouter(); const [busy, setBusy] = useState(false); const [message, setMessage] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setBusy(true); setMessage(""); const form = new FormData(event.currentTarget); const response = await fetch("/api/admin/member-notes", { method: "POST", credentials: "include", headers: { "content-type": "application/json" }, body: JSON.stringify({ memberId, category: form.get("category"), note: form.get("note") }) }); const result = await response.json(); setMessage(response.ok ? "Private note saved." : result.error || "Unable to save note."); setBusy(false); if (response.ok) { event.currentTarget.reset(); router.refresh(); } }
  return <form className="smn-note-form" onSubmit={submit}><label>Category<select name="category" defaultValue="support"><option value="support">Support</option><option value="learning">Learning</option><option value="mentorship">Mentorship</option><option value="opportunity">Opportunity</option><option value="conduct">Conduct</option><option value="other">Other</option></select></label><label>Private staff note<textarea name="note" required minLength={3} placeholder="Add context for authorized staff only." /></label><button disabled={busy} type="submit">{busy ? "Saving…" : "Add private note"}</button>{message ? <p role="status">{message}</p> : null}</form>;
}
