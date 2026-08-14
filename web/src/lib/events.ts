import type { EventItem } from "@/lib/content";
import { eventTypes } from "@/lib/content";
import { getEvents as getCmsEvents } from "@/lib/cms";

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

export async function getEventCalendar(): Promise<EventItem[]> {
  const fromCms = await getCmsEvents();
  return [...fromCms].sort(
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
