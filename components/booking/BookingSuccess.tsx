"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, CreditCard, Smartphone, Loader2, Wallet } from "lucide-react";
import { formatUsd } from "@/lib/format";

const stripeEnabled = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

export function BookingSuccess({
  reference,
  firstName,
  email,
  tourName,
  deposit,
  telebirrEnabled = false,
  chapaEnabled = false,
  paypalEnabled = false,
}: {
  reference: string;
  firstName: string;
  email: string;
  tourName?: string;
  deposit: number;
  telebirrEnabled?: boolean;
  chapaEnabled?: boolean;
  paypalEnabled?: boolean;
}) {
  const [paying, setPaying] = useState<null | "stripe" | "telebirr" | "chapa" | "paypal">(null);
  const [error, setError] = useState("");

  async function payDeposit(provider: "stripe" | "telebirr" | "chapa" | "paypal") {
    setPaying(provider);
    setError("");
    try {
      const res = await fetch(`/api/payment/${provider}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, mode: "deposit" }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Could not start payment. Please try again.");
        setPaying(null);
      }
    } catch {
      setError("Could not start payment. Please try again.");
      setPaying(null);
    }
  }

  return (
    <div className="card mx-auto max-w-2xl p-8 text-center">
      <CheckCircle2 size={56} className="mx-auto text-brand-green" />
      <h2 className="mt-4 text-2xl font-bold">Booking request received!</h2>
      <p className="mt-2 text-ink/70">
        Thank you, {firstName}. Your reference is{" "}
        <strong className="text-brand-green">#{reference}</strong>.
      </p>
      <p className="mt-2 text-sm text-ink/60">
        We&apos;ve sent a confirmation to <strong>{email}</strong> and our team will contact you
        within 24 hours to finalise your {tourName} adventure.
      </p>

      {(stripeEnabled || telebirrEnabled || chapaEnabled || paypalEnabled) && deposit > 0 && (
        <div className="mt-6 rounded-xl bg-brand-green/5 p-5">
          <p className="text-sm text-ink/70">
            Want to secure your place now? Pay the 30% deposit of{" "}
            <strong>{formatUsd(deposit)}</strong>.
          </p>
          <div className="mt-3 flex flex-col justify-center gap-2 sm:flex-row sm:flex-wrap">
            {paypalEnabled && (
              <button onClick={() => payDeposit("paypal")} disabled={!!paying}
                className="btn-primary disabled:opacity-60">
                {paying === "paypal" ? <><Loader2 size={18} className="animate-spin" /> Redirecting…</>
                  : <><Wallet size={18} /> Pay with PayPal</>}
              </button>
            )}
            {stripeEnabled && (
              <button onClick={() => payDeposit("stripe")} disabled={!!paying}
                className="btn-primary disabled:opacity-60">
                {paying === "stripe" ? <><Loader2 size={18} className="animate-spin" /> Redirecting…</>
                  : <><CreditCard size={18} /> Pay by card</>}
              </button>
            )}
            {telebirrEnabled && (
              <button onClick={() => payDeposit("telebirr")} disabled={!!paying}
                className="btn-green disabled:opacity-60">
                {paying === "telebirr" ? <><Loader2 size={18} className="animate-spin" /> Redirecting…</>
                  : <><Smartphone size={18} /> Pay with telebirr</>}
              </button>
            )}
            {chapaEnabled && (
              <button onClick={() => payDeposit("chapa")} disabled={!!paying}
                className="btn-green disabled:opacity-60">
                {paying === "chapa" ? <><Loader2 size={18} className="animate-spin" /> Redirecting…</>
                  : <><Smartphone size={18} /> Pay with Chapa</>}
              </button>
            )}
          </div>
          {error && <p className="mt-2 text-xs text-danger">{error}</p>}
          <p className="mt-2 text-[11px] text-ink/45">
            {paypalEnabled && "PayPal (USD). "}
            {stripeEnabled && "Secure card checkout via Stripe. "}
            {chapaEnabled && "Chapa (cards, telebirr, CBE Birr & more). "}
            {telebirrEnabled && "telebirr mobile money. "}
            Or pay later by bank transfer.
          </p>
        </div>
      )}

      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <Link href="/tours" prefetch={false} className="btn-ghost">Browse more tours</Link>
        <Link href="/" prefetch={false} className="btn-green">Back to home</Link>
      </div>
    </div>
  );
}
