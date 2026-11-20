import { enquiryConfirmEnvByType, type EnquiryType } from "@/lib/enquiries/options";
import type { StoredEnquiry } from "@/lib/enquiries/notify";
import { site } from "@/lib/site";

type EnvSource = Record<string, string | undefined>;

const off = new Set(["false", "0", "off", "no"]);

export function enquiryConfirmationEnabled(type: EnquiryType, env: EnvSource = process.env): boolean {
  const value = env[enquiryConfirmEnvByType[type]]?.trim().toLowerCase();
  return !(value && off.has(value));
}

const topic: Record<Exclude<EnquiryType, "newsletter">, string> = {
  "programme-social-media-marketing": "the Social Media Marketing cohort",
  "one-on-one-training": "One-on-One Training",
  "organisational-training": "Specialised Marketing Workshops",
  partnership: "partnering with us",
  contact: "your message",
};

export function enquiryConfirmation(record: StoredEnquiry): { subject: string; text: string } {
  const name = record.name?.trim();
  const greeting = name ? `Dear ${name},` : "Hello,";
  const signOff = ["", "Kind regards,", site.name];

  if (record.type === "newsletter") {
    return {
      subject: `You're subscribed to ${site.name}`,
      text: [
        greeting,
        "",
        `You're subscribed to updates from ${site.name}. Thank you for joining us.`,
        ...signOff,
      ].join("\n"),
    };
  }

  const lines = [
    greeting,
    "",
    `Thank you for getting in touch about ${topic[record.type]}. We have received your enquiry.`,
    "",
    "We will reply within 48 hours.",
  ];
  const message = record.message?.trim();
  if (message) {
    lines.push("", "For your records, this is what you sent us:", "");
    for (const line of message.split(/\r?\n/)) lines.push(`> ${line}`);
  }
  return {
    subject: `We have received your enquiry - ${site.name}`,
    text: [...lines, ...signOff].join("\n"),
  };
}
