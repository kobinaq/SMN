import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock, MapPin, Ticket } from "lucide-react";
import { EventRegisterButton } from "@/components/events/EventRegisterButton";
import { Button } from "@/components/ui/Button";
import { getMember } from "@/lib/auth/member";
import { formatEventDate, getEventBySlug } from "@/lib/events";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) return { title: "Event" };
  return { title: event.title, description: event.summary };
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);
  if (!event) notFound();

  const member = await getMember();
  let eventId: string | number | null = event.id ?? null;

  if (!eventId) {
    try {
      const payload = await getPayloadClient();
      const found = await payload.find({
        collection: "events",
        limit: 1,
        depth: 0,
        where: { slug: { equals: slug } },
      });
      eventId = found.docs[0]?.id ?? null;
    } catch {
      eventId = null;
    }
  }

  const pricing = event.pricing || (event.price.toLowerCase().includes("free") ? "free" : "paid");

  return (
    <div className="container-page py-16 sm:py-20">
      <p className="text-xs uppercase tracking-[0.2em] text-baby-blue">
        <Link href="/events" className="hover:underline">
          Events
        </Link>{" "}
        / {event.type}
      </p>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h1 className="font-display text-4xl text-white sm:text-5xl">{event.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/60">{event.summary}</p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            <li className="flex items-center gap-2 text-sm text-white/60">
              <CalendarDays className="h-4 w-4 text-baby-blue" />
              {formatEventDate(event.date)}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <Clock className="h-4 w-4 text-baby-blue" />
              {event.time || "See schedule"}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <MapPin className="h-4 w-4 text-baby-blue" />
              {event.venue || event.format}
            </li>
            <li className="flex items-center gap-2 text-sm text-white/60">
              <Ticket className="h-4 w-4 text-baby-blue" />
              {event.price}
            </li>
          </ul>
          {event.address ? <p className="mt-4 text-sm text-white/45">{event.address}</p> : null}
          {event.highlights?.length ? (
            <ul className="mt-8 space-y-2">
              {event.highlights.map((item) => (
                <li key={item} className="flex gap-2 text-sm text-white/55">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-mint" />
                  {item}
                </li>
              ))}
            </ul>
          ) : null}
        </div>

        <div className="space-y-5">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl border border-white/10">
            <Image src={event.image} alt="" fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" />
            <div className="image-matte" />
          </div>
          <div className="rounded-2xl border border-white/10 bg-surface p-6">
            <p className="text-sm text-white/50">Hosted by {event.host}</p>
            <p className="mt-2 font-display text-2xl text-white">{event.price}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              {eventId ? (
                <EventRegisterButton eventId={eventId} pricing={pricing} signedIn={Boolean(member)} />
              ) : (
                <Button href="/login">Sign in to register</Button>
              )}
              <Button href="/app/events" variant="secondary">
                My tickets
              </Button>
            </div>
            {!member ? (
              <p className="mt-3 text-xs text-white/40">Member sign-in required to register.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
