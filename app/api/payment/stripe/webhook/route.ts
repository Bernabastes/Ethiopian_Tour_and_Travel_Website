import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// Stripe webhook — marks a booking paid when checkout completes.
// Configure the endpoint URL + signing secret in the Stripe dashboard (or `stripe listen`
// for local testing) and set STRIPE_WEBHOOK_SECRET.
export async function POST(request: Request) {
  if (!stripe) return NextResponse.json({ ok: false }, { status: 503 });

  const sig = request.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await request.text();

  let event: Stripe.Event;
  try {
    event = secret && sig
      ? stripe.webhooks.constructEvent(raw, sig, secret)
      : (JSON.parse(raw) as Stripe.Event); // dev fallback if no secret set
  } catch (err) {
    console.error("[STRIPE] webhook signature failed:", err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const reference = session.metadata?.reference;
    const mode = session.metadata?.mode;
    if (reference) {
      try {
        const booking = await prisma.booking.update({
          where: { reference },
          data: {
            paymentStatus: mode === "full" ? "PAID" : "DEPOSIT_PAID",
            status: "CONFIRMED",
            paymentRef: session.payment_intent?.toString() ?? session.id,
          },
        });
        await sendReceiptEmail(booking);
      } catch (err) {
        console.error("[STRIPE] booking update failed:", err);
      }
    }
  }

  return NextResponse.json({ received: true });
}
