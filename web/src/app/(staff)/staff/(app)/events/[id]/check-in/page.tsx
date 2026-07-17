import { notFound } from "next/navigation";
import { EventCheckInForm } from "@/components/staff/EventCheckInForm";
import { StaffPageHeader, StaffPanel, StaffSection } from "@/components/staff/ui";
import { Button } from "@/components/ui/Button";
import { requireStaff } from "@/lib/auth/staff";
import { getPayloadClient } from "@/lib/payload";

type Props = { params: Promise<{ id: string }> };

export default async function StaffEventCheckInPage({ params }: Props) {
  const staff = await requireStaff(["content", "support"], "/staff/events");
  const { id } = await params;
  const payload = await getPayloadClient();
  const p = payload as unknown as {
    findByID(args: Record<string, unknown>): Promise<Record<string, unknown>>;
  };

  let event: Record<string, unknown>;
  try {
    event = await p.findByID({ collection: "events", id, depth: 0, overrideAccess: false, user: staff });
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Check-in" title={String(event.title)} hint="Scan or type the ticket code." />
      <StaffPanel>
        <StaffSection title="Door check-in" />
        <EventCheckInForm eventId={id} />
      </StaffPanel>
      <Button href={`/staff/events/${id}`} variant="secondary">
        Attendee list
      </Button>
    </div>
  );
}
