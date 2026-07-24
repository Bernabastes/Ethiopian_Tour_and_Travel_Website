import { NextResponse } from "next/server";
import { paypalEnabled, createCheckoutUrl } from "@/lib/paypal";
import { prisma } from "@/lib/prisma";

// POST { reference, mode?: "deposit" | "full" } → creates a PayPal order and
// returns the approval redirect URL. Mirrors app/api/payment/chapa/route.ts.
export async function POST(request: Request) {
  if (!paypalEnabled) {
    return NextResponse.json({ ok: false, error: "PayPal not configured" }, { status: 503 });
  }
  if (!process.env.DATABASE_URL) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  const { reference, mode = "deposit" } = (await request.json().catch(() => ({}))) as {
    reference?: string;
    mode?: "deposit" | "full";
  };
  if (!reference) {
    return NextResponse.json({ ok: false, error: "reference required" }, { status: 422 });
  }

  const booking = await prisma.booking.findUnique({ where: { reference } });
  if (!booking) {
    return NextResponse.json({ ok: false, error: "Booking not found" }, { status: 404 });
  }

  const amountUsd = mode === "full" ? booking.totalUsd : booking.depositUsd;
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  try {
    const url = await createCheckoutUrl({
      reference: booking.reference,
      mode,
      amountUsd,
      description:
        mode === "full"
          ? `Tour balance - ${booking.reference}`
          : `Tour deposit - ${booking.reference}`,
      returnUrl: `${origin}/api/payment/paypal/capture?ref=${encodeURIComponent(booking.reference)}`,
      cancelUrl: `${origin}/book/success?ref=${encodeURIComponent(booking.reference)}&paid=0`,
    });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start PayPal payment";
    console.error("[PAYPAL] create order failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
