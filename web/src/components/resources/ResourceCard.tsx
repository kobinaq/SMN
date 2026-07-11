import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, ListChecks, Sparkles, Wrench, BookOpen } from "lucide-react";
import type { ResourceItem } from "@/lib/content";
import { cn } from "@/lib/utils";

const typeIcon = {
  Template: FileText,
  "AI Prompts": Sparkles,
  Checklist: ListChecks,
  Toolkit: Wrench,
  Guide: BookOpen,
} as const;

export function ResourceCard({
  resource,
  className,
  priority,
}: {
  resource: ResourceItem;
  className?: string;
  priority?: boolean;
}) {
  const Icon =
    typeIcon[resource.type as keyof typeof typeIcon] ?? FileText;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className={cn(
        "group flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-surface transition duration-300 hover:border-baby-blue/35 sm:rounded-[1.75rem]",
        className,
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <div className="absolute inset-0 transition duration-500 ease-out group-hover:scale-[1.03]">
          <Image
            src={resource.cover}
            alt=""
            fill
            priority={priority}
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          <div className="image-matte" />
        </div>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2 sm:left-4 sm:top-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-near-black/80 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-baby-blue">
            <Icon className="h-3 w-3" />
            {resource.type}
          </span>
          {resource.free ? (
            <span className="rounded-full bg-mint/20 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-mint">
              Free
            </span>
          ) : null}
        </div>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-white/40 sm:text-xs">
          <span>{resource.format}</span>
          <span aria-hidden>·</span>
          <span>{resource.level}</span>
        </div>
        <h3 className="mt-3 font-display text-lg leading-snug text-white transition group-hover:text-baby-blue sm:text-xl">
          {resource.title}
        </h3>
        <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-white/55">
          {resource.description}
        </p>
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-baby-blue">
          View resource
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
