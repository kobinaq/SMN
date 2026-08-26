import type { DataFailure } from "@/lib/staff/data-health";

/**
 * Shown in place of a page's data when the query behind it failed.
 *
 * Staff are administrators of this system, so the raw error is available under
 * a disclosure — the alternative is an opaque 500 that tells them nothing and
 * costs a developer an afternoon.
 */
export function StaffDataFailure({ failure }: { failure: DataFailure }) {
  return (
    <div
      role="alert"
      className="rounded-[var(--radius-lg)] border border-danger/30 bg-danger-bg p-5 sm:p-6"
    >
      <p className="eyebrow text-danger">Data unavailable</p>
      <h2 className="mt-3 font-display text-xl text-text-1">{failure.message}</h2>
      {failure.hint ? (
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-2">{failure.hint}</p>
      ) : null}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-text-3">Technical detail</summary>
        <pre className="mt-2 max-w-full overflow-x-auto whitespace-pre-wrap break-words rounded-[var(--radius-md)] bg-inset p-3 font-mono text-xs text-text-2">
          {failure.detail}
        </pre>
      </details>
    </div>
  );
}
