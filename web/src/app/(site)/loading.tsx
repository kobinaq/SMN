export default function SiteLoading() {
  return (
    <div
      className="container-page flex min-h-[60svh] flex-col items-center justify-center gap-4 py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-edge border-t-accent"
        aria-hidden
      />
      <p className="text-sm text-text-3">Loading…</p>
    </div>
  );
}
