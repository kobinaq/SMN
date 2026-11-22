export const enquiryTypes = [
  "programme-social-media-marketing",
  "one-on-one-training",
  "organisational-training",
  "partnership",
  "contact",
  "newsletter",
] as const;

export type EnquiryType = (typeof enquiryTypes)[number];

export const enquiryStatuses = ["new", "in-progress", "closed"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export const enquiryTypeLabels: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "Social media marketing program",
  "one-on-one-training": "One-on-one training",
  "organisational-training": "Organizational training",
  partnership: "Partnership",
  contact: "Contact",
  newsletter: "Newsletter",
};

export const enquiryStatusLabels: Record<EnquiryStatus, string> = {
  new: "New",
  "in-progress": "In progress",
  closed: "Closed",
};

/** Per-type override of ENQUIRY_NOTIFY_EMAIL. Unset types use the shared address. */
export const enquiryNotifyEnvByType: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "ENQUIRY_NOTIFY_EMAIL_PROGRAMME_SOCIAL_MEDIA_MARKETING",
  "one-on-one-training": "ENQUIRY_NOTIFY_EMAIL_ONE_ON_ONE_TRAINING",
  "organisational-training": "ENQUIRY_NOTIFY_EMAIL_ORGANISATIONAL_TRAINING",
  partnership: "ENQUIRY_NOTIFY_EMAIL_PARTNERSHIP",
  contact: "ENQUIRY_NOTIFY_EMAIL_CONTACT",
  newsletter: "ENQUIRY_NOTIFY_EMAIL_NEWSLETTER",
};

/** Per-type switch for the sender confirmation. On unless set to false, 0, off or no. */
export const enquiryConfirmEnvByType: Record<EnquiryType, string> = {
  "programme-social-media-marketing": "ENQUIRY_CONFIRM_PROGRAMME_SOCIAL_MEDIA_MARKETING",
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
