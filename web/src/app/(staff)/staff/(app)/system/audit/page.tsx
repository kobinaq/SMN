import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection, relationId } from "@/lib/staff/records";

export default async function StaffAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const staff = await requireStaff(["support", "analyst"], "/staff/system/audit");
  const payload = await getPayloadClient();
  const params = await searchParams;
  const q = params.q?.trim();
  const events = await listCollection(payload, staff, "audit-events", {
    limit: 100,
    sort: "-createdAt",
    depth: 1,
    where: q
      ? {
          or: [
            { action: { contains: q } },
            { entityType: { contains: q } },
            { entityId: { contains: q } },
            { reason: { contains: q } },
          ],
        }
      : undefined,
  });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="System"
        title="Audit log"
        description="Searchable record of consequential staff actions across operations and credentials."
      />
      <StaffPanel>
        <form className="mb-4 flex flex-col gap-3 sm:flex-row" method="get">
          <input
            name="q"
            defaultValue={q || ""}
            placeholder="Search action, entity, or reason"
            className="field w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-white/35"
          />
          <button type="submit" className="rounded-full border border-baby-blue/40 bg-baby-blue/15 px-4 py-3 text-sm text-baby-blue">
            Search
          </button>
        </form>
        {events.docs.length ? (
          <StaffTable
            columns={["Action", "Entity", "Actor", "When"]}
            rows={events.docs.map((doc) => {
              const actor = doc.actor && typeof doc.actor === "object" ? doc.actor : null;
              return {
                key: String(doc.id),
                cells: [
                  <span key="a">
                    <b className="block text-white">{doc.action}</b>
                    <small className="text-xs text-white/40">{doc.reason}</small>
                  </span>,
                  `${doc.entityType} · ${doc.entityId}`,
                  actor && "email" in actor ? String(actor.email) : relationId(doc.actor) || "—",
                  doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-GH") : "—",
                ],
              };
            })}
          />
        ) : (
          <StaffEmpty>{q ? "No audit events match that search." : "No audit events recorded yet."}</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
