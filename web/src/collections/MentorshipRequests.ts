import type { CollectionConfig } from "payload";
import { mentorTopics } from "@/lib/mentor-options";

const isStaff = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

export const MentorshipRequests: CollectionConfig = {
  slug: "mentorship-requests",
  admin: { useAsTitle: "goal", defaultColumns: ["requester", "mentor", "topic", "status", "createdAt"], group: "Network" },
  access: {
    admin: isStaff,
    read: ({ req }) => {
      if (req.user?.collection === "users") return true;
      if (req.user?.collection === "members") return { requester: { equals: req.user.id } };
      return false;
    },
    create: isStaff, update: isStaff, delete: isStaff,
  },
  fields: [
    { name: "requester", type: "relationship", relationTo: "members", required: true, maxDepth: 1 },
    { name: "mentor", type: "relationship", relationTo: "mentors", required: true, maxDepth: 1 },
    { name: "topic", type: "select", required: true, options: mentorTopics.map((topic) => ({ label: topic, value: topic })) },
    { name: "goal", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    { name: "preferredFormat", type: "select", required: true, defaultValue: "Video call", options: ["Video call", "Portfolio review", "Async feedback", "Group office hours"] },
    { name: "status", type: "select", required: true, defaultValue: "new", options: ["new", "reviewing", "introduced", "completed", "declined"], admin: { position: "sidebar" } },
    { name: "staffNotes", type: "textarea", access: { read: isStaff, create: isStaff, update: isStaff } },
  ],
};