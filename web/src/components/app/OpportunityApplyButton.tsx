"use client";

import { useState } from "react";
import { Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function OpportunityApplyButton({ opportunityId }: { opportunityId: string | number }) {
  const [state, setState] = useState<"idle" | "opening" | "opened" | "saving" | "applied">("idle");
  const [error, setError] = useState("");
  async function record(status: "started" | "applied") {
    const response = await fetch("/api/opportunity-applications", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ opportunityId, status }),
    });
    const json = (await response.json().catch(() => ({}))) as { applicationUrl?: string; error?: string };
    if (!response.ok) throw new Error(json.error || "Unable to update application activity.");
    return json;
  }
  async function apply() { try { setState("opening"); setError(""); const json = await record("started"); if (!json.applicationUrl) throw new Error("Application link is unavailable."); window.open(json.applicationUrl, "_blank", "noopener,noreferrer"); setState("opened"); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to open application."); setState("idle"); } }
  async function markApplied() { try { setState("saving"); setError(""); await record("applied"); setState("applied"); } catch (cause) { setError(cause instanceof Error ? cause.message : "Unable to update application."); setState("opened"); } }
  return <div className="flex flex-wrap items-center gap-3"><Button type="button" onClick={apply} disabled={state === "opening" || state === "saving"}>{state === "opening" ? "Opening…" : "Apply on employer site"}<ExternalLink className="h-4 w-4" /></Button>{state === "opened" || state === "saving" ? <Button type="button" variant="secondary" onClick={markApplied} disabled={state === "saving"}>{state === "saving" ? "Saving…" : "Mark as applied"}</Button> : null}{state === "applied" ? <span className="inline-flex items-center gap-1.5 text-sm text-mint"><Check className="h-4 w-4" />Marked as applied</span> : null}{error ? <p className="w-full text-sm text-red-300">{error}</p> : null}</div>;
}