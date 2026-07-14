import Link from "next/link";

export function CourseCompletionBanner({
  courseTitle,
  percentage,
  certificateEnabled,
  courseHref,
}: {
  courseTitle: string;
  percentage: number;
  certificateEnabled: boolean;
  courseHref: string;
}) {
  if (percentage < 100) return null;

  return (
    <section className="rounded-2xl border border-mint/35 bg-mint/10 p-5" role="status" aria-live="polite">
      <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-mint">Course complete</p>
      <h2 className="mt-2 font-display text-xl text-white">You finished {courseTitle}</h2>
      <p className="mt-2 text-sm text-white/60">
        {certificateEnabled
          ? "You may be eligible for a certificate once staff confirm completion. Check Certificates when it is issued."
          : "Great work. Continue with related courses, mentorship, or opportunities from your home dashboard."}
      </p>
      <div className="mt-4 flex flex-wrap gap-3 text-sm">
        <Link href={courseHref} className="text-baby-blue hover:underline">
          Review course
        </Link>
        {certificateEnabled ? (
          <Link href="/app/certificates" className="text-baby-blue hover:underline">
            Open certificates
          </Link>
        ) : (
          <Link href="/app" className="text-baby-blue hover:underline">
            Back to home
          </Link>
        )}
      </div>
    </section>
  );
}
