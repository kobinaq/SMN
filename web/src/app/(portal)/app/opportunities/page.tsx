import Link from "next/link";
import { OpportunityDirectory } from "@/components/app/OpportunityDirectory";
import { Button } from "@/components/ui/Button";
import { Card, PageHeader } from "@/components/ui/Surface";
import { requireMember } from "@/lib/auth/member";
import { getMemberOpportunityActivity, getPublishedOpportunities } from "@/lib/opportunities";

export const metadata = { title: "Opportunities" };

export default async function OpportunitiesAppPage() {
  const member = await requireMember("/app/opportunities");
  const [opportunities, activity] = await Promise.all([
    getPublishedOpportunities(),
    getMemberOpportunityActivity(member.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Opportunities"
        title="Marketing jobs & gigs"
        description="A moderated mix of SMN listings and relevant roles imported from employers' public career feeds."
        action={
          <Button href="/app/profile" variant="secondary">
            Strengthen profile
          </Button>
        }
      />

      {opportunities.length ? (
        <OpportunityDirectory opportunities={opportunities} />
      ) : (
        <Card className="border-dashed">
          <h2 className="font-display text-xl text-text-1">Listings are being reviewed</h2>
          <p className="mt-2 text-sm text-text-2">
            Staff can publish manual opportunities or approve roles collected from configured company sources.
          </p>
          <Button href="/employers" variant="secondary" className="mt-6">
            For employers
          </Button>
        </Card>
      )}

      {activity.length ? (
        <Card as="section">
          <h2 className="font-display text-xl text-text-1">Your application activity</h2>
          <div className="mt-4 divide-y divide-edge-subtle">
            {activity.map((item) => (
              <Link key={item.id} href={`/app/opportunities/${item.slug}`} className="flex items-center justify-between gap-4 py-3 text-sm">
                <span>
                  <span className="text-text-1">{item.title}</span>
                  <span className="ml-2 text-text-3">{item.company}</span>
                </span>
                <span className="text-accent capitalize">{item.status}</span>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
