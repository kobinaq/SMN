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
    <section
      className="rise rounded-[var(--radius-lg)] border border-ai/30 bg-ai-bg p-5"
      role="status"
      aria-live="polite"
    >
      <p className="eyebrow text-ai">Course complete</p>
      <h2 className="mt-2 font-display text-xl text-text-1">You finished {courseTitle}</h2>
      <p className="mt-2 text-sm text-text-2">
        {certificateEnabled
          ? "You may be eligible for a certificate once staff confirm completion. Check Certificates when it is issued."
          : "Great work. Continue with related courses, mentorship, or opportunities from your home dashboard."}
      </p>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <Link href={courseHref} className="text-ai hover:underline">
          Review course
        </Link>
        {certificateEnabled ? (
          <Link href="/app/certificates" className="text-ai hover:underline">
            Open certificates
          </Link>
        ) : (
          <Link href="/app" className="text-ai hover:underline">
            Back to home
          </Link>
        )}
      </div>
    </section>
  );
}
