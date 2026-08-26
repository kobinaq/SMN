"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Chip, type ChipTone } from "@/components/ui/Chip";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { Trash2 } from "@/components/ui/icons";

export type OpportunityRow = {
  id: string | number;
  title: string;
  company: string;
  status: "pending" | "published" | "closed" | "archived";
  applicationCount: number;
};

const statusTone: Record<OpportunityRow["status"], ChipTone> = {
  pending: "warn",
  published: "ai",
  closed: "neutral",
  archived: "neutral",
};

type DeleteResult = { id: string | number; ok: boolean; error?: string };

async function deleteOpportunities(ids: Array<string | number>): Promise<DeleteResult[]> {
  const response = await fetch("/api/staff/opportunities/delete", {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(result.error || "Unable to delete listings.");
  return result.results as DeleteResult[];
}

/**
 * Every listing, any status, with a checkbox — for cleanup, not daily triage.
 * The Triage panel above only ever surfaces what needs a decision or is near
 * expiry; a listing that's already been approved or closed drops out of it
 * and had no other place to be deleted from, one at a time or in bulk.
 */
export function OpportunityBulkList({ opportunities }: { opportunities: OpportunityRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const ids = useMemo(() => opportunities.map((item) => String(item.id)), [opportunities]);
  const allSelected = ids.length > 0 && selected.size === ids.length;

  function toggle(id: string) {
    setSelected((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  async function confirmSingleDelete() {
    if (!pendingId) return;
    setBusy(true);
    try {
      const [result] = await deleteOpportunities([pendingId]);
      if (!result?.ok) throw new Error(result?.error || "Unable to delete listing.");
      toast.push("Listing deleted.", "success");
      setSelected((current) => {
        const next = new Set(current);
        next.delete(pendingId);
        return next;
      });
      setPendingId(null);
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to delete listing.", "error");
    } finally {
      setBusy(false);
    }
  }

  async function confirmBulkDelete() {
    setBusy(true);
    const targets = [...selected];
    try {
      const results = await deleteOpportunities(targets);
      const failed = results.filter((result) => !result.ok).length;
      const succeeded = targets.length - failed;
      if (succeeded) toast.push(`Deleted ${succeeded} listing${succeeded === 1 ? "" : "s"}.`, "success");
      if (failed) toast.push(`${failed} listing${failed === 1 ? "" : "s"} failed to delete.`, "error");
      setSelected(new Set());
      router.refresh();
    } catch (error) {
      toast.push(error instanceof Error ? error.message : "Unable to delete listings.", "error");
    } finally {
      setBulkOpen(false);
      setBusy(false);
    }
  }

  if (!opportunities.length) return <p className="text-sm text-text-3">No listings yet.</p>;

  return (
    <div>
      <div className="flex items-center justify-between gap-3 border-b border-edge-subtle pb-3">
        <label className="flex items-center gap-2.5 text-sm text-text-2">
          <input
            type="checkbox"
            className="h-4 w-4 accent-accent"
            checked={allSelected}
            onChange={toggleAll}
            aria-label="Select all listings"
          />
          {selected.size ? `${selected.size} selected` : "Select all"}
        </label>
        {selected.size ? (
          <button
            type="button"
            onClick={() => setBulkOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-full border border-danger/30 bg-danger-bg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:border-danger/50"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete {selected.size} selected
          </button>
        ) : null}
      </div>

      <ul className="divide-y divide-edge-subtle">
        {opportunities.map((item) => {
          const id = String(item.id);
          return (
            <li key={id} className="flex items-center justify-between gap-3 py-3">
              <label className="flex min-w-0 flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  className="h-4 w-4 shrink-0 accent-accent"
                  checked={selected.has(id)}
                  onChange={() => toggle(id)}
                  aria-label={`Select ${item.title}`}
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-text-1">{item.title}</span>
                  <span className="block truncate text-xs text-text-3">
                    {item.company} · {item.applicationCount} app{item.applicationCount === 1 ? "" : "s"}
                  </span>
                </span>
              </label>
              <div className="flex shrink-0 items-center gap-2">
                <Chip tone={statusTone[item.status]}>{item.status}</Chip>
                <button
                  type="button"
                  onClick={() => setPendingId(id)}
                  aria-label={`Delete ${item.title}`}
                  className="rounded-full p-2 text-text-3 transition-colors hover:bg-danger-bg hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmDialog
        open={pendingId !== null}
        title="Delete this listing?"
        description="This cannot be undone. Any applications submitted against it are deleted too."
        confirmLabel="Delete"
        destructive
        busy={busy}
        onClose={() => !busy && setPendingId(null)}
        onConfirm={confirmSingleDelete}
      />
      <ConfirmDialog
        open={bulkOpen}
        title={`Delete ${selected.size} listing${selected.size === 1 ? "" : "s"}?`}
        description="This cannot be undone. Any applications submitted against them are deleted too."
        confirmLabel="Delete all selected"
        destructive
        busy={busy}
        onClose={() => !busy && setBulkOpen(false)}
        onConfirm={confirmBulkDelete}
      />
    </div>
  );
}
