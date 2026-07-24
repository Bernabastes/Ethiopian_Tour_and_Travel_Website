import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendContactEmails } from "@/lib/email";

// Contact endpoint (§6.2): persists the message and emails the right inbox
// (routed by subject). Resilient to missing DATABASE_URL / RESEND_API_KEY.

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const { name, email, phone, subject, tour, message } = body as Record<string, string>;
  if (!name || !email || !subject || !message) {
    return NextResponse.json({ ok: false, error: "Missing required fields" }, { status: 422 });
  }

  if (process.env.DATABASE_URL) {
    try {
      await prisma.contactMessage.create({
        data: {
          name, email, subject, message,
          phone: phone || null,
          tour: tour || null,
        },
      });
    } catch (err) {
      console.error("[CONTACT] DB write failed (continuing):", err);
    }
  } else {
    console.warn("[CONTACT] DATABASE_URL not set — message not persisted.");
  }

  try {
    await sendContactEmails({ name, email, phone, subject, tour, message });
  } catch (err) {
    console.error("[CONTACT] email failed (continuing):", err);
  }

  return NextResponse.json({ ok: true });
}
