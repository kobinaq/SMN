import type { GlobalConfig } from "payload";

const staffOnly = ({ req }: { req: { user?: { collection?: string } | null } }) =>
  req.user?.collection === "users";

/** A custom validate replaces Payload's built-in number checks, so min is enforced here too. */
const wholeNumber =
  (min: number) =>
  (value: number | null | undefined) => {
    if (value == null) return true;
    if (!Number.isInteger(value)) return "Enter a whole number.";
    return value >= min || `Enter ${min} or more.`;
  };

const formatNote = "Editable default. The one-on-one format is pending confirmation.";

export const OneOnOne: GlobalConfig = {
  slug: "one-on-one",
  label: "One-on-One",
  admin: { group: "Courses and Cohorts" },
  access: { read: staffOnly, update: staffOnly },
  fields: [
    { name: "durationWeeks", type: "number", defaultValue: 2, min: 1, validate: wholeNumber(1), admin: { description: formatNote } },
    { name: "daysPerWeek", type: "number", defaultValue: 4, min: 1, validate: wholeNumber(1), admin: { description: formatNote } },
    { name: "sessionCount", type: "number", defaultValue: 8, min: 1, validate: wholeNumber(1), admin: { description: formatNote } },
    {
      name: "price",
      type: "number",
      min: 0,
      validate: wholeNumber(0),
      admin: { description: "Price in pesewas (GH₵1 = 100). Blank means not yet priced." },
    },
    { name: "currency", type: "text", defaultValue: "GHS" },
    { name: "included", type: "array", fields: [{ name: "item", type: "text", required: true }] },
    { name: "trainers", type: "relationship", relationTo: "users", hasMany: true },
    {
      name: "resources",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
  ],
};
