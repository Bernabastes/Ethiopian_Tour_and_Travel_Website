import { NextResponse } from "next/server";
import { telebirrEnabled, createCheckoutUrl, usdToEtb } from "@/lib/telebirr";
import { prisma } from "@/lib/prisma";

// POST { reference, mode?: "deposit" | "full" } → creates a telebirr Web Payment
// (H5) order for the booking and returns the checkout redirect URL.
// Mirrors app/api/payment/stripe/route.ts.
export async function POST(request: Request) {
  if (!telebirrEnabled) {
    return NextResponse.json({ ok: false, error: "telebirr not configured" }, { status: 503 });
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
      merchOrderId: `${booking.reference}-${mode}`,
      amountEtb: usdToEtb(amountUsd),
      title: `${booking.tourName} — ${mode === "full" ? "Full payment" : "30% deposit"}`,
      notifyUrl: `${origin}/api/payment/telebirr/notify`,
      redirectUrl: `${origin}/book/success?ref=${booking.reference}&paid=1`,
    });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    console.error("[TELEBIRR] create order failed:", err);
    return NextResponse.json({ ok: false, error: "Could not start telebirr payment" }, { status: 502 });
  }
}