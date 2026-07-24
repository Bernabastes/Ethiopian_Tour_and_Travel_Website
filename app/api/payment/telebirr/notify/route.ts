import { NextResponse } from "next/server";
import { telebirrEnabled, verifyNotifySignature } from "@/lib/telebirr";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// telebirr async notify callback — telebirr POSTs the payment result to the
// notify_url we registered when creating the order. Marks the booking paid.
// Mirrors app/api/payment/stripe/webhook/route.ts.
//
// TODO(docs): confirm the exact notify field names against your integration PDF.
// Common ones: merch_order_id, trade_status ("Completed"/"SUCCESS"), total_amount,
// transaction_id / payment_order_id, sign.
export async function POST(request: Request) {
  if (!telebirrEnabled) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    console.error("[TELEBIRR] notify: invalid JSON");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const signature = String(payload.sign ?? "");
  // Until telebirr's public key (TELEBIRR_PUBLIC_KEY) is available, allow the
  // notify through in non-production so the full flow can be tested. In
  // production we always require a valid signature.
  const skipVerify =
    !process.env.TELEBIRR_PUBLIC_KEY && process.env.NODE_ENV !== "production";
  if (skipVerify) {
    console.warn(
      "[TELEBIRR] notify: signature verification SKIPPED (no public key, dev mode)",
    );
  } else if (!verifyNotifySignature(payload, signature)) {
    console.error("[TELEBIRR] notify: bad signature");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const merchOrderId = String(payload.merch_order_id ?? "");
  const tradeStatus = String(payload.trade_status ?? "").toLowerCase();
  const isPaid = tradeStatus === "completed" || tradeStatus === "success";

  // merchOrderId is `${reference}-${mode}` (see the create route).
  const sep = merchOrderId.lastIndexOf("-");
  const reference = sep > 0 ? merchOrderId.slice(0, sep) : merchOrderId;
  const mode = sep > 0 ? merchOrderId.slice(sep + 1) : "deposit";

  if (isPaid && reference) {
    try {
      const booking = await prisma.booking.update({
        where: { reference },
        data: {
          paymentStatus: mode === "full" ? "PAID" : "DEPOSIT_PAID",
          status: "CONFIRMED",
          paymentRef:
            String(payload.transaction_id ?? payload.payment_order_id ?? merchOrderId),
        },
      });
      await sendReceiptEmail(booking);
    } catch (err) {
      console.error("[TELEBIRR] booking update failed:", err);
    }
  }

  // telebirr expects a success acknowledgement so it stops retrying.
  return NextResponse.json({ code: "Success", msg: "OK" });
}