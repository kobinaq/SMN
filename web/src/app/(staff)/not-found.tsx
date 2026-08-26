import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Route-group 404 for /staff/*.
 *
 * This app has no root layout — each route group renders its own <html> via
 * SiteDocument. A `not-found` file renders *inside* the nearest layout, so it
 * must render bare content here; the global app/not-found.tsx supplies its own
 * document because it also serves URLs that match no group at all. Without
 * this file, notFound() inside /staff rendered a second <html> inside the
 * staff document and produced a hydration error.
 */
export default function StaffNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow text-accent">Error 404</p>
      <h1 className="mt-4 font-display text-3xl text-text-1 sm:text-4xl">This staff page isn&rsquo;t here</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-text-2">
        The record may have been deleted, or the link is out of date.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button href="/staff">Back to Today</Button>
        <Button href="/staff/learning" variant="secondary">
          All courses
        </Button>
      </div>
      <nav aria-label="Staff sections" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-text-3">
        <Link href="/staff/members" className="transition-colors hover:text-text-1">
          People
        </Link>
        <Link href="/staff/events" className="transition-colors hover:text-text-1">
          Events
        </Link>
        <Link href="/staff/certificates" className="transition-colors hover:text-text-1">
          Certificates
        </Link>
      </nav>
    </main>
  );
}
