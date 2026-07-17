export default function SiteLoading() {
  return (
    <div
      className="container-page flex min-h-[60svh] flex-col items-center justify-center gap-4 py-24"
      aria-busy="true"
      aria-live="polite"
    >
      <span
        className="h-8 w-8 animate-spin rounded-full border-2 border-white/15 border-t-baby-blue"
        aria-hidden
      />
      <p className="text-sm text-white/45">Loading…</p>
    </div>
  );
}
