import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin } from "lucide-react";
import { OpportunityApplyButton } from "@/components/app/OpportunityApplyButton";
import { requireMember } from "@/lib/auth/member";
import { getPublishedOpportunity } from "@/lib/opportunities";

export default async function OpportunityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireMember("/app/opportunities");
  const opportunity = await getPublishedOpportunity((await params).slug);
  return <div className="mx-auto max-w-4xl"><Link href="/app/opportunities" className="inline-flex items-center gap-2 text-sm text-white/45 hover:text-white"><ArrowLeft className="h-4 w-4" />Back to opportunities</Link><article className="mt-6 rounded-2xl border border-white/10 bg-surface p-5 sm:p-8"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-baby-blue"><Briefcase className="h-5 w-5" /></div><p className="mt-6 text-xs uppercase tracking-[0.18em] text-baby-blue">{opportunity.company}</p><h1 className="mt-2 font-display text-3xl text-white sm:text-4xl">{opportunity.title}</h1><div className="mt-5 flex flex-wrap gap-3 text-sm text-white/50"><span>{opportunity.type}</span><span>·</span><span>{opportunity.workMode}</span><span>·</span><span>{opportunity.experienceLevel}</span><span>·</span><span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{opportunity.location}</span></div>{opportunity.salary ? <p className="mt-4 text-sm text-mint">{opportunity.salary}</p> : null}<div className="mt-8 whitespace-pre-line text-sm leading-7 text-white/65">{opportunity.description}</div><div className="mt-8 border-t border-white/10 pt-6"><OpportunityApplyButton opportunityId={opportunity.id} /><p className="mt-3 text-xs text-white/35">Applications happen on the employer’s website. SMN records that you opened the application so you can find it again.</p></div></article></div>;
}