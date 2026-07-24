// ─────────────────────────────────────────────────────────────────────────────
// PayPal Checkout (Orders v2) client.
//
// Mirrors lib/chapa.ts: if credentials are missing, `paypalEnabled` is false and
// the UI hides the PayPal button. Docs: https://developer.paypal.com/docs/api/orders/v2/
// ─────────────────────────────────────────────────────────────────────────────

const clientId = process.env.PAYPAL_CLIENT_ID ?? "";
const clientSecret = process.env.PAYPAL_CLIENT_SECRET ?? "";
const mode = process.env.PAYPAL_MODE === "live" ? "live" : "sandbox";

const apiBase =
  mode === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com";

export const paypalEnabled = !!clientId && !!clientSecret;

let tokenCache: { token: string; expiresAt: number } | null = null;

type PayPalLink = { href: string; rel: string; method?: string };

type PayPalErrorBody = {
  name?: string;
  message?: string;
  details?: Array<{ issue?: string; description?: string }>;
};

export type CreateOrderInput = {
  reference: string;
  mode: "deposit" | "full";
  amountUsd: number;
  description: string;
  returnUrl: string;
  cancelUrl: string;
};

export type CaptureResult = {
  orderId: string;
  captureId: string;
  reference: string;
  mode: "deposit" | "full";
  status: string;
};

async function getAccessToken(): Promise<string> {
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const res = await fetch(`${apiBase}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = (await res.json().catch(() => ({}))) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };

  if (!res.ok || !data.access_token) {
    throw new Error(data.error_description ?? `PayPal auth failed (${res.status})`);
  }

  const ttlMs = (data.expires_in ?? 3600) * 1000;
  tokenCache = { token: data.access_token, expiresAt: Date.now() + ttlMs - 60_000 };
  return data.access_token;
}

function formatPayPalError(body: PayPalErrorBody, status: number): string {
  if (body.details?.length) {
    return body.details.map((d) => d.description ?? d.issue ?? "Unknown error").join("; ");
  }
  if (body.message) return body.message;
  return `PayPal request failed (${status})`;
}

async function paypalFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = await getAccessToken();
  const res = await fetch(`${apiBase}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const body = (await res.json().catch(() => ({}))) as T & PayPalErrorBody;
  if (!res.ok) {
    throw new Error(formatPayPalError(body, res.status));
  }
  return body;
}

export function formatPayPalAmount(amountUsd: number): string {
  return (Math.round(amountUsd * 100) / 100).toFixed(2);
}

export function buildCustomId(reference: string, paymentMode: "deposit" | "full"): string {
  return `${reference}|${paymentMode}`;
}

export function parseCustomId(
  customId: string,
): { reference: string; mode: "deposit" | "full" } | null {
  const sep = customId.lastIndexOf("|");
  if (sep <= 0) return null;
  const reference = customId.slice(0, sep);
  const mode = customId.slice(sep + 1);
  if (mode !== "deposit" && mode !== "full") return null;
  return { reference, mode: mode };
}

/** Create a PayPal order and return the customer approval URL. */
export async function createCheckoutUrl(input: CreateOrderInput): Promise<string> {
  if (!paypalEnabled) throw new Error("PayPal not configured");

  const order = await paypalFetch<{
    id: string;
    links?: PayPalLink[];
  }>("/v2/checkout/orders", {
    method: "POST",
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: input.reference,
          custom_id: buildCustomId(input.reference, input.mode),
          description: input.description.slice(0, 127),
          amount: {
            currency_code: "USD",
            value: formatPayPalAmount(input.amountUsd),
          },
        },
      ],
      application_context: {
        brand_name: "Habesha Heritage Tours",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        shipping_preference: "NO_SHIPPING",
        return_url: input.returnUrl,
        cancel_url: input.cancelUrl,
      },
    }),
  });

  const approve = order.links?.find((l) => l.rel === "approve");
  if (!approve?.href) throw new Error("PayPal approval URL missing");
  return approve.href;
}

