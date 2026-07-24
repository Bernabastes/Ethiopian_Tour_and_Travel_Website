import { Resend } from "resend";
import { company } from "@/data/company";

// Transactional email via Resend. If RESEND_API_KEY is not set, emails are logged
// to the console instead of sent — so the app runs fine before you add the key.

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? `${company.name} <onboarding@resend.dev>`;
// Comma-separated owner/manager inboxes that receive admin notifications.
const ADMIN_INBOXES = (process.env.ADMIN_NOTIFY_EMAILS ?? company.email)
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

interface Mail {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

async function send(mail: Mail) {
  if (!resend) {
    console.log(`[EMAIL fallback — no RESEND_API_KEY] → ${mail.to}: ${mail.subject}`);
    return { ok: true, simulated: true };
  }
  try {
    await resend.emails.send({
      from: FROM,
      to: Array.isArray(mail.to) ? mail.to : [mail.to],
      subject: mail.subject,
      html: mail.html,
      replyTo: mail.replyTo,
    });
    return { ok: true };
  } catch (err) {
    console.error("[EMAIL] send failed:", err);
    return { ok: false };
  }
}

const wrap = (inner: string) => `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1A1A1A">
    <div style="background:#1B6B3A;padding:20px;text-align:center">
      <span style="color:#fff;font-size:20px;font-weight:700">${company.name}</span>
    </div>
    <div style="padding:24px;background:#FAF9F6">${inner}</div>
    <div style="padding:16px;text-align:center;font-size:12px;color:#888">
      ${company.address.line}, ${company.address.city} · ${company.phone}<br/>
      ETO License ${company.etoLicense}
    </div>
  </div>`;

export interface BookingEmailData {
  reference: string;
  fullName: string;
  email: string;
  tourName: string;
  travelDate: string;
  adults: number;
  children: number;
  infants: number;
  totalUsd: number;
  depositUsd: number;
  phone: string;
  country: string;
  requests?: string;
}

export async function sendBookingEmails(b: BookingEmailData) {
  // 1) Customer confirmation (§4.3)
  await send({
    to: b.email,
    subject: `Booking received — ${b.tourName} (Ref #${b.reference})`,
    html: wrap(`
      <h2 style="color:#13502B">Thank you, ${b.fullName.split(" ")[0]}!</h2>
      <p>We've received your booking request. Here are the details:</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Reference</td><td style="text-align:right;font-weight:700">#${b.reference}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Tour</td><td style="text-align:right">${b.tourName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Travel date</td><td style="text-align:right">${b.travelDate}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Travellers</td><td style="text-align:right">${b.adults} adults, ${b.children} children, ${b.infants} infants</td></tr>
        <tr><td style="padding:6px 0;color:#666">Estimated total</td><td style="text-align:right;font-weight:700">$${b.totalUsd.toLocaleString()}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Deposit to confirm (30%)</td><td style="text-align:right">$${b.depositUsd.toLocaleString()}</td></tr>
      </table>
      <p style="margin-top:16px"><strong>What happens next:</strong> our team will review availability and contact you within 24 hours to confirm and arrange the deposit. No payment has been taken yet.</p>
      <p>Questions? Reply to this email or chat with us on
        <a href="https://wa.me/${company.whatsapp}" style="color:#1B6B3A">WhatsApp</a>.</p>
    `),
    replyTo: company.email,
  });

  // 2) Admin notification (§4.3)
  await send({
    to: ADMIN_INBOXES,
    subject: `🟢 New booking #${b.reference} — ${b.tourName}`,
    html: wrap(`
      <h2 style="color:#13502B">New booking request</h2>
      <table style="width:100%;border-collapse:collapse;font-size:14px">
        <tr><td style="padding:6px 0;color:#666">Reference</td><td style="text-align:right;font-weight:700">#${b.reference}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Customer</td><td style="text-align:right">${b.fullName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Email</td><td style="text-align:right">${b.email}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Phone</td><td style="text-align:right">${b.phone}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Country</td><td style="text-align:right">${b.country}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Tour</td><td style="text-align:right">${b.tourName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Date</td><td style="text-align:right">${b.travelDate}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Travellers</td><td style="text-align:right">${b.adults}A ${b.children}C ${b.infants}I</td></tr>
        <tr><td style="padding:6px 0;color:#666">Total / Deposit</td><td style="text-align:right">$${b.totalUsd.toLocaleString()} / $${b.depositUsd.toLocaleString()}</td></tr>
      </table>
      ${b.requests ? `<p style="margin-top:12px"><strong>Requests:</strong> ${b.requests}</p>` : ""}
      <p style="margin-top:16px"><a href="mailto:${b.email}" style="background:#1B6B3A;color:#fff;padding:10px 18px;border-radius:8px;text-decoration:none">Reply to customer</a></p>
    `),
    replyTo: b.email,
  });
}

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export interface ReceiptEmailData {
  reference: string;
  fullName: string;
  email: string;
  tourName: string;
  travelDate: Date | string;
  totalUsd: number;
  depositUsd: number;
  paymentStatus: "DEPOSIT_PAID" | "PAID" | string;
  paymentRef?: string | null;
}

// Receipt email sent after a successful payment. Unlike the generic status
// email, this shows the amount actually paid, whether it was a deposit or the
// full balance, the remaining balance (if any), and the transaction reference.
export async function sendReceiptEmail(b: ReceiptEmailData) {
  const isDeposit = b.paymentStatus === "DEPOSIT_PAID";
  const paid = isDeposit ? b.depositUsd : b.totalUsd;
  const balance = Math.max(0, b.totalUsd - paid);

  const travel =
    b.travelDate instanceof Date
      ? b.travelDate.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
      : b.travelDate;
  const issued = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const row = (label: string, value: string, opts: { strong?: boolean; color?: string } = {}) => `
    <tr>
      <td style="padding:6px 0;color:#666">${label}</td>
      <td style="text-align:right;${opts.strong ? "font-weight:700;" : ""}${
        opts.color ? `color:${opts.color};` : ""
      }">${value}</td>
    </tr>`;

  return send({
    to: b.email,
    subject: `Payment receipt — ${b.tourName} (#${b.reference})`,
    html: wrap(`
      <h2 style="color:#13502B;margin-bottom:4px">Payment received 🎉</h2>
      <p style="margin-top:0">Thank you, ${b.fullName.split(" ")[0]}! Here's your receipt for booking
        <strong>#${b.reference}</strong>. Please keep it for your records.</p>

      <div style="background:#fff;border:1px solid #E8E5DD;border-radius:10px;padding:18px 20px;margin:16px 0">
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${row("Receipt #", b.reference)}
          ${row("Date issued", issued)}
          ${row("Tour", b.tourName)}
          ${row("Travel date", travel)}
          ${b.paymentRef ? row("Transaction ref", b.paymentRef) : ""}
        </table>

        <hr style="border:none;border-top:1px solid #E8E5DD;margin:14px 0" />

        <table style="width:100%;border-collapse:collapse;font-size:14px">
          ${row("Tour total", money(b.totalUsd))}
          ${row(isDeposit ? "Deposit paid (30%)" : "Paid in full", money(paid))}
          ${row("Amount paid", money(paid), { strong: true, color: "#1B6B3A" })}
          ${
            isDeposit
              ? row("Balance remaining", money(balance), { strong: true })
              : ""
          }
        </table>
      </div>

      ${
        isDeposit
          ? `<p>Your deposit secures your booking — the remaining balance of <strong>${money(
              balance,
            )}</strong> is due before your travel date. Our team will be in touch to arrange it.</p>`
          : `<p>Your tour is fully paid and confirmed. We can't wait to host you! 🇪🇹</p>`
      }
      <p>Questions about this receipt? Reply to this email or chat with us on
        <a href="https://wa.me/${company.whatsapp}" style="color:#1B6B3A">WhatsApp</a>.</p>
    `),
    replyTo: company.email,
  });
}

export async function sendStatusEmail(
  to: string,
  fullName: string,
  reference: string,
  tourName: string,
  status: "CONFIRMED" | "CANCELLED" | "PAID",
) {
  const copy: Record<string, { subject: string; body: string }> = {
    CONFIRMED: {
      subject: `Your booking is confirmed — ${tourName} (#${reference})`,
      body: `<p>Great news, ${fullName.split(" ")[0]}! Your booking <strong>#${reference}</strong> for <strong>${tourName}</strong> is now <strong>confirmed</strong>. We'll be in touch with final details shortly.</p>`,
    },
    PAID: {
      subject: `Payment received — ${tourName} (#${reference})`,
      body: `<p>Thank you, ${fullName.split(" ")[0]}! We've received your payment for booking <strong>#${reference}</strong> (${tourName}). You're all set.</p>`,
    },
    CANCELLED: {
      subject: `Booking cancelled — ${tourName} (#${reference})`,
      body: `<p>Hello ${fullName.split(" ")[0]}, your booking <strong>#${reference}</strong> for ${tourName} has been cancelled. If this was a mistake or you'd like to rebook, just reply to this email.</p>`,
    },
  };
  const c = copy[status];
  return send({ to, subject: c.subject, html: wrap(c.body), replyTo: company.email });
}

export async function sendContactEmails(m: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  tour?: string;
  message: string;
}) {
  // Route by subject (§6.2 Form Email Routing)
  const routeMap: Record<string, string> = {
    "Tour Inquiry": company.salesEmail,
    "Custom Tour Request": company.salesEmail,
    "Payment Issue": company.accountsEmail,
  };
  const to = routeMap[m.subject] ?? company.email;

  await send({
    to,
    subject: `📨 ${m.subject}${m.tour ? ` — ${m.tour}` : ""} (from ${m.name})`,
    html: wrap(`
      <h2 style="color:#13502B">New contact message</h2>
      <p><strong>From:</strong> ${m.name} (${m.email})${m.phone ? ` · ${m.phone}` : ""}</p>
      <p><strong>Subject:</strong> ${m.subject}${m.tour ? ` · Tour: ${m.tour}` : ""}</p>
      <p style="white-space:pre-wrap;margin-top:12px;padding:12px;background:#fff;border-radius:8px">${m.message}</p>
    `),
    replyTo: m.email,
  });
}
