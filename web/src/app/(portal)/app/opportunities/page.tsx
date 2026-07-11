import Link from "next/link";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { requireMember } from "@/lib/auth/member";
import { getMemberOpportunityActivity, getPublishedOpportunities } from "@/lib/opportunities";

export const metadata = { title: "Opportunities" };

export default async function OpportunitiesAppPage() {
  const member = await requireMember("/app/opportunities");
  const [opportunities, activity] = await Promise.all([getPublishedOpportunities(), getMemberOpportunityActivity(member.id)]);
  return <div className="space-y-8"><div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Opportunities</p><h1 className="mt-3 font-display text-2xl text-white sm:text-3xl">Marketing jobs & gigs</h1><p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">A moderated mix of SMN listings and relevant roles imported from employers’ public career feeds.</p></div><Button href="/app/profile" variant="secondary">Strengthen profile</Button></div>
  {opportunities.length ? <OpportunityDirectory opportunities={opportunities} /> : <div className="rounded-2xl border border-dashed border-white/15 bg-surface p-7 sm:p-10"><h2 className="font-display text-xl text-white">Listings are being reviewed</h2><p className="mt-2 text-sm text-white/50">Staff can publish manual opportunities or approve roles collected from configured company sources.</p><Button href="/employers" variant="secondary" className="mt-6">For employers</Button></div>}
  {activity.length ? <section className="rounded-2xl border border-white/10 bg-ink p-5 sm:p-6"><h2 className="font-display text-xl text-white">Your application activity</h2><div className="mt-4 divide-y divide-white/10">{activity.map((item) => <Link key={item.id} href={`/app/opportunities/${item.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm"><span><span className="text-white">{item.title}</span><span className="ml-2 text-white/40">{item.company}</span></span><span className="capitalize text-baby-blue">{item.status}</span></Link>)}</div></section> : null}</div>;
}