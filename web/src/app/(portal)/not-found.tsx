import Link from "next/link";
import { Button } from "@/components/ui/Button";

/**
 * Route-group 404 for /app/*. Renders bare content because the portal layout
 * already supplies <html>/<body> — see the note in (staff)/not-found.tsx.
 * Member pages call notFound() for courses and lessons they cannot access.
 */
export default function PortalNotFound() {
  return (
    <main className="flex min-h-svh flex-col items-center justify-center px-6 py-24 text-center">
      <p className="eyebrow text-accent">Error 404</p>
      <h1 className="mt-4 font-display text-3xl text-text-1 sm:text-4xl">We couldn&rsquo;t find that</h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-text-2">
        This page may have moved, or it isn&rsquo;t unlocked for your account yet.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Button href="/app">Back to home</Button>
        <Button href="/app/learning" variant="secondary">
          Your learning
        </Button>
      </div>
      <nav aria-label="Portal sections" className="mt-10 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-text-3">
        <Link href="/app/events" className="transition-colors hover:text-text-1">
          Events
        </Link>
        <Link href="/app/mentors" className="transition-colors hover:text-text-1">
          Mentors
        </Link>
        <Link href="/app/opportunities" className="transition-colors hover:text-text-1">
          Opportunities
        </Link>
      </nav>
    </main>
  );
}
