"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";

type MemberOption = {
  id: string | number;
  label: string;
  email?: string | null;
  handle?: string | null;
};

export function MemberPicker({
  members,
  activeId,
}: {
  members: MemberOption[];
  activeId: string | number;
}) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return members;
    return members.filter((member) => {
      const haystack = [member.label, member.email || "", member.handle || ""].join(" ").toLowerCase();
      return haystack.includes(needle);
    });
  }, [members, query]);

  return (
    <div>
      <label className="mb-3 block text-sm text-white/70" htmlFor="member-360-search">
        Search members
        <input
          id="member-360-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Name, email, or handle"
          className="mt-2 w-full max-w-md rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none placeholder:text-white/35 focus:border-baby-blue/40"
        />
      </label>
      <nav className="flex flex-wrap gap-2" aria-label="Member picker">
        {filtered.map((item) => {
          const active = String(item.id) === String(activeId);
          return (
            <Link
              key={item.id}
              href={`/staff/members?member=${item.id}`}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs transition",
                active
                  ? "border-baby-blue/50 bg-baby-blue/15 text-baby-blue"
                  : "border-white/10 text-white/55 hover:border-white/25 hover:text-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        {!filtered.length ? <p className="text-sm text-white/45">No members match that search.</p> : null}
      </nav>
    </div>
  );
}
