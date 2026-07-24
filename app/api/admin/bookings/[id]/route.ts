import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendStatusEmail, sendReceiptEmail } from "@/lib/email";
import type { BookingStatus } from "@prisma/client";

const VALID: BookingStatus[] = ["PENDING", "CONFIRMED", "PAID", "CANCELLED"];

// PATCH /api/admin/bookings/:id — change booking status (§4.5). Confirming/cancelling/
// marking paid auto-emails the customer.
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = (await request.json().catch(() => ({}))) as { status?: string };
  const status = body.status as BookingStatus | undefined;
  if (!status || !VALID.includes(status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 422 });
  }

  const paymentStatus =
    status === "PAID" ? "PAID" : status === "CANCELLED" ? "REFUNDED" : undefined;

  const booking = await prisma.booking.update({
    where: { id },
    data: { status, ...(paymentStatus ? { paymentStatus } : {}) },
  });

  if (status === "PAID") {
    try {
      await sendReceiptEmail(booking);
    } catch (err) {
      console.error("[ADMIN] receipt email failed:", err);
    }
  } else if (status === "CONFIRMED" || status === "CANCELLED") {
    try {
      await sendStatusEmail(booking.email, booking.fullName, booking.reference, booking.tourName, status);
    } catch (err) {
      console.error("[ADMIN] status email failed:", err);
    }
  }

  return NextResponse.json({ ok: true, status });
}
