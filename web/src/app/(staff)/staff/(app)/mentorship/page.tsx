import Link from "next/link";
import { MentorDecision, RequestTransition } from "@/components/payload/MentorshipActions";
import { StaffEmpty, StaffMetricGrid, StaffOpsRow, StaffPageHeader, StaffPanel, staffOpsChrome } from "@/components/staff/ui";
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
    payload.find({ collection: "mentors", depth: 1, limit: 200, sort: "-createdAt", ...access }),
    payload.find({ collection: "mentorship-requests", depth: 2, limit: 300, sort: "-createdAt", ...access }),
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

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Mentorship operations"
        title="Mentorship"
        description="Review mentors, protect capacity, manage introductions, and close the feedback loop."
      />

      <StaffMetricGrid
        items={[
          { label: "Mentors awaiting review", value: pending.length },
          { label: "Open requests", value: open.length },
          { label: "Active relationships", value: activeCount },
        ]}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Mentor applications</h2>
          {pending.length ? (
            pending.map((mentor) => {
              const member = rel(mentor.member);
              return (
                <StaffOpsRow
                  key={mentor.id}
                  title={String(member?.name ?? mentor.title)}
                  detail={`${mentor.seniority} · ${mentor.availability}`}
                >
                  <MentorDecision mentorId={mentor.id} />
                </StaffOpsRow>
              );
            })
          ) : (
            <StaffEmpty>No mentor applications need review.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Request queue</h2>
          {requests.docs.length ? (
            requests.docs.map((item) => {
              const requester = rel(item.requester);
              const mentor = rel(item.mentor);
              return (
                <StaffOpsRow
                  key={item.id}
                  title={item.topic}
                  detail={`${String(requester?.name ?? "Member")} → ${String(mentor?.title ?? "Mentor")} · ${item.status}`}
                >
                  <RequestTransition requestId={item.id} current={String(item.status)} />
                </StaffOpsRow>
              );
            })
          ) : (
            <StaffEmpty>No mentorship requests yet.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Mentor capacity</h2>
          {mentors.docs.filter((item) => item.status === "approved").length ? (
            mentors.docs
              .filter((item) => item.status === "approved")
              .map((item) => (
                <StaffOpsRow
                  key={item.id}
                  title={item.title}
                  detail={`${activeByMentor.get(String(item.id)) || 0} active of ${item.maxActiveMentees ?? 0} · ${item.availability}`}
                />
              ))
          ) : (
            <StaffEmpty>No approved mentors yet.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h2 className="mb-3 font-display text-xl text-white">Relationships & feedback</h2>
          {relationships.docs.length ? (
            relationships.docs.map((item) => (
              <StaffOpsRow
                key={item.id}
                title={`Relationship #${item.id}`}
                detail={`${item.status} · ${item.menteeFeedback || item.mentorFeedback ? "Feedback recorded" : "Awaiting feedback"}`}
              />
            ))
          ) : (
            <StaffEmpty>No relationships yet.</StaffEmpty>
          )}
          <p className="mt-4 text-xs text-white/35">
            Need member context?{" "}
            <Link href="/staff/members" className="text-baby-blue hover:underline">
              Open Member 360
            </Link>
          </p>
        </StaffPanel>
      </div>
    </div>
  );
}
