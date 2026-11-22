export type ImportFlags = { dryRun: boolean; publish: boolean; overwrite: boolean };
export type ImportAction = "create" | "update" | "publish" | "unchanged" | "skip";
export type ImportOutcome = "created" | "updated" | "published" | "unchanged" | "skipped";

export type ExistingState = {
  exists: boolean;
  /** True when the stored doc equals the import (see compare.ts). */
  same: boolean;
  /** `_status` of the latest stored version. */
  status?: string | null;
};

/**
 * One decision per page or global:
 * - missing -> create
 * - same -> unchanged, or publish when --publish and it is not published yet
 * - different -> skip, or update with --overwrite
 */
export function planImport(state: ExistingState, flags: Pick<ImportFlags, "publish" | "overwrite">): ImportAction {
  if (!state.exists) return "create";
  if (state.same) return flags.publish && state.status !== "published" ? "publish" : "unchanged";
  return flags.overwrite ? "update" : "skip";
}

export const outcomeOf: Record<ImportAction, ImportOutcome> = {
  create: "created",
  update: "updated",
  publish: "published",
  unchanged: "unchanged",
  skip: "skipped",
};

export type ImportCounts = Record<ImportOutcome, number>;

export const emptyCounts = (): ImportCounts => ({ created: 0, updated: 0, published: 0, unchanged: 0, skipped: 0 });

export function summaryLine(counts: ImportCounts): string {
  return `created ${counts.created}, updated ${counts.updated}, published ${counts.published}, unchanged ${counts.unchanged}, skipped ${counts.skipped}`;
}
