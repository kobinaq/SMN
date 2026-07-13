import Link from "next/link";

const workspaces = [
  ["Overview", "/admin"],
  ["Course Builder", "/admin/course-builder"],
  ["Member 360", "/admin/member-360"],
  ["Mentorship Operations", "/admin/mentorship-operations"],
  ["Opportunity Operations", "/admin/opportunity-operations"],
  ["Certificate Issuing", "/admin/certificate-issuing"],
] as const;

export default function AdminWorkspaceNav() {
  return <section className="smn-admin-workspaces" aria-labelledby="smn-admin-workspaces-title"><b id="smn-admin-workspaces-title">Overview</b><nav aria-label="Operational workspaces">{workspaces.map(([label, href]) => <Link href={href} key={href}>{label}</Link>)}</nav></section>;
}
