import type { CollectionConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

/** A custom validate replaces Payload's built-in number checks, so min is enforced here too. */
function wholeNumber(required: boolean, min = 0) {
  return (value: number | null | undefined) => {
    if (value == null) return required ? "This field is required." : true;
    if (!Number.isInteger(value)) return "Enter a whole number.";
    return value >= min || `Enter ${min} or more.`;
  };
}

export const Cohorts: CollectionConfig = {
  slug: "cohorts",
  labels: { singular: "Cohort", plural: "Cohorts" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "course", "startsAt", "status", "seats"],
    group: "Courses and Cohorts",
  },
  access: {
    admin: staffOnly,
    read: staffOnly,
    create: staffOnly,
    update: staffOnly,
    delete: staffOnly,
  },
  fields: [
    { name: "course", type: "relationship", relationTo: "courses", required: true, index: true },
    { name: "name", type: "text", required: true },
    { name: "startsAt", type: "date", required: true, admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "endsAt", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "applicationDeadline", type: "date", admin: { date: { pickerAppearance: "dayAndTime" } } },
    { name: "seats", type: "number", required: true, min: 0, validate: wholeNumber(true) },
    {
      name: "price",
      type: "number",
      min: 0,
      validate: wholeNumber(false),
      admin: { description: "Override in pesewas. Blank uses the course default price." },
    },
    { name: "currency", type: "text", defaultValue: "GHS" },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "draft",
      index: true,
      options: [
        { label: "Draft", value: "draft" },
        { label: "Open for applications", value: "open" },
        { label: "Full", value: "full" },
        { label: "Running", value: "running" },
        { label: "Finished", value: "finished" },
      ],
    },
    {
      name: "meetingUrl",
      type: "text",
      admin: { description: "Default Google Meet or Zoom link for this cohort's live sessions." },
    },
  ],
};
