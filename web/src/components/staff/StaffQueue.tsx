"use client";

import { useMemo, useState } from "react";
import { StaffEmptyState, StaffFilterChips, StaffOpsRow } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";

export type StaffQueueItem = {
  id: string;
  title: React.ReactNode;
  detail?: React.ReactNode;
  /** Bucket id used by filter chips, e.g. needs / expiry */
  bucket: string;
  /** Milliseconds since epoch for age sort (older first). */
  createdAt?: number | null;
  actions?: React.ReactNode;
};

/** Serializable filter — no functions (safe to pass from Server Components). */
export type StaffQueueFilter = {
  id: string;
  label: string;
  /** If omitted or empty, shows every item (e.g. "All"). */
  buckets?: string[];
};

const DEFAULT_LIMIT = 25;

function matchesFilter(item: StaffQueueItem, filter: StaffQueueFilter) {
  if (!filter.buckets?.length) return true;
  return filter.buckets.includes(item.bucket);
}

export function StaffQueue({
  items,
  filters,
  defaultFilter = "needs",
  emptyTitle = "You're clear",
  emptyHref = "/staff",
  emptyActionLabel = "Back to Today",
  limit = DEFAULT_LIMIT,
}: {
  items: StaffQueueItem[];
  filters: StaffQueueFilter[];
  defaultFilter?: string;
  emptyTitle?: string;
  emptyHref?: string;
  emptyActionLabel?: string;
  limit?: number;
}) {
  const [filter, setFilter] = useState(defaultFilter);
  const [expanded, setExpanded] = useState(false);

  const activeFilter = filters.find((item) => item.id === filter) ?? filters[0];
  const filtered = useMemo(() => {
    const list = activeFilter ? items.filter((item) => matchesFilter(item, activeFilter)) : items;
    return [...list].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
  }, [items, activeFilter]);

  const visible = expanded ? filtered : filtered.slice(0, limit);
  const chipOptions = filters.map((item) => ({
    id: item.id,
    label: item.label,
    count: items.filter((row) => matchesFilter(row, item)).length,
  }));

  return (
    <div className="space-y-4">
      <StaffFilterChips options={chipOptions} value={activeFilter?.id || filter} onChange={setFilter} />
      {visible.length ? (
        <div>
          {visible.map((item) => (
            <StaffOpsRow key={item.id} title={item.title} detail={item.detail}>
              {item.actions}
            </StaffOpsRow>
          ))}
          {filtered.length > limit ? (
            <div className="pt-3">
              <Button type="button" variant="ghost" onClick={() => setExpanded((value) => !value)}>
                {expanded ? "Show less" : `Show more (${filtered.length - limit})`}
              </Button>
            </div>
          ) : null}
        </div>
      ) : (
        <StaffEmptyState title={emptyTitle} action={{ href: emptyHref, label: emptyActionLabel }} />
      )}
    </div>
  );
}
