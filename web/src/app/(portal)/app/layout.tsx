import { AppNav } from "@/components/app/AppNav";
import { memberDisplayName, requireMember } from "@/lib/auth/member";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const member = await requireMember("/app");
  const avatar = typeof member.avatar === "object" && member.avatar ? member.avatar : null;

  return <div className="flex min-h-svh flex-col bg-near-black">
    <AppNav memberName={memberDisplayName(member)} memberHandle={member.handle || ""} avatarUrl={avatar?.url || ""} />
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6 sm:py-10">{children}</main>
  </div>;
}