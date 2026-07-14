import Link from "next/link";
import { MemberNoteForm } from "@/components/payload/MemberNoteForm";
import { MemberPicker } from "@/components/staff/MemberPicker";
import { StaffEmpty, StaffMetricGrid, StaffPageHeader, StaffPanel, staffOpsChrome } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

const related = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && "id" in value ? (value as Record<string, unknown>) : null;

const readableDate = (value: unknown) =>
  value ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(String(value))) : "—";

export default async function StaffMembersPage({
  searchParams,
}: {
  searchParams: Promise<{ member?: string }>;
}) {
  const staff = await requireStaff(["support", "learning", "mentorship", "analyst"], "/staff/members");
  const payload = await getPayloadClient();
  const access = staffAccess(staff);
  const params = await searchParams;

  const members = await payload.find({ collection: "members", depth: 0, limit: 200, sort: "name", ...access });
  const requested = typeof params.member === "string" ? params.member : undefined;
  const member = members.docs.find((item) => String(item.id) === requested) ?? members.docs[0];

  if (!member) {
    return (
      <div className="space-y-6">
        <StaffPageHeader
          eyebrow="Member operations"
          title="Member 360"
          description="Profile, learning, credentials, work, relationships, and staff context in one place."
        />
        <StaffEmpty>No members are available yet.</StaffEmpty>
      </div>
    );
  }

  const memberFilter = { equals: member.id };
  const [enrollments, certificates, portfolios, mentorProfiles, mentorship, applications, notes, audit] = await Promise.all([
    payload.find({ collection: "enrollments", depth: 1, limit: 100, sort: "-updatedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "certificates", depth: 1, limit: 100, sort: "-issuedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "portfolios", depth: 0, limit: 100, sort: "-updatedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "mentors", depth: 0, limit: 10, where: { member: memberFilter }, ...access }),
    payload.find({ collection: "mentorship-requests", depth: 1, limit: 100, sort: "-createdAt", where: { requester: memberFilter }, ...access }),
    payload.find({ collection: "opportunity-applications", depth: 1, limit: 100, sort: "-createdAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "member-notes", depth: 1, limit: 100, sort: "-createdAt", where: { member: memberFilter }, ...access }),
    payload.find({
      collection: "audit-events",
      depth: 1,
      limit: 100,
      sort: "-createdAt",
      where: { and: [{ entityType: { equals: "members" } }, { entityId: { equals: String(member.id) } }] },
      ...access,
    }),
  ]);

  const activity = [
    ...enrollments.docs.map((item) => ({
      label: `Enrollment · ${item.programName}`,
      state: item.status,
      at: item.updatedAt,
      href: `/staff/learning?tab=learners`,
    })),
    ...certificates.docs.map((item) => ({
      label: `Certificate · ${item.title}`,
      state: item.status,
      at: item.issuedAt,
      href: `/staff/certificates`,
    })),
    ...applications.docs.map((item) => ({
      label: `Opportunity · ${String(related(item.opportunity)?.title ?? "Application")}`,
      state: item.status,
      at: item.updatedAt,
      href: `/staff/opportunities`,
    })),
    ...mentorship.docs.map((item) => ({
      label: `Mentorship · ${item.topic}`,
      state: item.status,
      at: item.updatedAt,
      href: `/staff/mentorship`,
    })),
    ...audit.docs.map((item) => ({
      label: `Audit · ${item.action}`,
      state: "staff",
      at: item.createdAt,
      href: `/staff/system/audit`,
    })),
  ]
    .sort((a, b) => Date.parse(String(b.at)) - Date.parse(String(a.at)))
    .slice(0, 20);

  return (
    <div className={`space-y-6 ${staffOpsChrome}`}>
      <StaffPageHeader
        eyebrow="Member operations"
        title="Member 360"
        description="Profile, learning, credentials, work, relationships, and staff context in one place."
      />

      <StaffPanel>
        <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.22em] text-baby-blue">Member</p>
        <MemberPicker
          activeId={member.id}
          members={members.docs.map((item) => ({
            id: item.id,
            label: item.name || item.email,
            email: item.email,
            handle: item.handle,
          }))}
        />
      </StaffPanel>

      <StaffPanel>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-2xl text-white">{member.name}</h2>
            <p className="mt-1 text-sm text-white/55">{member.headline || member.email}</p>
            <p className="mt-2 text-xs text-white/40">
              {member.location || "Location not set"} · {member.cohortStatus}
              {member.handle ? ` · @${member.handle}` : ""}
            </p>
            {(member.skills || []).length || member.careerGoals ? (
              <div className="mt-4 space-y-2 text-sm text-white/55">
                {(member.skills || []).length ? (
                  <p>
                    <span className="text-white/35">Skills · </span>
                    {(member.skills || [])
                      .map((item) => item?.skill)
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                ) : null}
                {member.careerGoals ? (
                  <p>
                    <span className="text-white/35">Goals · </span>
                    {member.careerGoals}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          {member.handle ? (
            <Link href={`/u/${member.handle}`} className="text-sm text-baby-blue hover:underline">
              Public profile
            </Link>
          ) : null}
        </div>
        <div className="mt-6">
          <StaffMetricGrid
            items={[
              { label: "Enrollments", value: enrollments.totalDocs },
              { label: "Certificates", value: certificates.totalDocs },
              { label: "Portfolio", value: portfolios.totalDocs },
              { label: "Applications", value: applications.totalDocs },
            ]}
          />
        </div>
      </StaffPanel>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Learning</h3>
          {enrollments.docs.length ? (
            <div className="space-y-1">
              {enrollments.docs.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/learning?tab=learners"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.programName}</b>
                  <span className="text-xs text-white/45">
                    {item.status} · {item.completionPercent ?? 0}%
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No enrollments.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Credentials & portfolio</h3>
          {certificates.docs.length || portfolios.docs.length ? (
            <div className="space-y-1">
              {certificates.docs.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/certificates"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.title}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
              {portfolios.docs.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl px-3 py-3">
                  <b className="text-sm text-white">{item.title}</b>
                  <span className="text-xs text-white/45">
                    {item.status} · {item.visibility}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <StaffEmpty>No credentials or portfolio items.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Mentorship</h3>
          <p className="mb-3 text-sm text-white/55">
            {mentorProfiles.totalDocs ? "Mentor profile exists." : "No mentor profile."}
          </p>
          {mentorship.docs.length ? (
            <div className="space-y-1">
              {mentorship.docs.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/mentorship"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{item.topic}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No mentorship requests.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Opportunity activity</h3>
          {applications.docs.length ? (
            <div className="space-y-1">
              {applications.docs.map((item) => (
                <Link
                  key={item.id}
                  href="/staff/opportunities"
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <b className="text-sm text-white">{String(related(item.opportunity)?.title ?? "Application")}</b>
                  <span className="text-xs text-white/45">{item.status}</span>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No applications.</StaffEmpty>
          )}
        </StaffPanel>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Recent activity</h3>
          {activity.length ? (
            <div className="space-y-1">
              {activity.map((item) => (
                <Link
                  key={`${item.href}-${item.at}-${item.label}`}
                  href={item.href}
                  className="flex items-center justify-between gap-4 rounded-xl px-3 py-3 transition hover:bg-white/[.03]"
                >
                  <span>
                    <b className="block text-sm text-white">{item.label}</b>
                    <small className="text-xs text-white/40">{item.state}</small>
                  </span>
                  <time className="text-xs text-white/35">{readableDate(item.at)}</time>
                </Link>
              ))}
            </div>
          ) : (
            <StaffEmpty>No recent activity.</StaffEmpty>
          )}
        </StaffPanel>

        <StaffPanel>
          <h3 className="mb-3 font-display text-xl text-white">Private staff notes</h3>
          <MemberNoteForm memberId={member.id} />
          <div className="mt-4 space-y-3">
            {notes.docs.map((item) => {
              const author = related(item.author);
              return (
                <div key={item.id} className="rounded-xl border border-white/10 bg-near-black/30 p-3">
                  <b className="text-xs uppercase tracking-wider text-baby-blue">{item.category}</b>
                  <p className="mt-2 text-sm text-white/75">{item.note}</p>
                  <small className="mt-2 block text-xs text-white/35">
                    {String(author?.name ?? author?.email ?? "Staff")} · {readableDate(item.createdAt)}
                  </small>
                </div>
              );
            })}
            {!notes.docs.length ? <StaffEmpty>No private notes yet.</StaffEmpty> : null}
          </div>
        </StaffPanel>
      </div>
    </div>
  );
}
