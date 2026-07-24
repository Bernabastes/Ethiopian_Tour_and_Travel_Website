import { NextResponse } from "next/server";
import { paypalEnabled, verifyWebhook, parseCustomId } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// PayPal webhook — handles PAYMENT.CAPTURE.COMPLETED as a backup when the return
// URL capture step is missed. Register in PayPal Developer Dashboard:
//   https://YOUR-SITE/api/payment/paypal/webhook
export async function POST(request: Request) {
  if (!paypalEnabled) return NextResponse.json({ ok: false }, { status: 503 });

  const raw = await request.text();
  let event: {
    event_type?: string;
    resource?: { custom_id?: string; id?: string; status?: string };
  };
  try {
    event = JSON.parse(raw);
  } catch {
    console.error("[PAYPAL] webhook: invalid JSON");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const verified = await verifyWebhook(request.headers, event);
  if (!verified) {
    console.error("[PAYPAL] webhook: signature verification failed");
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.event_type !== "PAYMENT.CAPTURE.COMPLETED") {
    return NextResponse.json({ received: true });
  }

  const customId = event.resource?.custom_id;
  const status = event.resource?.status;
  const captureId = event.resource?.id;
  if (!customId || status !== "COMPLETED") {
    return NextResponse.json({ received: true });
  }

  const parsed = parseCustomId(customId);
  if (!parsed) {
    console.error("[PAYPAL] webhook: invalid custom_id:", customId);
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
        paymentRef: captureId ?? customId,
      },
    });

    await sendReceiptEmail(booking);
  } catch (err) {
    console.error("[PAYPAL] webhook booking update failed:", err);
  }

  return NextResponse.json({ received: true });
}
