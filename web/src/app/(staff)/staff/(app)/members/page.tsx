import { PeopleWorkspace } from "@/components/staff/PeopleWorkspace";
import { StaffEmptyState, StaffPageHeader } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";

const related = (value: unknown): Record<string, unknown> | null =>
  value && typeof value === "object" && "id" in value ? (value as Record<string, unknown>) : null;

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
        <StaffPageHeader eyebrow="Work" title="People" />
        <StaffEmptyState
          title="No people yet"
          description="Members appear here once they join."
          action={{ href: "/staff", label: "Back to Today" }}
        />
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
      state: String(item.status),
      at: String(item.updatedAt),
      href: `/staff/learning?tab=learners&member=${member.id}`,
    })),
    ...certificates.docs.map((item) => ({
      label: `Certificate · ${item.title}`,
      state: String(item.status),
      at: String(item.issuedAt || item.updatedAt),
      href: `/staff/certificates`,
    })),
    ...applications.docs.map((item) => ({
      label: `Job · ${String(related(item.opportunity)?.title ?? "Application")}`,
      state: String(item.status),
      at: String(item.updatedAt),
      href: `/staff/opportunities`,
    })),
    ...mentorship.docs.map((item) => ({
      label: `Mentorship · ${item.topic}`,
      state: String(item.status),
      at: String(item.updatedAt),
      href: `/staff/mentorship`,
    })),
    ...audit.docs.map((item) => ({
      label: `Audit · ${item.action}`,
      state: "staff",
      at: String(item.createdAt),
      href: `/staff/system/audit`,
    })),
  ]
    .sort((a, b) => Date.parse(String(b.at)) - Date.parse(String(a.at)))
    .slice(0, 20);

  return (
    <PeopleWorkspace
      member={{
        id: member.id,
        name: member.name,
        email: member.email,
        headline: member.headline,
        location: member.location,
        cohortStatus: member.cohortStatus,
        handle: member.handle,
        skills: member.skills,
        careerGoals: member.careerGoals,
      }}
      pickerMembers={members.docs.map((item) => ({
        id: item.id,
        label: item.name || item.email,
        email: item.email,
        handle: item.handle,
      }))}
      metrics={[
        { label: "Enrollments", value: enrollments.totalDocs },
        { label: "Certificates", value: certificates.totalDocs },
        { label: "Portfolio", value: portfolios.totalDocs },
        { label: "Applications", value: applications.totalDocs },
      ]}
      enrollments={enrollments.docs.map((item) => ({
        id: item.id,
        programName: item.programName,
        status: String(item.status),
        completionPercent: item.completionPercent,
        programKey: item.programKey,
      }))}
      certificates={certificates.docs.map((item) => ({
        id: item.id,
        title: item.title,
        status: String(item.status),
      }))}
      portfolios={portfolios.docs.map((item) => ({
        id: item.id,
        title: item.title,
        status: String(item.status),
        visibility: String(item.visibility),
      }))}
      mentorProfilesCount={mentorProfiles.totalDocs}
      mentorship={mentorship.docs.map((item) => ({
        id: item.id,
        topic: item.topic,
        status: String(item.status),
      }))}
      applications={applications.docs.map((item) => ({
        id: item.id,
        title: String(related(item.opportunity)?.title ?? "Application"),
        status: String(item.status),
      }))}
      notes={notes.docs.map((item) => {
        const author = related(item.author);
        return {
          id: item.id,
          category: String(item.category),
          note: String(item.note),
          author: String(author?.name ?? author?.email ?? "Staff"),
          createdAt: String(item.createdAt),
        };
      })}
      activity={activity}
    />
  );
}
