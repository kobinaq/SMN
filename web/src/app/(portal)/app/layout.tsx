import { PortalShell } from "@/components/portal/PortalShell";
import { memberDisplayName, requireMember } from "@/lib/auth/member";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember("/app");
  const avatar = typeof member.avatar === "object" && member.avatar ? member.avatar : null;
  const handle = member.handle || "";

  return (
    <PortalShell
      variant="member"
      identity={{
        name: memberDisplayName(member),
        subtitle: handle ? `@${handle}` : undefined,
        avatarUrl: avatar?.url || undefined,
      }}
      maxWidth="6xl"
    >
      {children}
    </PortalShell>
  );
}
