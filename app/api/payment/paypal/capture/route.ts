import { NextResponse } from "next/server";
import { paypalEnabled, captureOrder } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// PayPal return URL — customer lands here after approving payment. PayPal appends
// `token` (the order ID). We capture the funds, update the booking, then redirect.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("token");
  const ref = searchParams.get("ref") ?? "";
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const failUrl = `${origin}/book/success?ref=${encodeURIComponent(ref)}&paid=0`;
  const successUrl = `${origin}/book/success?ref=${encodeURIComponent(ref)}&paid=1`;

  if (!paypalEnabled || !orderId) {
    return NextResponse.redirect(failUrl);
  }

  try {
    const captured = await captureOrder(orderId, { reference: ref || undefined, mode: "deposit" });

    if (ref && captured.reference !== ref) {
      console.error("[PAYPAL] capture: reference mismatch", { ref, captured: captured.reference });
      return NextResponse.redirect(failUrl);
    }

    const booking = await prisma.booking.update({
      where: { reference: captured.reference },
      data: {
        paymentStatus: captured.mode === "full" ? "PAID" : "DEPOSIT_PAID",
        status: "CONFIRMED",
        paymentRef: captured.captureId,
      },
    });

    // Send receipt in the background so the redirect is not delayed.
    void sendReceiptEmail(booking).catch((err) =>
      console.error("[PAYPAL] receipt email failed:", err),
    );

    return NextResponse.redirect(successUrl);
  } catch (err) {
    // Already captured on a previous visit — still send the customer to success.
    if (ref && orderId) {
      try {
        const existing = await prisma.booking.findUnique({ where: { reference: ref } });
        if (
          existing &&
          (existing.paymentStatus === "DEPOSIT_PAID" || existing.paymentStatus === "PAID")
        ) {
          return NextResponse.redirect(successUrl);
        }
      } catch {
        // fall through to failUrl
      }
    }
    console.error("[PAYPAL] capture failed:", err);
    return NextResponse.redirect(failUrl);
  }
}
