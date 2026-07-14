"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { TagInput } from "@/components/ui/TagInput";
import { useToast } from "@/components/ui/Toast";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

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
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <div className="rounded-2xl border border-white/10 bg-near-black/40 px-4 py-3 text-xs leading-relaxed text-white/45">
        <p>
          <span className="text-white/70">Public when visibility is Public:</span> name, handle, headline, bio, skills,
          location, LinkedIn, portfolio URL.
        </p>
        <p className="mt-1">
          <span className="text-white/70">Always private:</span> email, account security, and staff notes about you.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-name">
            Full name <span className="text-baby-blue">required</span>
          </label>
          <input id="profile-name" className={field} name="name" required defaultValue={initial.name} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-handle">
            Handle
          </label>
          <input
            id="profile-handle"
            className={field}
            name="handle"
            defaultValue={initial.handle}
            placeholder="your-name"
            pattern="[a-z0-9-]*"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-headline">
          Headline
        </label>
        <input
          id="profile-headline"
          className={field}
          name="headline"
          defaultValue={initial.headline}
          placeholder="Social media strategist"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-bio">
          Bio
        </label>
        <textarea
          id="profile-bio"
          className={`${field} min-h-28 resize-y`}
          name="bio"
          defaultValue={initial.bio}
          placeholder="A short intro for mentors and employers"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <TagInput
          name="skills"
          label="Skills"
          initial={initial.skills}
          placeholder="Add a skill"
          hint="Press Enter to add. Used for opportunity matching."
        />
        <TagInput
          name="careerInterests"
          label="Career interests"
          initial={initial.careerInterests}
          placeholder="Add an interest"
          hint="Press Enter to add areas you want to explore."
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-goals">
          Career goals
        </label>
        <textarea
          id="profile-goals"
          className={`${field} min-h-24 resize-y`}
          name="careerGoals"
          maxLength={5000}
          defaultValue={initial.careerGoals}
          placeholder="Describe the roles, outcomes, or direction you are working toward"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-location">
            Location
          </label>
          <input
            id="profile-location"
            className={field}
            name="location"
            defaultValue={initial.location}
            placeholder="Accra, Ghana"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-visibility">
            Profile visibility
          </label>
          <select
            id="profile-visibility"
            className={`${field} bg-surface`}
            name="visibility"
            defaultValue={initial.visibility || "private"}
          >
            <option value="private" className="bg-near-black">
              Private — only you and staff
            </option>
            <option value="members" className="bg-near-black">
              Members only — visible inside the network
            </option>
            <option value="public" className="bg-near-black">
              Public — shareable portfolio profile
            </option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-linkedin">
            LinkedIn
          </label>
          <input
            id="profile-linkedin"
            className={field}
            name="linkedin"
            type="url"
            defaultValue={initial.linkedin}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40" htmlFor="profile-portfolio">
            Portfolio URL
          </label>
          <input
            id="profile-portfolio"
            className={field}
            name="portfolioUrl"
            type="url"
            defaultValue={initial.portfolioUrl}
            placeholder="https://…"
          />
        </div>
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
      </div>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-mint"}`} role="status" aria-live="polite">
          {message}
        </p>
      ) : null}
    </form>
  );
}
