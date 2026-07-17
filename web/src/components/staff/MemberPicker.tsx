"use client";

import { StaffEntitySwitcher } from "@/components/staff/StaffEntitySwitcher";

type MemberOption = {
  id: string | number;
  label: string;
  email?: string | null;
  handle?: string | null;
};

export function MemberPicker({
  members,
  activeId,
}: {
  members: MemberOption[];
  activeId: string | number;
}) {
  return (
    <StaffEntitySwitcher
      storageKey="members"
      placeholder="Find a person…"
      emptyLabel="No people match that search."
      value={activeId}
      items={members.map((member) => ({
        id: member.id,
        label: member.label,
        detail: member.email || (member.handle ? `@${member.handle}` : undefined),
        searchText: [member.label, member.email || "", member.handle || ""].join(" "),
      }))}
      onSelectHref={(item) => `/staff/members?member=${item.id}`}
    />
  );
}
