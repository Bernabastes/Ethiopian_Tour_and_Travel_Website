import crypto from "crypto";
import { ETB_PER_USD } from "@/data/company";

// ─────────────────────────────────────────────────────────────────────────────
// Chapa payment gateway client.
//
// Mirrors the null-client pattern in lib/stripe.ts: if CHAPA_SECRET_KEY is not
// configured, `chapaEnabled` is false and the app still builds/runs — the UI
// simply hides the Chapa button.
//
// Docs: https://developer.chapa.co/docs/accept-payments
// ─────────────────────────────────────────────────────────────────────────────

const CHAPA_API = "https://api.chapa.co/v1";

const secretKey = process.env.CHAPA_SECRET_KEY ?? "";
const usdToEtbRate = Number(process.env.CHAPA_USD_ETB_RATE ?? ETB_PER_USD);

export const chapaEnabled = !!secretKey && usdToEtbRate > 0;

export function usdToEtb(amountUsd: number): number {
  return Math.round(amountUsd * usdToEtbRate * 100) / 100;
}

function authHeaders(): HeadersInit {
  return {
    Authorization: `Bearer ${secretKey}`,
    "Content-Type": "application/json",
  };
}

export type InitializeInput = {
  txRef: string;
  amountEtb: number;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  title: string;
  description: string;
  callbackUrl: string;
  returnUrl: string;
  meta?: Record<string, string>;
};

type ChapaInitResponse = {
  status?: string;
  message?: string | Record<string, string[]>;
  data?: { checkout_url?: string };
};

type ChapaVerifyResponse = {
  status?: string;
  message?: string;
  data?: {
    status?: string;
    amount?: number | string;
    currency?: string;
    tx_ref?: string;
    reference?: string;
    meta?: Record<string, string>;
  };
};

function formatChapaError(message: unknown, status: number): string {
  if (typeof message === "string" && message) return message;
  if (message && typeof message === "object") {
    const parts = Object.entries(message as Record<string, string[]>).map(
      ([field, errors]) => `${field}: ${errors.join(", ")}`,
    );
    if (parts.length) return parts.join("; ");
  }
  return `Chapa request failed (${status})`;
}

const CHAPA_TITLE_MAX = 16;
const CHAPA_DESCRIPTION_MAX = 50;

// Chapa only allows letters, numbers, hyphens, underscores, spaces, and dots.
export function sanitizeChapaText(value: string, maxLen = 100): string {
  return value
    .replace(/[^\w\s.\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLen);
}

/** Start a hosted Chapa checkout and return the redirect URL. */
export async function initializeCheckout(input: InitializeInput): Promise<string> {
  if (!chapaEnabled) throw new Error("Chapa not configured");

  const body: Record<string, unknown> = {
    amount: input.amountEtb.toFixed(2),
    currency: "ETB",
    email: input.email.trim(),
    first_name: sanitizeChapaText(input.firstName, 50),
    last_name: sanitizeChapaText(input.lastName, 50),
    tx_ref: input.txRef,
    callback_url: input.callbackUrl,
    return_url: input.returnUrl,
    customization: {
      title: sanitizeChapaText(input.title, CHAPA_TITLE_MAX),
      description: sanitizeChapaText(input.description, CHAPA_DESCRIPTION_MAX),
    },
  };

  if (input.phone) body.phone_number = input.phone;

  const res = await fetch(`${CHAPA_API}/transaction/initialize`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });

  const data = (await res.json().catch(() => ({}))) as ChapaInitResponse;
  if (!res.ok || data.status !== "success" || !data.data?.checkout_url) {
    throw new Error(formatChapaError(data.message, res.status));
  }

  return data.data.checkout_url;
}

/** Verify a transaction by tx_ref. Returns Chapa's payment data when successful. */
export async function verifyTransaction(txRef: string): Promise<ChapaVerifyResponse["data"]> {
  if (!chapaEnabled) throw new Error("Chapa not configured");

  const res = await fetch(`${CHAPA_API}/transaction/verify/${encodeURIComponent(txRef)}`, {
    method: "GET",
    headers: { Authorization: `Bearer ${secretKey}` },
  });

  const data = (await res.json().catch(() => ({}))) as ChapaVerifyResponse;
  if (!res.ok || data.status !== "success" || !data.data) {
    throw new Error(formatChapaError(data.message, res.status));
  }

  return data.data;
}

/** Build a unique, parseable tx_ref. Reference may contain hyphens (e.g. HHT-123). */
export function buildTxRef(reference: string, mode: "deposit" | "full"): string {
  const nonce = crypto.randomBytes(4).toString("hex");
  return `${reference}-${mode}-${nonce}`;
}

/** Parse reference + mode from a tx_ref created by buildTxRef. */
export function parseTxRef(txRef: string): { reference: string; mode: "deposit" | "full" } | null {
  const match = txRef.match(/^(.*)-(deposit|full)-[a-f0-9]{8}$/i);
  if (!match) return null;
  return { reference: match[1], mode: match[2] as "deposit" | "full" };
}

// Chapa expects Ethiopian mobile numbers as 09xxxxxxxx or 07xxxxxxxx.
export function normalizeEthiopianPhone(phone: string): string | undefined {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("251") && digits.length >= 12) {
    return `0${digits.slice(3, 12)}`;
  }
  if (digits.startsWith("0") && digits.length === 10) {
    return digits;
  }
  if (digits.length === 9 && (digits.startsWith("9") || digits.startsWith("7"))) {
    return `0${digits}`;
  }
  return undefined;
}

export function splitFullName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 0) return { firstName: "Guest", lastName: "Customer" };
  if (parts.length === 1) return { firstName: parts[0], lastName: "Customer" };
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Verify Chapa webhook `x-chapa-signature` / `chapa-signature` header. */
export function verifyWebhookSignature(payload: unknown, signature: string): boolean {
  if (!secretKey || !signature) return false;
  const hash = crypto.createHmac("sha256", secretKey).update(JSON.stringify(payload)).digest("hex");
  return hash === signature;
}
