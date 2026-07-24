import crypto from "crypto";
import https from "node:https";

// ─────────────────────────────────────────────────────────────────────────────
// telebirr (Ethio Telecom) Web Payment / H5 Checkout client.
//
// Mirrors the null-client pattern in lib/stripe.ts: if the merchant credentials
// are not configured, `telebirrEnabled` is false and the app still builds/runs —
// the UI simply hides the telebirr button.
//
// NOTE: telebirr has no public sandbox. You must register as a merchant with
// Ethio Telecom to receive: merchant app id, fabric key, app secret, short code,
// telebirr's RSA public key, and your own RSA private key. The exact base URLs
// and a few field names come from the integration PDF they hand you — the spots
// you must confirm against your docs are marked with `TODO(docs)`.
// ─────────────────────────────────────────────────────────────────────────────

// Ensure a single trailing slash so `${base}path` concatenation always works,
// regardless of whether the configured env value ends with "/".
function withTrailingSlash(url: string): string {
  return url ? url.replace(/\/+$/, "") + "/" : url;
}

const cfg = {
  baseUrl: withTrailingSlash(process.env.TELEBIRR_BASE_URL ?? ""),        // e.g. https://app.ethiomobilemoney.et:2121/ (TODO(docs): confirm)
  webBaseUrl: withTrailingSlash(process.env.TELEBIRR_WEB_BASE_URL ?? ""), // H5 checkout host (TODO(docs): confirm)
  fabricAppId: process.env.TELEBIRR_FABRIC_APP_ID ?? "",
  appSecret: process.env.TELEBIRR_APP_SECRET ?? "",
  merchantAppId: process.env.TELEBIRR_MERCHANT_APP_ID ?? "",
  shortCode: process.env.TELEBIRR_SHORT_CODE ?? "",
  privateKey: process.env.TELEBIRR_PRIVATE_KEY ?? "", // your RSA private key (PEM, used to SIGN)
  publicKey: process.env.TELEBIRR_PUBLIC_KEY ?? "",   // telebirr RSA public key (PEM, reserved for encrypt)
  usdToEtb: Number(process.env.TELEBIRR_USD_ETB_RATE ?? "0"),
};

export const telebirrEnabled =
  !!cfg.baseUrl &&
  !!cfg.fabricAppId &&
  !!cfg.appSecret &&
  !!cfg.merchantAppId &&
  !!cfg.shortCode &&
  !!cfg.privateKey &&
  cfg.usdToEtb > 0;

// Convert a USD amount (how bookings are stored) to ETB using the fixed env rate.
export function usdToEtb(amountUsd: number): number {
  return Math.round(amountUsd * cfg.usdToEtb * 100) / 100;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function normalizePem(key: string, label: "PRIVATE" | "PUBLIC"): string {
  // Allow keys stored on a single line in .env (with literal \n or no headers).
  const body = key.includes("\\n") ? key.replace(/\\n/g, "\n") : key;
  if (body.includes("-----BEGIN")) return body;
  const header = label === "PRIVATE" ? "PRIVATE KEY" : "PUBLIC KEY";
  const wrapped = body.replace(/\s+/g, "").match(/.{1,64}/g)?.join("\n") ?? body;
  return `-----BEGIN ${header}-----\n${wrapped}\n-----END ${header}-----`;
}

// telebirr signs the request with SHA256withRSA over the params sorted by key,
// joined as `k=v&k=v`, base64-encoded. (TODO(docs): confirm whether biz_content
// fields are flattened into the signed string in your version of the spec.)
function sign(params: Record<string, unknown>): string {
  const toSign = Object.keys(params)
    .filter((k) => k !== "sign" && k !== "sign_type" && params[k] !== "" && params[k] != null)
    .sort()
    .map((k) => {
      const v = params[k];
      return `${k}=${typeof v === "object" ? JSON.stringify(v) : v}`;
    })
    .join("&");

  const signer = crypto.createSign("RSA-SHA256");
  signer.update(toSign, "utf8");
  return signer.sign(normalizePem(cfg.privateKey, "PRIVATE"), "base64");
}

function randomNonce(): string {
  return crypto.randomBytes(16).toString("hex");
}

// Ethio Telecom periodically lets the TLS certificate on the telebirr payment
// host expire (the handshake then fails with CERT_HAS_EXPIRED before any request
// is even sent). Node's global fetch (undici) gives us no way to relax that per
// call, so we issue telebirr's HTTPS POSTs through node:https instead, where
// `rejectUnauthorized` can be toggled. Set TELEBIRR_INSECURE_TLS=1 to keep
// payments flowing until they renew the cert. This is scoped to telebirr only —
// Stripe and every other outbound request stay fully verified.
const telebirrInsecureTls = process.env.TELEBIRR_INSECURE_TLS === "1";
if (telebirrInsecureTls) {
  console.warn(
    "[TELEBIRR] TELEBIRR_INSECURE_TLS=1 — skipping TLS cert verification for telebirr requests only.",
  );
}

type JsonResponse = { ok: boolean; status: number; text: string };

function postJson(
  urlStr: string,
  headers: Record<string, string>,
  bodyObj: unknown,
): Promise<JsonResponse> {
  const url = new URL(urlStr);
  const body = JSON.stringify(bodyObj);
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname + url.search,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
          ...headers,
        },
        rejectUnauthorized: !telebirrInsecureTls,
      },
      (res) => {
        let data = "";
        res.setEncoding("utf8");
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          const status = res.statusCode ?? 0;
          resolve({ ok: status >= 200 && status < 300, status, text: data });
        });
      },
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

