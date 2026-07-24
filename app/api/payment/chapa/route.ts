import { NextResponse } from "next/server";
import {
  chapaEnabled,
  initializeCheckout,
  buildTxRef,
  usdToEtb,
  normalizeEthiopianPhone,
  splitFullName,
} from "@/lib/chapa";
import { prisma } from "@/lib/prisma";

// POST { reference, mode?: "deposit" | "full" } → initializes a Chapa checkout
// session and returns the redirect URL. Mirrors app/api/payment/stripe/route.ts.
export async function POST(request: Request) {
  if (!chapaEnabled) {
    return NextResponse.json({ ok: false, error: "Chapa not configured" }, { status: 503 });
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
  const txRef = buildTxRef(booking.reference, mode);
  const { firstName, lastName } = splitFullName(booking.fullName);

  try {
    const url = await initializeCheckout({
      txRef,
      amountEtb: usdToEtb(amountUsd),
      email: booking.email,
      firstName,
      lastName,
      phone: normalizeEthiopianPhone(booking.phone),
      title: mode === "full" ? "Tour balance" : "Tour deposit",
      description: mode === "full" ? `Balance ${booking.reference}` : `Deposit ${booking.reference}`,
      callbackUrl: `${origin}/api/payment/chapa/callback`,
      returnUrl: `${origin}/book/success?ref=${booking.reference}&paid=1`,
    });
    return NextResponse.json({ ok: true, url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Could not start Chapa payment";
    console.error("[CHAPA] initialize failed:", message);
    return NextResponse.json({ ok: false, error: message }, { status: 502 });
  }
}
