import { EnquiryStatusSelect } from "@/components/staff/EnquiryStatusSelect";
import { StaffEmpty, StaffPageHeader, StaffPanel, StaffTable } from "@/components/staff/ui";
import { requireStaff } from "@/lib/auth/staff";
import { enquiryTypeLabels, type EnquiryType } from "@/lib/enquiries/options";
import { getPayloadClient } from "@/lib/payload";
import { staffAccess } from "@/lib/staff/records";
import { canStaff } from "@/lib/staff-permissions";
import { pageTitle } from "@/lib/brand";

export const metadata = { title: pageTitle("Enquiries", { staff: true }) };

function typeLabel(value: string) {
  if (value in enquiryTypeLabels) return enquiryTypeLabels[value as EnquiryType];
  return value || "-";
}

export default async function EnquiriesPage() {
  const staff = await requireStaff(["content", "support", "analyst"], "/staff/enquiries");
  const canWrite = canStaff(staff, "content", "support");
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "enquiries",
    depth: 0,
    limit: 200,
    sort: "-createdAt",
    ...staffAccess(staff),
  });

  return (
    <div className="space-y-6">
      <StaffPageHeader
        eyebrow="Website"
        title="Enquiries"
        hint="Submissions from the public forms. New rows arrive through POST /api/enquiries."
      />
      <StaffPanel>
        {result.docs.length ? (
          <StaffTable
            columns={["Type", "Name", "Email", "Received", "Status"]}
            rows={result.docs.map((doc) => ({
              key: String(doc.id),
              href: `/staff/enquiries/${doc.id}`,
              cells: [
                typeLabel(String(doc.type || "")),
                doc.name || "-",
                doc.email,
                doc.createdAt ? new Date(doc.createdAt).toLocaleDateString("en-GH") : "-",
                canWrite ? (
                  <EnquiryStatusSelect key={doc.id} id={doc.id} status={doc.status} />
                ) : (
                  doc.status
                ),
              ],
            }))}
          />
        ) : (
          <StaffEmpty>No enquiries yet.</StaffEmpty>
        )}
      </StaffPanel>
    </div>
  );
}
