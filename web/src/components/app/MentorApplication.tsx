"use client";

import { useState } from "react";
import { mentorTopics } from "@/lib/mentor-options";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Surface";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";

export function MentorApplication({ status }: { status: string | null }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  if (status || state === "success") {
    return (
      <Card padded={false} className="border-edge-subtle bg-inset p-5">
        <p className="font-display text-lg text-text-1">Application received</p>
        <p className="mt-2 text-sm text-text-2">
          Status: <span className="text-accent capitalize">{status || "draft"}</span>. Staff will review your
          profile before it appears in the directory.
        </p>
      </Card>
    );
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    setFeedback("");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/mentor-applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        bio: form.get("bio"),
        seniority: form.get("seniority"),
        topics: form.getAll("topics"),
        website: form.get("website"),
      }),
    });
    const json = (await response.json().catch(() => ({}))) as { error?: string };
    if (!response.ok) {
      setState("error");
      setFeedback(json.error || "Unable to apply.");
      return;
    }
    setState("success");
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <input name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Professional title" htmlFor="ma-title" required>
          <Input id="ma-title" name="title" required minLength={3} maxLength={120} />
        </Field>
        <Field label="Seniority" htmlFor="ma-seniority" required>
          <Select id="ma-seniority" name="seniority" required defaultValue="">
            <option value="" disabled>
              Seniority
            </option>
            <option>Mid-level</option>
            <option>Senior</option>
            <option>Lead / Head</option>
            <option>Founder / Executive</option>
          </Select>
        </Field>
      </div>
      <Field label="Bio" htmlFor="ma-bio" required>
        <Textarea
          id="ma-bio"
          name="bio"
          required
          minLength={80}
          maxLength={1500}
          className="min-h-36"
          placeholder="Describe your experience, mentoring approach, and the people you can best help."
        />
      </Field>
      <fieldset>
        <legend className="text-sm font-medium text-text-2">Topics you can mentor on (choose up to five)</legend>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {mentorTopics.map((topic) => (
            <label key={topic} className="flex items-center gap-2 rounded-[var(--radius-md)] border border-edge-subtle px-3 py-2 text-sm text-text-2">
              <input type="checkbox" name="topics" value={topic} className="accent-accent" />
              {topic}
            </label>
          ))}
        </div>
      </fieldset>
      <Button type="submit" disabled={state === "loading"}>
        {state === "loading" ? "Submitting…" : "Submit for review"}
      </Button>
      {feedback ? <p className="text-sm text-danger">{feedback}</p> : null}
    </form>
  );
}
