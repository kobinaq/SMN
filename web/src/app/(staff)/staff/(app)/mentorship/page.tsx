import Link from "next/link";
import { MentorDecision, RequestTransition } from "@/components/payload/MentorshipActions";
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

const rel = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && "id" in value ? (value as Record<string, unknown>) : null;

export default async function StaffMentorshipPage() {
  const staff = await requireStaff(["mentorship", "support"], "/staff/mentorship");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);

  const [mentors, requests, relationships] = await Promise.all([
    payload.find({ collection: "mentors", depth: 1, limit: 200, sort: "createdAt", ...access }),
    payload.find({ collection: "mentorship-requests", depth: 2, limit: 300, sort: "createdAt", ...access }),
    payload.find({ collection: "mentorship-relationships", depth: 1, limit: 300, sort: "-updatedAt", ...access }),
  ]);

  const activeByMentor = new Map<string, number>();
  for (const item of relationships.docs) {
    if (item.status === "active") {
      const key = String(rel(item.mentor)?.id ?? item.mentor);
      activeByMentor.set(key, (activeByMentor.get(key) || 0) + 1);
    }
  }

  const pending = mentors.docs.filter((item) => item.status === "draft");
  const open = requests.docs.filter((item) => ["new", "reviewing"].includes(String(item.status)));
  const activeCount = relationships.docs.filter((item) => item.status === "active").length;
  const isEmptyWorkspace = !pending.length && !open.length && !mentors.docs.length;

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader eyebrow="Work" title="Mentorship" hint="Approve mentors and move requests forward." />

      <StaffMetricGrid
        items={[
          { label: "Awaiting review", value: pending.length },
          { label: "Open requests", value: open.length },
          { label: "Active pairs", value: activeCount },
        ]}
      />

      {isEmptyWorkspace ? (
        <StaffEmptyState
          title="Set up mentorship"
          steps={[
            { label: "Wait for applications", active: true },
            { label: "Approve mentors" },
            { label: "Match requests" },
          ]}
          action={{ href: "/staff", label: "Back to Today" }}
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          <StaffPanel>
            <StaffSection title="Mentor applications" />
            <StaffQueue
              defaultFilter="needs"
              emptyTitle="No applications waiting"
              items={pending.map((mentor) => {
                const member = rel(mentor.member);
                return {
                  id: String(mentor.id),
                  bucket: "needs",
                  createdAt: mentor.createdAt ? Date.parse(String(mentor.createdAt)) : 0,
                  title: String(member?.name ?? mentor.title),
                  detail: `${mentor.seniority} · ${mentor.availability}`,
                  actions: <MentorDecision mentorId={mentor.id} />,
                };
              })}
              filters={[
                { id: "needs", label: "Needs decision", match: () => true },
                { id: "all", label: "All", match: () => true },
              ]}
            />
          </StaffPanel>

          <StaffPanel>
            <StaffSection title="Request queue" />
            <StaffQueue
              defaultFilter="needs"
              emptyTitle="No open requests"
              items={requests.docs.map((item) => {
                const requester = rel(item.requester);
                const mentor = rel(item.mentor);
                const status = String(item.status);
                const needs = ["new", "reviewing"].includes(status);
                return {
                  id: String(item.id),
                  bucket: needs ? "needs" : "other",
                  createdAt: item.createdAt ? Date.parse(String(item.createdAt)) : 0,
                  title: item.topic,
                  detail: `${String(requester?.name ?? "Member")} → ${String(mentor?.title ?? "Mentor")} · ${status}`,
                  actions: <RequestTransition requestId={item.id} current={status} />,
                };
              })}
              filters={[
                { id: "needs", label: "Needs decision", match: (item) => item.bucket === "needs" },
                { id: "all", label: "All", match: () => true },
              ]}
            />
          </StaffPanel>

          <StaffPanel>
            <StaffSection title="Capacity" />
            {mentors.docs.filter((item) => item.status === "approved").length ? (
              mentors.docs
                .filter((item) => item.status === "approved")
                .map((item) => (
                  <StaffOpsRow
                    key={item.id}
                    title={item.title}
                    detail={`${activeByMentor.get(String(item.id)) || 0} of ${item.maxActiveMentees ?? 0} active · ${item.availability}`}
                  />
                ))
            ) : (
              <p className="text-sm text-white/45">No approved mentors yet.</p>
            )}
          </StaffPanel>

          <StaffPanel>
            <StaffSection title="Relationships" />
            {relationships.docs.length ? (
              relationships.docs.slice(0, 25).map((item) => (
                <StaffOpsRow
                  key={item.id}
                  title={`Pair #${item.id}`}
                  detail={`${item.status} · ${item.menteeFeedback || item.mentorFeedback ? "Feedback in" : "Awaiting feedback"}`}
                />
              ))
            ) : (
              <p className="text-sm text-white/45">No relationships yet.</p>
            )}
            <p className="mt-4 text-xs text-white/35">
              <Link href="/staff/members" className="text-baby-blue hover:underline">
                Open People →
              </Link>
            </p>
          </StaffPanel>
        </div>
      )}
    </div>
  );
}
