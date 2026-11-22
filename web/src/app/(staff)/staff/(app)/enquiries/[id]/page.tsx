import { notFound } from "next/navigation";
import { EnquiryStatusSelect } from "@/components/staff/EnquiryStatusSelect";
import { StaffPageHeader, StaffPanel } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { enquiryTypeLabels, type EnquiryType } from "@/lib/enquiries/options";
import { getPayloadClient } from "@/lib/payload";
import { getCollectionDoc } from "@/lib/staff/records";
import { canStaff } from "@/lib/staff-permissions";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("Enquiry", { staff: true }) };

function line(label: string, value: string | null | undefined) {
  return (
    <div>
      <dt className="text-xs text-text-3">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap text-sm text-text-1">{value?.trim() ? value : "-"}</dd>
    </div>
  );
}

export default async function EnquiryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const staff = await requireStaff(["content", "support", "analyst"], "/staff/enquiries");
  const { id } = await params;
  const payload = await getPayloadClient();
  let doc;
  try {
    doc = await getCollectionDoc(payload, staff, "enquiries", id, 0);
  } catch {
    notFound();
  }

  const type = String(doc.type || "");
  const label = type in enquiryTypeLabels ? enquiryTypeLabels[type as EnquiryType] : type;
  const canWrite = canStaff(staff, "content", "support");

  return (
    <div className="space-y-6">
      <StaffPageHeader eyebrow="Enquiries" title={String(doc.name || doc.email || "Enquiry")} description={label} />
      <StaffPanel>
        <dl className="grid gap-5 md:grid-cols-2">
          {line("Type", label)}
          {line("Email", String(doc.email || ""))}
          {line("Phone", doc.phone)}
          {line("Organization", doc.organisation)}
          {line("Source page", doc.sourcePage)}
          {line("Received", doc.createdAt ? new Date(doc.createdAt).toLocaleString("en-GH") : "")}
          <div className="md:col-span-2">{line("Message", doc.message)}</div>
          <div>
            <dt className="text-xs text-text-3">Status</dt>
            <dd className="mt-2">
              {canWrite ? (
                <EnquiryStatusSelect id={doc.id} status={String(doc.status || "new")} />
              ) : (
                <span className="text-sm text-text-1">{String(doc.status || "new")}</span>
              )}
            </dd>
          </div>
        </dl>
      </StaffPanel>
    </div>
  );
}
