import type { StaffField } from "@/components/staff/StaffRecordForm";

export const postFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "Auto from title if blank", advanced: true },
  {
    name: "category",
    label: "Category",
    type: "select",
    required: true,
    options: [
      "Marketing Strategy",
      "AI",
      "Social Media",
      "Career Development",
      "Case Studies",
      "Industry Trends",
      "Community Stories",
    ].map((value) => ({ label: value, value })),
  },
  { name: "excerpt", label: "Summary", type: "textarea", required: true },
  { name: "contentText", label: "Body", type: "textarea", required: true, placeholder: "Plain text or markdown-style paragraphs" },
  { name: "cover", label: "Cover image", type: "media" },
  { name: "publishedAt", label: "Publish at", type: "datetime-local" },
  { name: "readTime", label: "Read time", type: "text", placeholder: "e.g. 6 min" },
];

export const resourceFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "Auto from title if blank", advanced: true },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: ["Template", "Guide", "AI Prompts", "Checklist", "Toolkit", "Download"].map((value) => ({
      label: value,
      value,
    })),
  },
  { name: "description", label: "Description", type: "textarea", required: true },
  { name: "file", label: "File", type: "media" },
];

export const courseFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "Auto from title if blank", advanced: true },
  { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "outcomesText", label: "Outcomes (one per line)", type: "textarea" },
  { name: "duration", label: "Duration", type: "text" },
  { name: "lessons", label: "Lesson count", type: "number" },
  { name: "price", label: "Price label", type: "text", placeholder: "Optional display text" },
  { name: "amount", label: "Amount (pesewas)", type: "number", placeholder: "e.g. 4500000 for GHS 450" },
  { name: "currency", label: "Currency", type: "text", placeholder: "GHS" },
  { name: "programKey", label: "Program key", type: "text", placeholder: "Must match LMS enrollment key" },
  {
    name: "delivery",
    label: "Delivery",
    type: "select",
    options: [
      { label: "Self-paced (LMS)", value: "self-paced" },
      { label: "Live (Classroom)", value: "live" },
    ],
  },
  { name: "classroomUrl", label: "Classroom / live link", type: "url" },
  { name: "badge", label: "Badge", type: "text" },
  { name: "image", label: "Image", type: "media" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Published", value: "published" },
      { label: "Coming soon", value: "coming-soon" },
    ],
  },
];

export const eventFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", placeholder: "Auto from title if blank", advanced: true },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Cancelled", value: "cancelled" },
    ],
  },
  {
    name: "type",
    label: "Type",
    type: "select",
    required: true,
    options: ["Webinar", "Workshop", "Networking", "Conference"].map((value) => ({ label: value, value })),
  },
  {
    name: "format",
    label: "Format",
    type: "select",
    required: true,
    options: [
      { label: "Online", value: "online" },
      { label: "Onsite", value: "onsite" },
      { label: "Hybrid", value: "hybrid" },
    ],
  },
  {
    name: "pricing",
    label: "Pricing",
    type: "select",
    required: true,
    options: [
      { label: "Free", value: "free" },
      { label: "Paid", value: "paid" },
    ],
  },
  { name: "amount", label: "Amount (pesewas)", type: "number", placeholder: "Required when paid" },
  { name: "currency", label: "Currency", type: "text", placeholder: "GHS" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "startsAt", label: "Starts at", type: "datetime-local", required: true },
  { name: "endsAt", label: "Ends at", type: "datetime-local" },
  { name: "time", label: "Time label", type: "text", placeholder: "e.g. 6:00 PM GMT" },
  { name: "host", label: "Host", type: "text" },
  { name: "venue", label: "Venue", type: "text" },
  { name: "address", label: "Address", type: "textarea" },
  { name: "onlineUrl", label: "Online / Classroom link", type: "url" },
  { name: "summary", label: "Summary", type: "textarea", required: true },
  { name: "body", label: "Details", type: "textarea" },
  { name: "image", label: "Image", type: "media" },
];

export const storyFields: StaffField[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role", type: "text", required: true },
  { name: "quote", label: "Quote", type: "textarea", required: true },
  { name: "image", label: "Image", type: "media" },
];

export const lmsModuleFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, advanced: true },
  { name: "summary", label: "Summary", type: "textarea", placeholder: "What this module covers" },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Archived", value: "archived" },
    ],
  },
];

export const lmsLessonFields: StaffField[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "slug", label: "Slug", type: "text", required: true, advanced: true },
  { name: "summary", label: "Summary", type: "textarea", required: true, placeholder: "Short learner-facing summary" },
  {
    name: "lessonType",
    label: "Lesson type",
    type: "select",
    required: true,
    options: [
      { label: "Video", value: "video" },
      { label: "Reading / article", value: "reading" },
      { label: "Download / documents", value: "download" },
      { label: "Assignment", value: "assignment" },
    ],
  },
  {
    name: "youtubeUrl",
    label: "YouTube video URL (optional)",
    type: "url",
    placeholder: "Only needed for video lessons",
  },
  { name: "durationMinutes", label: "Duration (minutes)", type: "number" },
  {
    name: "body",
    label: "Lesson text / reading content",
    type: "textarea",
    placeholder: "Article text, reading notes, prompts, or assignment instructions",
  },
  {
    name: "resourceLabel",
    label: "External resource label",
    type: "text",
    placeholder: "e.g. Read the brief",
  },
  {
    name: "resourceUrl",
    label: "External article / resource URL",
    type: "url",
    placeholder: "https://… Notion, Google Doc, blog, etc.",
  },
  {
    name: "status",
    label: "Status",
    type: "select",
    required: true,
    options: [
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
      { label: "Archived", value: "archived" },
    ],
  },
];

export const staffUserFields = (includePassword: boolean): StaffField[] => [
  { name: "name", label: "Full name", type: "text" },
  { name: "email", label: "Work email", type: "email", required: true },
  ...(includePassword
    ? [{ name: "password", label: "Temporary password", type: "password" as const, required: true, placeholder: "Min 10 characters" }]
    : []),
  {
    name: "role",
    label: "Role",
    type: "select",
    required: true,
    options: [
      "super-admin",
      "content",
      "learning",
      "mentorship",
      "opportunity",
      "support",
      "analyst",
    ].map((value) => ({ label: value.replace("-", " "), value })),
  },
];
