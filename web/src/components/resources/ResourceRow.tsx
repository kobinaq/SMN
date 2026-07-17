import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Download,
  FileText,
  ListChecks,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { ResourceItem } from "@/lib/content";
import { cn } from "@/lib/utils";

const typeIcon = {
  Template: FileText,
  "AI Prompts": Sparkles,
  Checklist: ListChecks,
  Toolkit: Wrench,
  Guide: BookOpen,
} as const;

export function ResourceRow({
  resource,
  className,
}: {
  resource: ResourceItem;
  className?: string;
}) {
  const Icon = typeIcon[resource.type as keyof typeof typeIcon] ?? FileText;

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className={cn(
        "group grid items-center gap-4 rounded-xl border border-white/10 bg-surface px-4 py-4 transition duration-300",
        "hover:border-baby-blue/40 hover:bg-surface-2 hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-18px_rgba(126,182,255,0.35)] active:translate-y-0 sm:grid-cols-[auto_1fr_auto] sm:gap-6 sm:px-5 sm:py-5",
        className,
      )}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-near-black text-baby-blue sm:h-14 sm:w-14">
        <Icon className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={1.75} />
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-medium uppercase tracking-wider text-white/40">
            {resource.type}
          </span>
          {resource.free ? (
            <span className="rounded bg-mint/15 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-mint">
              Free
            </span>
          ) : null}
        </div>
        <h3 className="mt-1 font-display text-base text-white transition group-hover:text-baby-blue sm:text-lg">
          {resource.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-white/50 sm:line-clamp-1">
          {resource.description}
        </p>
        <p className="mt-2 text-[11px] text-white/35 sm:text-xs">
          {resource.format} · {resource.level}
        </p>
      </div>

      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-baby-blue">
          <Download className="h-3.5 w-3.5" />
          Get free
          <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}
