import type { EventItem } from "@/lib/content";
import { events as seedEvents, eventTypes } from "@/lib/content";
import { getEvents as getCmsEvents } from "@/lib/cms";
import { img } from "@/lib/images";

export { eventTypes };

export function formatEventDate(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatEventDay(dateStr: string) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return { day: "—", month: "—" };
  return {
    day: d.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
  };
}

export function isUpcoming(dateStr: string, now = new Date()) {
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return true;
  const end = new Date(d);
  end.setHours(23, 59, 59, 999);
  return end.getTime() >= now.getTime();
}

/** Normalize CMS records with seed detail when available */
export async function getEventCalendar(): Promise<EventItem[]> {
  const fromCms = await getCmsEvents();
  const seedBySlug = Object.fromEntries(seedEvents.map((e) => [e.slug, e]));

  const merged = fromCms.map((e) => {
    const seed = seedBySlug[e.slug];
    return {
      ...seed,
      ...e,
      id: e.id,
      image: e.image || seed?.image || img.defaultEvent,
      format: e.format || seed?.format || "Online",
      price: e.price || seed?.price || "Free",
      host: e.host || seed?.host || "SMN",
      highlights: e.highlights?.length ? e.highlights : seed?.highlights || [],
      registrationUrl: `/events/${e.slug}`,
    } satisfies EventItem;
  });

  // Seed-only fallbacks have no DB id and cannot accept first-party registration.
  if (merged.length === 0) return seedEvents;

  // Prefer CMS docs (with ids). Only add seed extras for calendar preview, not as registerable rows.
  const slugs = new Set(merged.map((e) => e.slug));
  const extras = seedEvents.filter((e) => !slugs.has(e.slug));
  return [...merged, ...extras].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getNextEvent(events: EventItem[]) {
  const upcoming = events.filter((e) => isUpcoming(e.date));
  return upcoming[0] ?? events[0];
}

export async function getEventBySlug(slug: string): Promise<EventItem | null> {
  const all = await getEventCalendar();
  return all.find((item) => item.slug === slug) || null;
}
