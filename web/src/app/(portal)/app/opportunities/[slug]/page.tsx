import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { OpportunityApplyButton } from "@/components/app/OpportunityApplyButton";
import { StatusBadge } from "@/components/ui/Feedback";
import { requireMember } from "@/lib/auth/member";
import { getMemberOpportunityActivity, getPublishedOpportunity } from "@/lib/opportunities";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const member = await requireMember("/app/opportunities");
  const opportunity = await getPublishedOpportunity((await params).slug);
  const activity = await getMemberOpportunityActivity(member.id);
  const mine = activity.find((item) => item.slug === opportunity.slug);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/app/opportunities" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white">
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>
      <article className="mt-6 rounded-2xl border border-white/10 bg-surface p-5 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-baby-blue">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {opportunity.expired ? <StatusBadge label="Expired" tone="danger" /> : <StatusBadge label="Open" tone="success" />}
            <StatusBadge label={opportunity.sourceLabel} />
            {mine ? <StatusBadge label={`Your status · ${mine.status}`} tone="info" /> : null}
          </div>
        </div>
        <p className="mt-6 text-xs uppercase tracking-[0.18em] text-baby-blue">{opportunity.company}</p>
        <h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{opportunity.title}</h1>
        <div className="mt-5 flex flex-wrap gap-3 text-sm text-white/50">
          <span>{opportunity.type}</span>
          <span>·</span>
          <span>{opportunity.workMode}</span>
          <span>·</span>
          <span>{opportunity.experienceLevel}</span>
          <span>·</span>
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            {opportunity.location}
          </span>
        </div>
        {opportunity.expiresAt ? (
          <p className="mt-3 text-xs text-white/40">
            Closing date · {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(opportunity.expiresAt))}
          </p>
        ) : null}
        {opportunity.salary ? <p className="mt-4 text-sm text-mint">{opportunity.salary}</p> : null}
        <div className="mt-8 whitespace-pre-line text-sm leading-7 text-white/65">{opportunity.description}</div>
        <div className="mt-8 border-t border-white/10 pt-6">
          {opportunity.expired ? (
            <p className="rounded-2xl border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100" role="status">
              This opportunity has expired and is no longer an active application option. You can still review the listing and your prior tracking status.
            </p>
          ) : (
            <OpportunityApplyButton opportunityId={opportunity.id} />
          )}
          <p className="mt-3 text-xs text-white/35">
            Applications happen on the employer’s website. SMN records that you opened the application so you can find it again — it does not auto-apply for you.
          </p>
        </div>
      </article>
    </div>
  );
}
