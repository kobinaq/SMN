/**
 * The legacy British slugs (programme-..., organisational-training) are stored
 * values and env-var suffixes. They stay until the spelling task (T3) migrates them.
 */
export const enquiryTypes = [
  "programme-social-media-marketing",
  "cohort-application",
  "one-on-one-training",
  "organisational-training",
  "partnership",
  "contact",
  "newsletter",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

export const enquiryStatuses = ["new", "contacted", "qualified", "converted", "closed", "in-progress"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

/** Statuses offered in pickers. "in-progress" is legacy and kept only so old rows stay valid. */
export const activeEnquiryStatuses = ["new", "contacted", "qualified", "converted", "closed"] as const;

export const enquiryTypeLabels: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "Course interest",
  "cohort-application": "Cohort application",
  "one-on-one-training": "One-on-One",
  "organisational-training": "Workshop sales",
  partnership: "Partnership",
  contact: "Contact",
  newsletter: "Newsletter",
};

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  qualified: "Qualified",
  converted: "Converted",
  closed: "Closed",
  "in-progress": "In progress (legacy)",
};

/** Per-type override of ENQUIRY_NOTIFY_EMAIL. Unset types use the shared address. */
export const enquiryNotifyEnvByType: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "ENQUIRY_NOTIFY_EMAIL_PROGRAMME_SOCIAL_MEDIA_MARKETING",
  "cohort-application": "ENQUIRY_NOTIFY_EMAIL_COHORT_APPLICATION",
  "one-on-one-training": "ENQUIRY_NOTIFY_EMAIL_ONE_ON_ONE_TRAINING",
  "organisational-training": "ENQUIRY_NOTIFY_EMAIL_ORGANISATIONAL_TRAINING",
  partnership: "ENQUIRY_NOTIFY_EMAIL_PARTNERSHIP",
  contact: "ENQUIRY_NOTIFY_EMAIL_CONTACT",
  newsletter: "ENQUIRY_NOTIFY_EMAIL_NEWSLETTER",
};

/** Per-type switch for the sender confirmation. On unless set to false, 0, off or no. */
export const enquiryConfirmEnvByType: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "ENQUIRY_CONFIRM_PROGRAMME_SOCIAL_MEDIA_MARKETING",
  "cohort-application": "ENQUIRY_CONFIRM_COHORT_APPLICATION",
  "one-on-one-training": "ENQUIRY_CONFIRM_ONE_ON_ONE_TRAINING",
  "organisational-training": "ENQUIRY_CONFIRM_ORGANISATIONAL_TRAINING",
  partnership: "ENQUIRY_CONFIRM_PARTNERSHIP",
  contact: "ENQUIRY_CONFIRM_CONTACT",
  newsletter: "ENQUIRY_CONFIRM_NEWSLETTER",
};

export const enquiryRateLimit = {
  limit: 8,
  windowMs: 15 * 60 * 1000,
} as const;
