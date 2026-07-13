import Link from "next/link";
import type { AdminViewServerProps } from "payload";
import { MemberNoteForm } from "./MemberNoteForm";

const related = (value: unknown): Record<string, unknown> | null => value && typeof value === "object" && "id" in value ? value as Record<string, unknown> : null;
const readableDate = (value: unknown) => value ? new Intl.DateTimeFormat("en-GH", { dateStyle: "medium" }).format(new Date(String(value))) : "—";

export default async function Member360({ initPageResult, payload, searchParams }: AdminViewServerProps) {
  const access = { overrideAccess: false, req: initPageResult.req } as const;
  const members = await payload.find({ collection: "members", depth: 0, limit: 200, sort: "name", ...access });
  const requested = typeof searchParams?.member === "string" ? searchParams.member : undefined;
  const member = members.docs.find((item) => String(item.id) === requested) ?? members.docs[0];
  if (!member) return <main className="smn-workspace"><span className="smn-eyebrow">Member operations</span><h1>Member 360</h1><p>No members are available yet.</p></main>;
  const memberFilter = { equals: member.id };
  const [enrollments, certificates, portfolios, mentorProfiles, mentorship, applications, notes, audit] = await Promise.all([
    payload.find({ collection: "enrollments", depth: 1, limit: 100, sort: "-updatedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "certificates", depth: 1, limit: 100, sort: "-issuedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "portfolios", depth: 0, limit: 100, sort: "-updatedAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "mentors", depth: 0, limit: 10, where: { member: memberFilter }, ...access }),
    payload.find({ collection: "mentorship-requests", depth: 1, limit: 100, sort: "-createdAt", where: { requester: memberFilter }, ...access }),
    payload.find({ collection: "opportunity-applications", depth: 1, limit: 100, sort: "-createdAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "member-notes", depth: 1, limit: 100, sort: "-createdAt", where: { member: memberFilter }, ...access }),
    payload.find({ collection: "audit-events", depth: 1, limit: 100, sort: "-createdAt", where: { and: [{ entityType: { equals: "members" } }, { entityId: { equals: String(member.id) } }] }, ...access }),
  ]);
  const activity = [
    ...enrollments.docs.map((item) => ({ label: `Enrollment · ${item.programName}`, state: item.status, at: item.updatedAt, href: `/admin/collections/enrollments/${item.id}` })),
    ...certificates.docs.map((item) => ({ label: `Certificate · ${item.title}`, state: item.status, at: item.issuedAt, href: `/admin/collections/certificates/${item.id}` })),
    ...applications.docs.map((item) => ({ label: `Opportunity · ${String(related(item.opportunity)?.title ?? "Application")}`, state: item.status, at: item.updatedAt, href: `/admin/collections/opportunity-applications/${item.id}` })),
    ...mentorship.docs.map((item) => ({ label: `Mentorship · ${item.topic}`, state: item.status, at: item.updatedAt, href: `/admin/collections/mentorship-requests/${item.id}` })),
    ...audit.docs.map((item) => ({ label: `Audit · ${item.action}`, state: "staff", at: item.createdAt, href: `/admin/collections/audit-events/${item.id}` })),
  ].sort((a,b) => Date.parse(String(b.at)) - Date.parse(String(a.at))).slice(0,20);
  return <main className="smn-workspace">
    <header className="smn-workspace-header"><div><span className="smn-eyebrow">Member operations</span><h1>Member 360</h1><p>Profile, learning, credentials, work, relationships, and staff context in one place.</p></div><Link className="smn-primary-action" href={`/admin/collections/members/${member.id}`}>Edit member</Link></header>
    <div className="smn-course-switcher"><span>Member</span><nav>{members.docs.map((item) => <Link className={String(item.id) === String(member.id) ? "is-active" : ""} href={`/admin/member-360?member=${item.id}`} key={item.id}>{item.name || item.email}</Link>)}</nav></div>
    <section className="smn-member-profile"><div><h2>{member.name}</h2><p>{member.headline || member.email}</p><span>{member.location || "Location not set"} · {member.cohortStatus}</span></div><dl><div><dt>Enrollments</dt><dd>{enrollments.totalDocs}</dd></div><div><dt>Certificates</dt><dd>{certificates.totalDocs}</dd></div><div><dt>Portfolio</dt><dd>{portfolios.totalDocs}</dd></div><div><dt>Applications</dt><dd>{applications.totalDocs}</dd></div></dl></section>
    <section className="smn-member-grid"><article><h3>Learning</h3>{enrollments.docs.map((item) => <Link href={`/admin/collections/enrollments/${item.id}`} key={item.id}><b>{item.programName}</b><span>{item.status} · {item.completionPercent ?? 0}%</span></Link>)}</article><article><h3>Credentials & portfolio</h3>{certificates.docs.map((item) => <Link href={`/admin/collections/certificates/${item.id}`} key={item.id}><b>{item.title}</b><span>{item.status}</span></Link>)}{portfolios.docs.map((item) => <Link href={`/admin/collections/portfolios/${item.id}`} key={item.id}><b>{item.title}</b><span>{item.status} · {item.visibility}</span></Link>)}</article><article><h3>Mentorship</h3><p>{mentorProfiles.totalDocs ? "Mentor profile exists." : "No mentor profile."}</p>{mentorship.docs.map((item) => <Link href={`/admin/collections/mentorship-requests/${item.id}`} key={item.id}><b>{item.topic}</b><span>{item.status}</span></Link>)}</article><article><h3>Opportunity activity</h3>{applications.docs.map((item) => <Link href={`/admin/collections/opportunity-applications/${item.id}`} key={item.id}><b>{String(related(item.opportunity)?.title ?? "Application")}</b><span>{item.status}</span></Link>)}</article></section>
    <section className="smn-workspace-grid"><article><h3>Recent activity</h3><div className="smn-activity-list">{activity.map((item) => <Link href={item.href} key={`${item.href}-${item.at}`}><span><b>{item.label}</b><small>{item.state}</small></span><time>{readableDate(item.at)}</time></Link>)}</div></article><article><h3>Private staff notes</h3><MemberNoteForm memberId={member.id} /><div className="smn-note-list">{notes.docs.map((item) => { const author = related(item.author); return <div key={item.id}><b>{item.category}</b><p>{item.note}</p><small>{String(author?.name ?? author?.email ?? "Staff")} · {readableDate(item.createdAt)}</small></div>; })}</div></article></section>
  </main>;
}
