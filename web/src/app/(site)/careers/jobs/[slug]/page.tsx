import type { Metadata } from "next";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getMember } from "@/lib/auth/member";
import { getPublishedOpportunity } from "@/lib/opportunities";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const opportunity = await getPublishedOpportunity(slug);
    return {
      title: `${opportunity.title} · ${opportunity.company}`,
      description: opportunity.summary,
      alternates: { canonical: `/careers/jobs/${slug}` },
    };
  } catch {
    return { title: "Opportunity" };
  }
}

export default async function PublicJobPage({ params }: Props) {
  const { slug } = await params;
  const [opportunity, member] = await Promise.all([
    getPublishedOpportunity(slug),
    getMember(),
  ]);

  const backHref = opportunity.type === "Internship" ? "/careers/internships" : "/careers/jobs";
  const backLabel = opportunity.type === "Internship" ? "Internships" : "Job opportunities";
  const applyHref = member
    ? `/app/opportunities/${opportunity.slug}`
    : `/login?callbackUrl=${encodeURIComponent(`/app/opportunities/${opportunity.slug}`)}`;

  return (
    <article className="bg-near-black">
      <header className="border-b border-white/10 pt-[calc(5.5rem+env(safe-area-inset-top))] sm:pt-28">
        <div className="container-wide pb-12 sm:pb-16">
          <Link
            href={backHref}
            className="text-sm text-white/50 transition hover:text-white"
          >
            {backLabel}
          </Link>
          <p className="mt-6 text-[10px] font-medium uppercase tracking-[0.18em] text-baby-blue">
            {opportunity.company}
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl text-white sm:text-5xl md:text-6xl">
            {opportunity.title}
          </h1>
          <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1 text-sm text-white/50">
            <span>{opportunity.type}</span>
            <span>·</span>
            <span>{opportunity.workMode}</span>
            <span>·</span>
            <span>{opportunity.experienceLevel}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {opportunity.location}
            </span>
          </div>
          {opportunity.salary ? (
            <p className="mt-4 text-sm text-mint">{opportunity.salary}</p>
          ) : null}
        </div>
      </header>

      <div className="bg-ink py-12 sm:py-16">
        <div className="container-wide grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div>
            <p className="max-w-2xl text-base leading-relaxed text-white/65">{opportunity.summary}</p>
            <div className="mt-8 max-w-2xl whitespace-pre-line text-sm leading-7 text-white/60">
              {opportunity.description}
            </div>
          </div>
          <aside>
            <div className="rounded-[1.75rem] border border-white/10 bg-surface p-6 sm:p-7 lg:sticky lg:top-28">
              <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/40">
                Apply
              </p>
              <p className="mt-3 font-display text-xl text-white">
                {opportunity.expired ? "This listing has closed" : "Apply from a member account"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/50">
                Applications happen on the employer site. SMN records that you opened it so you can
                find it again.
              </p>
              {opportunity.expiresAt ? (
                <p className="mt-4 text-xs text-white/40">
                  Closing date ·{" "}
                  {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(
                    new Date(opportunity.expiresAt),
                  )}
                </p>
              ) : null}
              <div className="mt-6">
                {opportunity.expired ? (
                  <Button href={backHref} variant="secondary" className="w-full">
                    Back to listings
                  </Button>
                ) : (
                  <Button href={applyHref} className="w-full">
                    {member ? "Continue application" : "Sign in to apply"}
                  </Button>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