// ── API calls ────────────────────────────────────────────────────────────────

// 1) Fabric application token (auth). Cached lifetime is short; we fetch per call.
async function fetchToken(): Promise<string> {
  const res = await postJson(
    `${cfg.baseUrl}payment/v1/token`,
    { "X-APP-Key": cfg.fabricAppId },
    { appSecret: cfg.appSecret },
  );
  if (!res.ok) throw new Error(`telebirr token failed: ${res.status} ${res.text}`);

  const raw = res.text;
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    throw new Error(`telebirr token response not JSON: ${raw}`);
  }

  // The Fabric token can sit at the top level or nested under `data`, and may be
  // named `token` or `access_token` depending on the platform version.
  const nested = (data.data ?? {}) as Record<string, unknown>;
  const token =
    (data.token as string | undefined) ??
    (data.access_token as string | undefined) ??
    (nested.token as string | undefined) ??
    (nested.access_token as string | undefined);

  if (!token) {
    console.error("[TELEBIRR] token response (no token field found):", raw);
    throw new Error("telebirr token missing in response");
  }
  return token;
}

export type CreateOrderInput = {
  merchOrderId: string; // your booking reference
  amountEtb: number;
  title: string;
  notifyUrl: string;
  redirectUrl: string;
};

// 2) preOrder → returns a prepay_id, then 3) we assemble the signed H5 URL the
// customer is redirected to. Returns the full checkout URL.
export async function createCheckoutUrl(input: CreateOrderInput): Promise<string> {
  if (!telebirrEnabled) throw new Error("telebirr not configured");

  const token = await fetchToken();
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonceStr = randomNonce();

  const bizContent = {
    notify_url: input.notifyUrl,
    redirect_url: input.redirectUrl,
    appid: cfg.merchantAppId,
    merch_code: cfg.shortCode,
    merch_order_id: input.merchOrderId,
    trade_type: "Checkout",
    title: input.title,
    total_amount: input.amountEtb.toFixed(2),
    trans_currency: "ETB",
    timeout_express: "30m",
    payee_identifier: cfg.shortCode,
    payee_identifier_type: "04",
    payee_type: "5000",
  };

  const preOrderBody: Record<string, unknown> = {
    timestamp,
    nonce_str: nonceStr,
    method: "payment.preorder",
    version: "1.0",
    biz_content: bizContent,
    sign_type: "SHA256WithRSA",
  };
  preOrderBody.sign = sign({ ...preOrderBody, ...bizContent });

  const res = await postJson(
    `${cfg.baseUrl}payment/v1/merchant/preOrder`,
    { "X-APP-Key": cfg.fabricAppId, Authorization: token },
    preOrderBody,
  );
  if (!res.ok) throw new Error(`telebirr preOrder failed: ${res.status} ${res.text}`);

  const data = JSON.parse(res.text) as { biz_content?: { prepay_id?: string }; prepay_id?: string };
  const prepayId = data.biz_content?.prepay_id ?? data.prepay_id;
  if (!prepayId) throw new Error("telebirr prepay_id missing in response");

  // 3) Build the signed "raw request" the H5 page expects.
  const rawParams: Record<string, unknown> = {
    appid: cfg.merchantAppId,
    merch_code: cfg.shortCode,
    nonce_str: randomNonce(),
    prepay_id: prepayId,
    timestamp: Math.floor(Date.now() / 1000).toString(),
    sign_type: "SHA256WithRSA",
  };
  rawParams.sign = sign(rawParams);

  const query = Object.entries(rawParams)
    .map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`)
    .join("&");

  // TODO(docs): confirm the exact H5 checkout path in your integration PDF.
  return `${cfg.webBaseUrl}payment/web/paygate?${query}`;
}

// Verify the SHA256withRSA signature on telebirr's async notify callback,
// using telebirr's PUBLIC key. Returns true when the signature is valid.
export function verifyNotifySignature(payload: Record<string, unknown>, signature: string): boolean {
  if (!cfg.publicKey) return false;
  const toVerify = Object.keys(payload)
    .filter((k) => k !== "sign" && k !== "sign_type" && payload[k] !== "" && payload[k] != null)
    .sort()
    .map((k) => `${k}=${payload[k]}`)
    .join("&");
  try {
    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(toVerify, "utf8");
    return verifier.verify(normalizePem(cfg.publicKey, "PUBLIC"), signature, "base64");
  } catch {
    return false;
  }
}