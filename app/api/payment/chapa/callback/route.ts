import { NextResponse } from "next/server";
import { chapaEnabled, verifyTransaction, parseTxRef } from "@/lib/chapa";
import { prisma } from "@/lib/prisma";
import { sendReceiptEmail } from "@/lib/email";

// Chapa server callback — Chapa calls this URL after payment with trx_ref, ref_id,
// and status. We always re-verify via the Chapa API before marking a booking paid.
// Mirrors app/api/payment/telebirr/notify/route.ts.
export async function GET(request: Request) {
  if (!chapaEnabled) return NextResponse.json({ ok: false }, { status: 503 });

  const { searchParams } = new URL(request.url);
  const txRef =
    searchParams.get("trx_ref") ??
    searchParams.get("tx_ref") ??
    "";
  const status = (searchParams.get("status") ?? "").toLowerCase();

  if (!txRef) {
    return NextResponse.json({ ok: false, error: "tx_ref missing" }, { status: 400 });
  }

  if (status && status !== "success") {
    return NextResponse.json({ ok: true, message: "Payment not successful" });
  }

  try {
    const verified = await verifyTransaction(txRef);
    if (!verified || (verified.status ?? "").toLowerCase() !== "success") {
      return NextResponse.json({ ok: true, message: "Payment not verified" });
    }

    const parsed =
      parseTxRef(txRef) ??
      (verified.meta?.reference && verified.meta?.mode
        ? {
            reference: verified.meta.reference,
            mode: verified.meta.mode as "deposit" | "full",
          }
        : null);

    if (!parsed) {
      console.error("[CHAPA] callback: could not parse tx_ref:", txRef);
      return NextResponse.json({ ok: false, error: "Invalid tx_ref" }, { status: 400 });
    }

    const booking = await prisma.booking.update({
      where: { reference: parsed.reference },
      data: {
        paymentStatus: parsed.mode === "full" ? "PAID" : "DEPOSIT_PAID",
        status: "CONFIRMED",
        paymentRef: String(verified.reference ?? txRef),
      },
    });

    await sendReceiptEmail(booking);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CHAPA] callback failed:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
