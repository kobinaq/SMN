import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { listCollection } from "@/lib/staff/records";

export default async function StaffAiActivityPage() {
  const staff = await requireStaff(["learning", "support", "analyst"], "/staff/system/ai");
  const payload = await getPayloadClient();
  const [usage, feedback] = await Promise.all([
    listCollection(payload, staff, "ai-usage-records", { limit: 50, sort: "-createdAt" }),
    listCollection(payload, staff, "ai-feedback", { limit: 50, sort: "-createdAt" }),
  ]);

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="System"
        title="AI activity"
        description="Read-only usage and feedback telemetry. AI features remain independently flagged and never auto-publish."
      />
      <StaffPanel>
        <h2 className="mb-3 font-display text-xl text-white">Recent usage</h2>
        {usage.docs.length ? (
          <StaffTable
            columns={["Feature", "Status", "Model", "Latency", "When"]}
            rows={usage.docs.map((doc) => ({
              key: String(doc.id),
              cells: [
                `${doc.feature} · ${doc.operation}`,
                doc.status,
                doc.model || doc.provider || "—",
                doc.latencyMs != null ? `${doc.latencyMs} ms` : "—",
                doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-GH") : "—",
              ],
            }))}
          />
        ) : (
          <StaffEmpty>No AI usage recorded yet.</StaffEmpty>
        )}
      </StaffPanel>
      <StaffPanel>
        <h2 className="mb-3 font-display text-xl text-white">Member feedback</h2>
        {feedback.docs.length ? (
          <StaffTable
            columns={["Feature", "Rating", "Reason", "When"]}
            rows={feedback.docs.map((doc) => ({
              key: String(doc.id),
              cells: [
                doc.feature,
                doc.rating,
                doc.reason || "—",
                doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-GH") : "—",
              ],
            }))}
          />
        ) : (
          <StaffEmpty>No AI feedback submitted yet.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
