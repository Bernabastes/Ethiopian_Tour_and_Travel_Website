import { NextResponse } from "next/server";
import { chapaEnabled, verifyWebhookSignature, parseTxRef } from "@/lib/chapa";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// Chapa webhook — receives charge.success (and related) events. Configure the
// endpoint URL in your Chapa dashboard (Settings → Webhooks).
// Mirrors app/api/payment/stripe/webhook/route.ts.
export async function POST(request: Request) {
  if (!chapaEnabled) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await request.text();
  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw);
  } catch {
    console.error("[CHAPA] webhook: invalid JSON");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const signature =
    request.headers.get("x-chapa-signature") ??
    request.headers.get("chapa-signature") ??
    "";

  const skipVerify = process.env.NODE_ENV !== "production" && !signature;
  if (skipVerify) {
    console.warn("[CHAPA] webhook: signature verification SKIPPED (dev mode, no header)");
  } else if (!verifyWebhookSignature(payload, signature)) {
    console.error("[CHAPA] webhook: bad signature");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const event = String(payload.event ?? "");
  const status = String(payload.status ?? "").toLowerCase();
  const txRef = String(payload.tx_ref ?? "");

  if (event !== "charge.success" && status !== "success") {
    return NextResponse.json({ received: true });
  }

  const parsed = parseTxRef(txRef);
  if (!parsed) {
    console.error("[CHAPA] webhook: could not parse tx_ref:", txRef);
    return NextResponse.json({ received: true });
  }

  try {
    const existing = await prisma.booking.findUnique({ where: { reference: parsed.reference } });
    if (
      existing &&
      (existing.paymentStatus === "PAID" ||
        (existing.paymentStatus === "DEPOSIT_PAID" && parsed.mode === "deposit"))
    ) {
      return NextResponse.json({ received: true });
    }

    const booking = await prisma.booking.update({
      where: { reference: parsed.reference },
      data: {
        paymentStatus: parsed.mode === "full" ? "PAID" : "DEPOSIT_PAID",
        status: "CONFIRMED",
        paymentRef: String(payload.reference ?? txRef),
      },
    });

    await sendReceiptEmail(booking);
  } catch (err) {
    console.error("[CHAPA] webhook booking update failed:", err);
  }

  return NextResponse.json({ received: true });
}
