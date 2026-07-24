import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBookingEmails } from "@/lib/email";

// Booking endpoint (§4.3): persists the booking to Postgres and sends the customer
// confirmation + admin notification emails.
//
// Resilient by design: if DATABASE_URL isn't set yet, the request still succeeds
// (logs a warning) so the public site keeps working before Supabase is connected.
// Likewise emails fall back to console logging without RESEND_API_KEY.

function makeReference() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-6);
  return `HHT-${stamp}`;
}

interface PricePayload {
  total?: number;
  deposit?: number;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const {
    fullName, email, phone, isWhatsapp, country, tour: tourName, tourSlug,
    travelDate, adults, children, infants, accommodation, requests, heard,
  } = body as Record<string, string | number | boolean>;
  const price = (body.price ?? {}) as PricePayload;

  if (!fullName || !email || !tourSlug || !travelDate) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }

  const reference = makeReference();
  const totalUsd = Math.round(Number(price.total) || 0);
  const depositUsd = Math.round(Number(price.deposit) || Math.round(totalUsd * 0.3));

  // 1) Persist (best-effort — never block the customer on infra issues)
  if (process.env.DATABASE_URL) {
    try {
      await prisma.booking.create({
        data: {
          reference,
          fullName: String(fullName),
          email: String(email),
          phone: String(phone ?? ""),
          isWhatsapp: Boolean(isWhatsapp),
          country: String(country ?? ""),
          tourSlug: String(tourSlug),
          tourName: String(tourName ?? tourSlug),
          travelDate: new Date(String(travelDate)),
          adults: Number(adults) || 1,
          children: Number(children) || 0,
          infants: Number(infants) || 0,
          accommodation: String(accommodation ?? "standard"),
          requests: requests ? String(requests) : null,
          heardAbout: heard ? String(heard) : null,
          totalUsd,
          depositUsd,
        },
      });
    } catch (err) {
      console.error("[BOOKING] DB write failed (continuing):", err);
    }
  } else {
    console.warn("[BOOKING] DATABASE_URL not set — booking not persisted:", reference);
  }

  // 2) Emails (best-effort)
  try {
    await sendBookingEmails({
      reference,
      fullName: String(fullName),
      email: String(email),
      tourName: String(tourName ?? tourSlug),
      travelDate: String(travelDate),
      adults: Number(adults) || 1,
      children: Number(children) || 0,
      infants: Number(infants) || 0,
      totalUsd,
      depositUsd,
      phone: String(phone ?? ""),
      country: String(country ?? ""),
      requests: requests ? String(requests) : undefined,
    });
  } catch (err) {
    console.error("[BOOKING] email failed (continuing):", err);
  }

  return NextResponse.json({ ok: true, reference });
}
