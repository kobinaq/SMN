/* Expiry queues intentionally use the current server request time. */
/* eslint-disable react-hooks/purity */
import { OpportunityActions } from "@/components/payload/OpportunityActions";
import { StaffQueue } from "@/components/staff/StaffQueue";
import {
  StaffEmptyState,
  StaffMetricGrid,
  StaffOpsRow,
  StaffPageHeader,
  StaffPanel,
  StaffSection,
  staffOpsChrome,
} from "@/components/staff/ui";
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
    payload.find({ collection: "opportunities", depth: 0, limit: 200, sort: "createdAt", ...access }),
    payload.find({ collection: "opportunity-applications", depth: 1, limit: 500, sort: "-createdAt", ...access }),
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
  const failing = sources.docs.filter((item) => item.lastError);

  const applicationCounts = new Map<string, number>();
  for (const item of applications.docs) {
    const id = String(typeof item.opportunity === "object" ? item.opportunity.id : item.opportunity);
    applicationCounts.set(id, (applicationCounts.get(id) || 0) + 1);
  }

  const triageItems = [
    ...pending.map((item) => ({
      id: `pending-${item.id}`,
      bucket: "needs" as const,
      createdAt: item.createdAt ? Date.parse(String(item.createdAt)) : 0,
      title: item.title,
      detail: `${item.company} · ${item.sourceLabel} · ${applicationCounts.get(String(item.id)) || 0} apps`,
      actions: <OpportunityActions opportunityId={item.id} current={String(item.status)} />,
    })),
    ...[...expired, ...expiring].map((item) => ({
      id: `expiry-${item.id}`,
      bucket: "expiry" as const,
      createdAt: item.expiresAt ? Date.parse(String(item.expiresAt)) : 0,
      title: item.title,
      detail: `${item.company}${formatExpiry(item.expiresAt)}`,
      actions: <OpportunityActions opportunityId={item.id} current={String(item.status)} />,
    })),
  ];

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader eyebrow="Work" title="Jobs" hint="Moderate listings and clear expiry risk." />

      <StaffMetricGrid
        items={[
          { label: "Needs decision", value: pending.length },
          { label: "Expiry actions", value: expiring.length + expired.length },
          { label: "Applications", value: applications.totalDocs },
          { label: "Failing sources", value: failing.length },
        ]}
      />

      {!triageItems.length && !duplicates.length && !sources.docs.length ? (
        <StaffEmptyState
          title="No jobs to review"
          steps={[
            { label: "Connect a source", active: true },
            { label: "Moderate listings" },
            { label: "Publish" },
          ]}
          action={{ href: "/staff", label: "Back to Today" }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <StaffPanel className="lg:col-span-2">
            <StaffSection title="Triage" />
            <StaffQueue
              defaultFilter="needs"
              emptyTitle="You're clear"
              items={triageItems}
              filters={[
                { id: "needs", label: "Needs decision", match: (item) => item.bucket === "needs" },
                { id: "expiry", label: "Expiry", match: (item) => item.bucket === "expiry" },
                { id: "all", label: "All", match: () => true },
              ]}
            />
          </StaffPanel>

          <StaffPanel>
            <StaffSection title="Possible duplicates" />
            {duplicates.length ? (
              duplicates.slice(0, 10).map((group, index) => (
                <div key={index} className="mb-4 border-b border-white/5 pb-3 last:mb-0 last:border-0 last:pb-0">
                  {group.map((item) => (
                    <StaffOpsRow
                      key={item.id}
                      title={item.title}
                      detail={`${item.company} · ${item.sourceLabel}`}
                    >
                      <OpportunityActions opportunityId={item.id} current={String(item.status)} />
                    </StaffOpsRow>
                  ))}
                </div>
              ))
            ) : (
              <p className="text-sm text-white/45">No duplicate groups.</p>
            )}
          </StaffPanel>

          <StaffPanel>
            <StaffSection title="Sources" />
            {sources.docs.length ? (
              sources.docs.map((source) => (
                <StaffOpsRow
                  key={source.id}
                  title={source.name}
                  detail={
                    source.lastError
                      ? `Failure: ${source.lastError}`
                      : `Healthy · ${source.lastFetchedCount ?? 0} fetched`
                  }
                />
              ))
            ) : (
              <p className="text-sm text-white/45">No sources configured.</p>
            )}
          </StaffPanel>
        </div>
      )}
    </div>
  );
}
