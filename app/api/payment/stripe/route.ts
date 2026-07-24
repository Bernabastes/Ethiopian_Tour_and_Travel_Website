import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { company } from "@/data/company";

// POST { reference, mode?: "deposit" | "full" } → creates a Stripe Checkout Session
// for the booking and returns the redirect URL.
export async function POST(request: Request) {
  if (!stripe) {
    return NextResponse.json({ ok: false, error: "Payments not configured" }, { status: 503 });
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

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: amountUsd * 100,
          product_data: {
            name: `${booking.tourName} — ${mode === "full" ? "Full payment" : "30% deposit"}`,
            description: `Booking ${booking.reference} for ${booking.fullName}`,
          },
        },
      },
    ],
    customer_email: booking.email,
    metadata: { reference: booking.reference, mode },
    success_url: `${origin}/book/success?ref=${booking.reference}&paid=1`,
    cancel_url: `${origin}/book/success?ref=${booking.reference}&paid=0`,
  });

  return NextResponse.json({ ok: true, url: session.url });
}
