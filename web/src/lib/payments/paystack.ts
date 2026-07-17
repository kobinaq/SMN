import { createHmac, randomBytes, timingSafeEqual } from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY?.trim());
}

export function paystackPublicKey() {
  return process.env.PAYSTACK_PUBLIC_KEY?.trim() || "";
}

function secretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!key) throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  return key;
}

export function newPaystackReference(prefix: string) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(6).toString("hex")}`;
}

export function newTicketCode() {
  return `SMN-${randomBytes(5).toString("hex").toUpperCase()}`;
}

type InitializeArgs = {
  email: string;
  amount: number;
  currency?: string;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
};

export async function paystackInitialize(args: InitializeArgs) {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: args.email,
      amount: args.amount,
      currency: args.currency || "GHS",
      reference: args.reference,
      callback_url: args.callbackUrl,
      metadata: args.metadata,
    }),
  });
  const body = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: { authorization_url?: string; access_code?: string; reference?: string };
  };
  if (!response.ok || !body.status || !body.data?.authorization_url) {
    throw new Error(body.message || "Unable to start Paystack checkout.");
  }
  return {
    authorizationUrl: body.data.authorization_url,
    accessCode: body.data.access_code || "",
    reference: body.data.reference || args.reference,
  };
}

export async function paystackVerify(reference: string) {
  const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: { Authorization: `Bearer ${secretKey()}` },
  });
  const body = (await response.json()) as {
    status?: boolean;
    message?: string;
    data?: {
      status?: string;
      amount?: number;
      currency?: string;
      reference?: string;
      metadata?: Record<string, unknown>;
    };
  };
  if (!response.ok || !body.status || !body.data) {
    throw new Error(body.message || "Unable to verify Paystack payment.");
  }
  return body.data;
}

/** Verify Paystack webhook signature (x-paystack-signature). */
export function verifyPaystackWebhookSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_WEBHOOK_SECRET?.trim() || process.env.PAYSTACK_SECRET_KEY?.trim();
  if (!secret || !signature) return false;
  const hash = createHmac("sha512", secret).update(rawBody).digest("hex");
  try {
    const a = Buffer.from(hash);
    const b = Buffer.from(signature);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function formatMinorAmount(amount: number, currency = "GHS") {
  const major = amount / 100;
  try {
    return new Intl.NumberFormat("en-GH", { style: "currency", currency }).format(major);
  } catch {
    return `${currency} ${major.toFixed(2)}`;
  }
}

/** Request a Paystack refund (full amount when amount omitted). */
export async function paystackRefund(reference: string, amount?: number) {
  const response = await fetch(`${PAYSTACK_BASE}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction: reference,
      ...(typeof amount === "number" ? { amount } : {}),
    }),
  });
  const body = (await response.json()) as { status?: boolean; message?: string };
  if (!response.ok || !body.status) {
    throw new Error(body.message || "Unable to refund Paystack payment.");
  }
  return body;
}
