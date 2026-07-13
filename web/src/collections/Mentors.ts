import { Resend } from "resend";
import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { mentorSeniorities, mentorTopics } from "@/lib/mentor-options";

const isStaff = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

const stampApproval: CollectionBeforeChangeHook = ({ data, originalDoc, req }) => {
  const becameApproved = data.status === "approved" && originalDoc?.status !== "approved";
  if (!becameApproved) return data;
  return {
    ...data,
    approvedAt: new Date().toISOString(),
    approvedBy: req.user?.collection === "users" ? req.user.id : undefined,
  };
};

const completeApproval: CollectionAfterChangeHook = async ({ doc, previousDoc, req }) => {
  const becameApproved = doc.status === "approved" && previousDoc?.status !== "approved";
  if (!becameApproved) return doc;

  const memberId = typeof doc.member === "object" ? doc.member.id : doc.member;
  const member = await req.payload.findByID({
    collection: "members",
    id: memberId,
    depth: 0,
    overrideAccess: true,
  });

  const roles = member.roles || ["member"];
  if (!roles.includes("mentor")) {
    await req.payload.update({
      collection: "members",
      id: member.id,
      overrideAccess: true,
      data: { roles: [...roles, "mentor"] },
    });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const result = await new Resend(process.env.RESEND_API_KEY).emails.send({
        from: process.env.RESEND_FROM ?? "SMN <onboarding@resend.dev>",
        to: member.email,
        subject: "Your SMN mentor profile is approved",
        text: `Hi ${member.name || "there"},\n\nYour mentor profile has been approved and is now visible in the SMN member directory. We will contact you when a relevant mentorship request is ready for review.\n\nSocial Marketers Network`,
      });
      if (result.error) req.payload.logger.error({ err: result.error }, "Mentor approval email failed");
    } catch (error) {
      req.payload.logger.error({ err: error }, "Mentor approval email failed");
    }
  }

  return doc;
};

export const Mentors: CollectionConfig = {
  slug: "mentors",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["member", "title", "status", "availability", "updatedAt"],
    group: "Network",
    description: "Mentor profiles. Only approved profiles appear in the member directory.",
  },
  access: {
    admin: isStaff,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { status: { equals: "approved" } };
      return false;
    },
    create: isStaff,
    update: isStaff,
    delete: isStaff,
  },
  hooks: {
    beforeChange: [stampApproval],
    afterChange: [completeApproval],
  },
  fields: [
    { name: "member", type: "relationship", relationTo: "members", required: true, unique: true, maxDepth: 1 },
    { name: "title", type: "text", required: true },
    { name: "bio", type: "textarea", required: true },
    { name: "topics", type: "select", hasMany: true, required: true, options: mentorTopics.map((topic) => ({ label: topic, value: topic })) },
    { name: "seniority", type: "select", required: true, options: [...mentorSeniorities] },
    { name: "availability", type: "select", required: true, defaultValue: "Limited", options: ["Available", "Limited", "Unavailable"] },
    { name: "maxActiveMentees", type: "number", required: true, min: 0, defaultValue: 3, admin: { description: "Introductions are blocked when this capacity is reached." } },
    { name: "bookingUrl", type: "text" },
    { name: "status", type: "select", required: true, defaultValue: "draft", options: ["draft", "approved", "paused", "rejected"], admin: { position: "sidebar" } },
    { name: "featured", type: "checkbox", defaultValue: false, admin: { position: "sidebar" } },
    { name: "approvedAt", type: "date", admin: { position: "sidebar", readOnly: true }, access: { read: isStaff, create: isStaff, update: isStaff } },
    { name: "approvedBy", type: "relationship", relationTo: "users", admin: { position: "sidebar", readOnly: true }, access: { read: isStaff, create: isStaff, update: isStaff } },
    { name: "rejectionReason", type: "textarea", access: { read: isStaff, create: isStaff, update: isStaff } },
  ],
};
