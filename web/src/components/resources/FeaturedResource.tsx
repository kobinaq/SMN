import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import type { ResourceItem } from "@/lib/content";
import { Button } from "@/components/ui/Button";

export function FeaturedResource({ resource }: { resource: ResourceItem }) {
  return (
    <div className="grid overflow-hidden rounded-2xl border border-white/10 bg-surface sm:rounded-[2rem] lg:grid-cols-[1.1fr_0.9fr]">
      <div className="relative min-h-[220px] sm:min-h-[300px] lg:min-h-[400px]">
        <Image
          src={resource.cover}
          alt=""
          fill
          priority
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 55vw"
        />
        <div className="image-matte" />
        <div className="absolute left-4 top-4 flex gap-2">
          <span className="rounded-full bg-deep-blue px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white">
            Featured
          </span>
          {resource.free ? (
            <span className="rounded-full bg-mint/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mint">
              Free download
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col justify-center p-6 sm:p-8 lg:p-10">
        <p className="text-[11px] uppercase tracking-wider text-baby-blue sm:text-xs">
          {resource.type} · {resource.format}
        </p>
        <h2 className="mt-3 font-display text-2xl leading-tight text-white sm:text-3xl md:text-4xl">
          {resource.title}
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-white/60 sm:text-base">
          {resource.description}
        </p>
        {resource.highlights.length > 0 ? (
          <ul className="mt-5 space-y-2 text-sm text-white/65">
            {resource.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-2.5">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-baby-blue" />
                <span>{h}</span>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <Button href={`/resources/${resource.slug}`} className="sm:min-w-[160px]">
            <Download className="h-4 w-4" />
            Get free resource
          </Button>
          <Button href="/resources" variant="secondary" className="sm:min-w-[140px]">
            Browse library
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        <Link
          href={`/resources/${resource.slug}`}
          className="mt-4 text-sm text-white/40 transition hover:text-white"
        >
          See full details →
        </Link>
      </div>
    </div>
  );
}
