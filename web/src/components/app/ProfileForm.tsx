"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

const field =
  "field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-white placeholder:text-white/35 sm:py-3";

type ProfileValues = {
  id: string | number;
  name: string;
  handle: string;
  headline: string;
  bio: string;
  location: string;
  linkedin: string;
  portfolioUrl: string;
  visibility: string;
};

export function ProfileForm({ initial }: { initial: ProfileValues }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());

    try {
      const res = await fetch(`/api/members/${initial.id}`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          handle: data.handle || undefined,
          headline: data.headline || undefined,
          bio: data.bio || undefined,
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
        throw new Error(
          json.errors?.[0]?.message || json.message || "Could not save profile.",
        );
      }
      setStatus("success");
      setMessage("Profile saved.");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to save.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3 sm:space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Full name</label>
          <input className={field} name="name" required defaultValue={initial.name} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Handle</label>
          <input
            className={field}
            name="handle"
            defaultValue={initial.handle}
            placeholder="your-name"
            pattern="[a-z0-9-]*"
          />
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/40">Headline</label>
        <input
          className={field}
          name="headline"
          defaultValue={initial.headline}
          placeholder="Social media strategist"
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-white/40">Bio</label>
        <textarea
          className={`${field} min-h-28 resize-y`}
          name="bio"
          defaultValue={initial.bio}
          placeholder="A short intro for mentors and employers"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Location</label>
          <input
            className={field}
            name="location"
            defaultValue={initial.location}
            placeholder="Accra, Ghana"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Profile visibility</label>
          <select
            className={`${field} bg-surface`}
            name="visibility"
            defaultValue={initial.visibility || "private"}
          >
            <option value="private" className="bg-near-black">
              Private
            </option>
            <option value="members" className="bg-near-black">
              Members only
            </option>
            <option value="public" className="bg-near-black">
              Public
            </option>
          </select>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
        <div>
          <label className="mb-1.5 block text-xs text-white/40">LinkedIn</label>
          <input
            className={field}
            name="linkedin"
            type="url"
            defaultValue={initial.linkedin}
            placeholder="https://linkedin.com/in/…"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-white/40">Portfolio URL</label>
          <input
            className={field}
            name="portfolioUrl"
            type="url"
            defaultValue={initial.portfolioUrl}
            placeholder="https://…"
          />
        </div>
      </div>
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Saving…" : "Save profile"}
      </Button>
      {message ? (
        <p className={`text-sm ${status === "error" ? "text-red-300" : "text-mint"}`}>
          {message}
        </p>
      ) : null}
    </form>
  );
}
