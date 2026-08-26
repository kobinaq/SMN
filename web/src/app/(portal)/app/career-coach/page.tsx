import { CareerCoach } from "@/components/app/CareerCoach";
import { requireMember } from "@/lib/auth/member";
import { getCareerSnapshot } from "@/lib/ai/career-tools";
import { getPayloadClient } from "@/lib/payload";

export const metadata = { title: "Career Coach" };

export default async function CareerCoachPage() {
  const member = await requireMember("/app/career-coach");
  if (process.env.AI_CAREER_COACH_ENABLED !== "true") {
    return <div className="mx-auto max-w-2xl border border-edge-subtle bg-raised p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-wider text-accent">Career Coach</p><h1 className="mt-3 font-display text-3xl text-text-1">Coming soon</h1><p className="mt-3 text-sm leading-relaxed text-text-2">This private AI workspace is not enabled for this environment yet. Your learning, opportunities, and profile remain available as usual.</p></div>;
  }
  const payload = await getPayloadClient();
  const snapshot = await getCareerSnapshot(payload, member.id);
  return <CareerCoach initial={snapshot} />;
}
