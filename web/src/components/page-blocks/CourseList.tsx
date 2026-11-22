import { Band } from "@/components/site/kit";
import { getProgramsCatalogue } from "@/lib/programs/catalogue";
import { formatGhs } from "@/lib/currency";

export function formatMinor(price: number | null): string | null {
  return price == null ? null : formatGhs(price / 100);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GH", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export async function CourseListBlock({ heading, intro }: { heading?: string; intro?: string }) {
  const catalogue = await getProgramsCatalogue().catch(() => null);
  const rows = catalogue?.courses ?? [];
  return (
    <Band>
      {heading ? <h2 className="font-display display-3 text-text-1">{heading}</h2> : null}
      {intro ? <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-2">{intro}</p> : null}
      {rows.length ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {rows.map(({ course, nextCohort }) => {
            // Seats left is shown; seat totals are never exposed.
            const price = formatMinor(nextCohort ? nextCohort.price ?? course.defaultPrice : course.defaultPrice);
            return (
              <li key={course.id} className="rounded-2xl border border-edge-subtle bg-raised p-5">
                <h3 className="font-display text-lg text-text-1">{course.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-2">{course.summary}</p>
                <dl className="mt-4 space-y-1 text-sm text-text-2">
                  {nextCohort ? (
                    <>
                      <div><dt className="inline text-text-3">Next cohort: </dt><dd className="inline">{nextCohort.name}, starts {formatDate(nextCohort.startsAt)}</dd></div>
                      <div><dt className="inline text-text-3">Seats left: </dt><dd className="inline">{nextCohort.seatsLeft}</dd></div>
                    </>
                  ) : (
                    <div>No open cohort right now.</div>
                  )}
                  {price ? <div><dt className="inline text-text-3">Price: </dt><dd className="inline">{price}</dd></div> : null}
                </dl>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="mt-8 text-sm text-text-3">No courses to show yet.</p>
      )}
    </Band>
  );
}
