"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";

type ProfileValues = {
  id: string | number;
  name: string;
  handle: string;
  headline: string;
  bio: string;
  skills: string[];
  careerGoals: string;
  careerInterests: string[];
  location: string;
  linkedin: string;
  portfolioUrl: string;
  visibility: string;
};

function splitTags(value: FormDataEntryValue | null) {
  return String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const toast = useToast();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch("/api/member-auth/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          handle: data.handle || undefined,
          headline: data.headline || undefined,
          bio: data.bio || undefined,
          skills: splitTags(data.skills),
          careerGoals: data.careerGoals || undefined,
          careerInterests: splitTags(data.careerInterests),
          location: data.location || undefined,
          linkedin: data.linkedin || undefined,
          portfolioUrl: data.portfolioUrl || undefined,
          visibility: data.visibility,
        }),
      });
      const json = (await res.json().catch(() => ({}))) as {
        errors?: { message?: string }[];
        message?: string;
      };
      if (!res.ok) {
        throw new Error(json.errors?.[0]?.message || json.message || "Could not save profile.");
      }
      setStatus("success");
      setMessage("Profile saved.");
      toast.push("Profile saved.", "success");
      router.refresh();
    } catch (err) {
      setStatus("error");
      const next = err instanceof Error ? err.message : "Unable to save.";
      setMessage(next);
      toast.push(next, "error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="rounded-[var(--radius-md)] border border-edge-subtle bg-inset px-4 py-3 text-xs leading-relaxed text-text-3">
        <p>
          <span className="text-text-2">Public when visibility is Public:</span> name, handle, headline, bio, skills,
          location, LinkedIn, portfolio URL.
        </p>
        <p className="mt-1">
          <span className="text-text-2">Always private:</span> email, account security, and staff notes about you.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" htmlFor="profile-name" required>
          <Input id="profile-name" name="name" required defaultValue={initial.name} />
        </Field>
        <Field label="Handle" htmlFor="profile-handle">
          <Input id="profile-handle" name="handle" defaultValue={initial.handle} placeholder="your-name" pattern="[a-z0-9-]*" />
        </Field>
      </div>

      <Field label="Headline" htmlFor="profile-headline">
        <Input id="profile-headline" name="headline" defaultValue={initial.headline} placeholder="Social media strategist" />
      </Field>

      <Field label="Bio" htmlFor="profile-bio">
        <Textarea id="profile-bio" name="bio" defaultValue={initial.bio} placeholder="A short intro for mentors and employers" />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <TagInput name="skills" label="Skills" initial={initial.skills} placeholder="Add a skill" hint="Press Enter to add. Used for opportunity matching." />
        <TagInput name="careerInterests" label="Career interests" initial={initial.careerInterests} placeholder="Add an interest" hint="Press Enter to add areas you want to explore." />
      </div>

      <Field label="Career goals" htmlFor="profile-goals">
        <Textarea
          id="profile-goals"
          name="careerGoals"
          maxLength={5000}
          defaultValue={initial.careerGoals}
          placeholder="Describe the roles, outcomes, or direction you are working toward"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Location" htmlFor="profile-location">
          <Input id="profile-location" name="location" defaultValue={initial.location} placeholder="Accra, Ghana" />
        </Field>
        <Field label="Profile visibility" htmlFor="profile-visibility">
          <Select id="profile-visibility" name="visibility" defaultValue={initial.visibility || "private"}>
            <option value="private">Private — only you and staff</option>
            <option value="members">Members only — visible inside the network</option>
            <option value="public">Public — shareable portfolio profile</option>
          </Select>
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="LinkedIn" htmlFor="profile-linkedin">
          <Input id="profile-linkedin" name="linkedin" type="url" defaultValue={initial.linkedin} placeholder="https://linkedin.com/in/…" />
        </Field>
        <Field label="Portfolio URL" htmlFor="profile-portfolio">
          <Input id="profile-portfolio" name="portfolioUrl" type="url" defaultValue={initial.portfolioUrl} placeholder="https://…" />
        </Field>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button type="submit" disabled={status === "loading"} aria-busy={status === "loading"}>
          {status === "loading" ? "Saving…" : "Save profile"}
        </Button>
        {initial.handle ? (
          <Button href={`/u/${initial.handle}`} variant="secondary">
            Public preview
          </Button>
        ) : null}
        {message ? (
          <p className={`text-sm ${status === "error" ? "text-danger" : "text-ai"}`} role="status" aria-live="polite">
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