function extractCaptureMeta(
  order: {
    id: string;
    status?: string;
    purchase_units?: Array<{
      reference_id?: string;
      custom_id?: string;
      payments?: {
        captures?: Array<{ id: string; status: string; custom_id?: string }>;
      };
    }>;
  },
  fallback?: { reference?: string; mode?: "deposit" | "full" },
): CaptureResult | null {
  const unit = order.purchase_units?.[0];
  const capture = unit?.payments?.captures?.[0];
  if (!capture) return null;

  const customId = unit?.custom_id ?? capture.custom_id;
  let parsed = customId ? parseCustomId(customId) : null;

  if (!parsed && unit?.reference_id) {
    parsed = {
      reference: unit.reference_id,
      mode: fallback?.mode ?? "deposit",
    };
  }
  if (!parsed && fallback?.reference) {
    parsed = {
      reference: fallback.reference,
      mode: fallback?.mode ?? "deposit",
    };
  }
  if (!parsed) return null;

  const captureStatus = capture.status ?? "";
  const orderStatus = order.status ?? "";
  const isCompleted = captureStatus === "COMPLETED" || orderStatus === "COMPLETED";

  if (!isCompleted) return null;

  return {
    orderId: order.id,
    captureId: capture.id,
    reference: parsed.reference,
    mode: parsed.mode,
    status: captureStatus || orderStatus,
  };
}

/** Capture an approved order after the customer returns from PayPal. */
export async function captureOrder(
  orderId: string,
  fallback?: { reference?: string; mode?: "deposit" | "full" },
): Promise<CaptureResult> {
  if (!paypalEnabled) throw new Error("PayPal not configured");

  type OrderBody = {
    id: string;
    status?: string;
    purchase_units?: Array<{
      reference_id?: string;
      custom_id?: string;
      payments?: {
        captures?: Array<{ id: string; status: string; custom_id?: string }>;
      };
    }>;
  };

  try {
    const captured = await paypalFetch<OrderBody>(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
      { method: "POST", body: JSON.stringify({}) },
    );

    const meta = extractCaptureMeta(captured, fallback);
    if (!meta) {
      console.error("[PAYPAL] capture response missing metadata:", JSON.stringify(captured));
      throw new Error("PayPal payment was not completed");
    }
    return meta;
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const retryable =
      /ALREADY_CAPTURED|UNPROCESSABLE_ENTITY|RESOURCE_NOT_FOUND/i.test(message);
    if (!retryable) throw err;

    const existing = await paypalFetch<OrderBody>(
      `/v2/checkout/orders/${encodeURIComponent(orderId)}`,
    );

    const meta = extractCaptureMeta(existing, fallback);
    if (!meta) throw err;
    return meta;
  }
}

/** Verify a PayPal webhook using the notifications API. */
export async function verifyWebhook(
  headers: Headers,
  event: unknown,
): Promise<boolean> {
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return process.env.NODE_ENV !== "production";

  const transmissionId = headers.get("paypal-transmission-id");
  const transmissionTime = headers.get("paypal-transmission-time");
  const transmissionSig = headers.get("paypal-transmission-sig");
  const certUrl = headers.get("paypal-cert-url");
  const authAlgo = headers.get("paypal-auth-algo");

  if (!transmissionId || !transmissionTime || !transmissionSig || !certUrl || !authAlgo) {
    return false;
  }

  const result = await paypalFetch<{ verification_status?: string }>(
    "/v1/notifications/verify-webhook-signature",
    {
      method: "POST",
      body: JSON.stringify({
        auth_algo: authAlgo,
        cert_url: certUrl,
        transmission_id: transmissionId,
        transmission_sig: transmissionSig,
        transmission_time: transmissionTime,
        webhook_id: webhookId,
        webhook_event: event,
      }),
    },
  );

  return result.verification_status === "SUCCESS";
}
