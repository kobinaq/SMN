/* Expiry queues intentionally use the current server request time. */
/* eslint-disable react-hooks/purity */
import { OpportunityActions } from "@/components/payload/OpportunityActions";
import { StaffEmpty, StaffMetricGrid, StaffOpsRow, StaffPageHeader, StaffPanel, staffOpsChrome } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

function formatExpiry(value: string | null | undefined) {
  if (!value) return "";
  return ` · expires ${new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(value))}`;
}

export default async function StaffOpportunitiesPage() {
  const staff = await requireStaff(["opportunity", "support"], "/staff/opportunities");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);

  const [opportunities, applications, sources] = await Promise.all([
    payload.find({ collection: "opportunities", depth: 0, limit: 1000, sort: "-updatedAt", ...access }),
    payload.find({ collection: "opportunity-applications", depth: 1, limit: 1000, sort: "-createdAt", ...access }),
    payload.find({ collection: "opportunity-sources", depth: 0, limit: 200, sort: "name", ...access }),
  ]);

  const now = Date.now();
  const soon = now + 14 * 86400000;
  const pending = opportunities.docs.filter((item) => item.status === "pending");
  const expiring = opportunities.docs.filter(
    (item) => item.status === "published" && item.expiresAt && Date.parse(item.expiresAt) >= now && Date.parse(item.expiresAt) <= soon,
  );
  const expired = opportunities.docs.filter(
    (item) => item.status === "published" && item.expiresAt && Date.parse(item.expiresAt) < now,
  );

  const byFingerprint = new Map<string, typeof opportunities.docs>();
  for (const item of opportunities.docs) {
    if (item.fingerprint) byFingerprint.set(item.fingerprint, [...(byFingerprint.get(item.fingerprint) || []), item]);
  }
  const duplicates = [...byFingerprint.values()].filter((items) => items.length > 1);

  const applicationCounts = new Map<string, number>();
  for (const item of applications.docs) {
    const id = String(typeof item.opportunity === "object" ? item.opportunity.id : item.opportunity);
    applicationCounts.set(id, (applicationCounts.get(id) || 0) + 1);
  }

  function row(item: (typeof opportunities.docs)[number]) {
    return (
      <StaffOpsRow
        key={item.id}
        title={item.title}
        detail={`${item.company} · ${item.sourceLabel} · ${applicationCounts.get(String(item.id)) || 0} applications${formatExpiry(item.expiresAt)}`}
      >
        <OpportunityActions opportunityId={item.id} current={String(item.status)} />
      </StaffOpsRow>
    );
  }

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Opportunity operations"
        title="Opportunity Operations"
        description="Moderation, expiry, applications, duplicate candidates, and source health in one workspace."
      />

      <StaffMetricGrid
        items={[
          { label: "Pending moderation", value: pending.length },
          { label: "Expiry actions", value: expiring.length + expired.length },
          { label: "Applications", value: applications.totalDocs },
          { label: "Duplicate groups", value: duplicates.length },
          { label: "Failing sources", value: sources.docs.filter((item) => item.lastError).length },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Moderation queue</h2>
          {pending.length ? pending.map(row) : <StaffEmpty>No listings await moderation.</StaffEmpty>}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Expiry queue</h2>
          {[...expired, ...expiring].length ? [...expired, ...expiring].map(row) : <StaffEmpty>No published listings require expiry action.</StaffEmpty>}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Duplicate candidates</h2>
          {duplicates.length ? (
            duplicates.map((group, index) => (
              <div key={index} className="mb-4 border-b border-white/5 pb-3 last:mb-0 last:border-0 last:pb-0">
                {group.map(row)}
              </div>
            ))
          ) : (
            <StaffEmpty>No duplicate fingerprints detected.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Source health</h2>
          {sources.docs.length ? (
            sources.docs.map((source) => (
              <StaffOpsRow
                key={source.id}
                title={source.name}
                detail={
                  source.lastError
                    ? `Failure: ${source.lastError}`
                    : `Healthy · ${source.lastFetchedCount ?? 0} fetched · ${source.lastCreatedCount ?? 0} created · ${source.lastDurationMs ?? 0} ms`
                }
              />
            ))
          ) : (
            <StaffEmpty>No opportunity sources configured.</StaffEmpty>
          )}
        </StaffPanel>
      </div>
    </div>
  );
}
