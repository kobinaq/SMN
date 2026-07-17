import { sendEmail } from "@/lib/email";
import { formatMinorAmount } from "@/lib/payments/paystack";
import { getServerURL } from "@/lib/server-url";

export async function sendEventRegistrationEmail(args: {
  to: string;
  name?: string;
  eventTitle: string;
  ticketCode: string;
  registrationId: string | number;
  onlineUrl?: string;
  amountPaid?: number;
  currency?: string;
}) {
  const site = getServerURL();
  const ticketUrl = `${site}/app/events/tickets?id=${args.registrationId}`;
  const paidLine =
    args.amountPaid && args.amountPaid > 0
      ? `\nAmount paid: ${formatMinorAmount(args.amountPaid, args.currency || "GHS")}`
      : "";
  const joinLine = args.onlineUrl ? `\nJoin link (after confirmation): ${args.onlineUrl}` : "";

  return sendEmail({
    to: args.to,
    subject: `You're registered · ${args.eventTitle}`,
    text: `Hi ${args.name || "there"},

You're registered for ${args.eventTitle}.

Ticket code: ${args.ticketCode}${paidLine}
View your ticket (QR): ${ticketUrl}${joinLine}

Social Marketers Network`,
  });
}

export async function sendPaymentReceiptEmail(args: {
  to: string;
  name?: string;
  description: string;
  reference: string;
  amount: number;
  currency?: string;
  nextStepUrl?: string;
}) {
  return sendEmail({
    to: args.to,
    subject: `Payment receipt · ${args.description}`,
    text: `Hi ${args.name || "there"},

We received your payment for ${args.description}.

Amount: ${formatMinorAmount(args.amount, args.currency || "GHS")}
Reference: ${args.reference}
${args.nextStepUrl ? `\nContinue here: ${args.nextStepUrl}\n` : ""}
Social Marketers Network`,
  });
}

export async function sendCourseAccessEmail(args: {
  to: string;
  name?: string;
  programName: string;
  classroomUrl?: string;
  learningUrl: string;
}) {
  const classroomLine = args.classroomUrl
    ? `\nLive / Classroom link: ${args.classroomUrl}`
    : "\nOpen your member learning home for self-paced courses.";

  return sendEmail({
    to: args.to,
    subject: `Access unlocked · ${args.programName}`,
    text: `Hi ${args.name || "there"},

Your access to ${args.programName} is ready.
${classroomLine}

Learning home: ${args.learningUrl}

Social Marketers Network`,
  });
}
