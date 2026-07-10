import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { PageHero } from "@/components/layout/PageHero";
import { getEvents } from "@/lib/cms";

export const metadata: Metadata = {
  title: "Events",
  description: "Webinars, workshops, and networking events.",
};

export default async function EventsPage() {
  const events = await getEvents();
  return (
    <>
      <PageHero
        eyebrow="Events"
        title="Upcoming webinars, workshops, and networking."
        description="Register via the event link. Most webinars are free. Workshops may have limited seats."
      />
      <section className="border-t border-white/10 bg-ink pb-24">
        <div className="container-wide grid gap-6 lg:grid-cols-3">
          {events.map((event) => (
            <article
              key={event.slug}
              className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image src={event.image} alt="" fill className="object-cover" sizes="33vw" />
                <div className="image-matte" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.18em] text-mint">{event.type}</p>
                <h2 className="mt-3 font-display text-2xl text-white">{event.title}</h2>
                <p className="mt-2 text-sm text-white/45">
                  {new Date(event.date).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}{" "}
                  · {event.time}
                </p>
                <p className="mt-4 text-sm text-white/65 leading-relaxed">{event.summary}</p>
                <a
                  href={event.registrationUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-sm text-baby-blue hover:text-white"
                >
                  Register <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
