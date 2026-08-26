import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "@/components/ui/icons";
import { OpportunityApplyButton } from "@/components/app/OpportunityApplyButton";
import { Card } from "@/components/ui/Surface";
import { Chip } from "@/components/ui/Chip";
import { requireMember } from "@/lib/auth/member";
import { getMemberOpportunityActivity, getPublishedOpportunity } from "@/lib/opportunities";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const member = await requireMember("/app/opportunities");
  const opportunity = await getPublishedOpportunity((await params).slug);
  const activity = await getMemberOpportunityActivity(member.id);
  const mine = activity.find((item) => item.slug === opportunity.slug);

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/app/opportunities" className="inline-flex items-center gap-2 text-sm text-text-3 transition-colors hover:text-text-1">
        <ArrowLeft className="h-4 w-4" />
        Back to opportunities
      </Link>
      <Card as="article" className="mt-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-accent-bg text-accent">
            <Briefcase className="h-5 w-5" />
          </div>
          <div className="flex flex-wrap gap-2">
            {opportunity.expired ? <Chip tone="danger">Expired</Chip> : <Chip tone="ai">Open</Chip>}
            <Chip tone="neutral">{opportunity.sourceLabel}</Chip>
            {mine ? <Chip tone="accent">Your status · {mine.status}</Chip> : null}
          </div>
        </div>
        <p className="eyebrow mt-6 text-accent">{opportunity.company}</p>
        <h1 className="mt-2 font-display text-3xl text-text-1 sm:text-4xl">{opportunity.title}</h1>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-text-2">
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
          <p className="tnum mt-3 text-xs text-text-3">
            Closing date · {new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(opportunity.expiresAt))}
          </p>
        ) : null}
        {opportunity.salary ? <p className="mt-4 text-sm text-ai">{opportunity.salary}</p> : null}
        <div className="mt-8 whitespace-pre-line text-sm leading-7 text-text-2">{opportunity.description}</div>
        <div className="mt-8 border-t border-edge-subtle pt-6">
          {opportunity.expired ? (
            <p className="rounded-[var(--radius-md)] border border-warn/30 bg-warn-bg px-4 py-3 text-sm text-warn" role="status">
              This opportunity has expired and is no longer an active application option. You can still review the
              listing and your prior tracking status.
            </p>
          ) : (
            <OpportunityApplyButton opportunityId={opportunity.id} />
          )}
          <p className="mt-3 text-xs text-text-3">
            Applications happen on the employer&rsquo;s website. SMN records that you opened the application so you can
            find it again — it does not auto-apply for you.
          </p>
        </div>
      </Card>
    </div>
  );
}
