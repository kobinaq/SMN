"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Briefcase, MapPin, Search } from "@/components/ui/icons";
import type { OpportunityItem } from "@/lib/opportunities";
import { Card } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { Input } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";

const sourceLabel: Record<string, string> = {
  manual: "SMN verified",
  partner: "Partner listing",
  imported: "External opportunity",
};

export function OpportunityDirectory({
  opportunities,
  hrefPrefix = "/app/opportunities",
}: {
  opportunities: OpportunityItem[];
  hrefPrefix?: string;
}) {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All types");
  const [mode, setMode] = useState("All modes");
  const types = useMemo(
    () => ["All types", ...Array.from(new Set(opportunities.map((item) => item.type))).sort()],
    [opportunities],
  );
  const modes = useMemo(
    () => ["All modes", ...Array.from(new Set(opportunities.map((item) => item.workMode))).sort()],
    [opportunities],
  );
  const filtered = opportunities.filter(
    (item) =>
      `${item.title} ${item.company} ${item.summary} ${item.location}`.toLowerCase().includes(query.toLowerCase()) &&
      (type === "All types" || item.type === type) &&
      (mode === "All modes" || item.workMode === mode),
  );

  return (
    <div className="space-y-5">
      <div className="grid gap-3 md:grid-cols-[1fr_180px_180px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-text-3" />
          <Input
            aria-label="Search opportunities"
            className="pl-11"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search roles, companies, or locations"
          />
        </label>
        <Select aria-label="Filter by type" value={type} onChange={(event) => setType(event.target.value)}>
          {types.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
        <Select aria-label="Filter by work mode" value={mode} onChange={(event) => setMode(event.target.value)}>
          {modes.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </Select>
      </div>
      {filtered.length ? (
        <div className="rise-stagger grid gap-4 lg:grid-cols-2">
          {filtered.map((item, index) => (
            <Card key={item.id} href={`${hrefPrefix}/${item.slug}`} style={{ "--i": index } as React.CSSProperties}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-accent-bg text-accent">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Chip tone="neutral">{sourceLabel[item.sourceLabel] || "Opportunity"}</Chip>
              </div>
              <h2 className="mt-5 font-display text-xl text-text-1 transition-colors group-hover:text-accent">{item.title}</h2>
              <p className="mt-1 text-sm text-accent">{item.company}</p>
              <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-2">{item.summary}</p>
              <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-text-3">
                <span>{item.type}</span>
                <span>·</span>
                <span>{item.workMode}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {item.location}
                </span>
              </div>
              <span className="mt-5 inline-flex items-center gap-1 text-sm text-accent">
                View opportunity <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed text-center text-sm text-text-3">No opportunities match those filters.</Card>
      )}
    </div>
  );
}
