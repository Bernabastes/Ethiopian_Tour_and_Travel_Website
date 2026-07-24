import type { Metadata } from "next";
import { Landmark, CreditCard, Smartphone, ShieldCheck, Lock } from "lucide-react";
import { BookingForm } from "@/components/booking/BookingForm";
import { company } from "@/data/company";
import { getTours } from "@/lib/content";
import { chapaEnabled } from "@/lib/chapa";
import { paypalEnabled } from "@/lib/paypal";
import { telebirrEnabled } from "@/lib/telebirr";
import { stripeEnabled } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Book Your Ethiopia Tour",
  description:
    "Request your Ethiopian tour booking online. Secure, no payment taken upfront — we confirm availability and send a quote within 24 hours.",
  alternates: { canonical: "/book" },
  robots: { index: false }, // checkout-style page (§8.1)
};

export default async function BookPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour } = await searchParams;
  const tours = await getTours();
  const bookableTours = tours.map((t) => ({
    slug: t.slug,
    name: t.name,
    priceFromUsd: t.priceFromUsd,
  }));

  return (
    <div className="pt-[var(--header-h)]">
      <header className="bg-brand-green-dark py-10 text-center text-white">
        <div className="container-page">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">
            Book Your Adventure
          </h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Fill in your details below. It only takes a minute — and no payment is taken until your
            tour is confirmed.
          </p>
        </div>
      </header>

      <div className="container-page py-10">
        <BookingForm
          preselectTour={tour}
          tours={bookableTours}
          telebirrEnabled={telebirrEnabled}
          chapaEnabled={chapaEnabled}
          paypalEnabled={paypalEnabled}
        />

        {/* Payment & security (§4.4) */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="card p-6">
            <h2 className="font-heading text-xl text-brand-green-dark">How Payment Works</h2>
            <p className="mt-2 text-sm text-ink/70">
              After you submit, we confirm availability and email you a quote and invoice. Secure a
              place with a <strong>30% deposit</strong>; the balance is due before your tour begins.
            </p>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {/* Bank transfer — the launch-ready MUST option */}
              <div className="rounded-xl border border-brand-green/30 bg-brand-green/5 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-brand-green">
                  <Landmark size={18} /> Bank Transfer
                  <span className="badge ml-auto bg-brand-green text-white">Available now</span>
                </h3>
                <dl className="mt-3 space-y-1 text-sm text-ink/75">
                  <div className="flex justify-between"><dt className="text-ink/55">Bank</dt><dd>{company.bank.bankName}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink/55">Account name</dt><dd>{company.bank.accountName}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink/55">Account no.</dt><dd>{company.bank.accountNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-ink/55">SWIFT</dt><dd>{company.bank.swift}</dd></div>
                </dl>
                <p className="mt-2 text-xs text-ink/50">
                  Use your booking reference as the payment reference. Your tour is confirmed once
                  the transfer is received.
                </p>
              </div>

              {/* Online payment options */}
              <div className="rounded-xl border border-black/10 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-ink">
                  <CreditCard size={18} /> Card &amp; Online
                  {(chapaEnabled || stripeEnabled || telebirrEnabled || paypalEnabled) ? (
                    <span className="badge ml-auto bg-brand-green text-white">Available</span>
                  ) : (
                    <span className="badge ml-auto bg-black/10 text-ink/60">Configure keys</span>
                  )}
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-ink/70">
                  {paypalEnabled && (
                    <li className="flex items-center gap-2">
                      <CreditCard size={15} className="text-brand-green" /> PayPal (USD)
                    </li>
                  )}
                  {chapaEnabled && (
                    <li className="flex items-center gap-2">
                      <Smartphone size={15} className="text-brand-green" /> Chapa (cards, telebirr, CBE Birr &amp; more)
                    </li>
                  )}
                  {stripeEnabled && (
                    <li className="flex items-center gap-2">
                      <CreditCard size={15} className="text-brand-green" /> Stripe (Visa, Mastercard, Amex)
                    </li>
                  )}
                  {telebirrEnabled && (
                    <li className="flex items-center gap-2">
                      <Smartphone size={15} className="text-brand-green" /> telebirr (direct)
                    </li>
                  )}
                  {!chapaEnabled && !stripeEnabled && !telebirrEnabled && !paypalEnabled && (
                    <>
                      <li className="flex items-center gap-2"><CreditCard size={15} className="text-ink/40" /> PayPal / Chapa / Stripe / telebirr</li>
                      <li className="flex items-center gap-2"><Smartphone size={15} className="text-ink/40" /> Add payment keys in <code className="text-xs">.env</code></li>
                    </>
                  )}
                </ul>
                <p className="mt-2 text-xs text-ink/50">
                  {chapaEnabled || stripeEnabled || telebirrEnabled || paypalEnabled
                    ? "Pay your 30% deposit online after submitting your booking, or use bank transfer."
                    : "Online payments need API keys in .env. Bank transfer is always available."}
                </p>
              </div>
            </div>
          </div>

          {/* Security display (§4.4 MUST) */}
          <aside className="card h-fit p-6">
            <h2 className="font-heading text-lg text-brand-green-dark">Your booking is secure</h2>
            <ul className="mt-4 space-y-3 text-sm text-ink/75">
              <li className="flex items-start gap-2"><Lock size={16} className="mt-0.5 text-brand-green" /> SSL-encrypted connection on every page.</li>
              <li className="flex items-start gap-2"><ShieldCheck size={16} className="mt-0.5 text-brand-green" /> We never store card details on our servers — online payments use PCI-compliant providers.</li>
              <li className="flex items-start gap-2"><ShieldCheck size={16} className="mt-0.5 text-brand-green" /> Licensed operator, ETO No. {company.etoLicense}.</li>
            </ul>
          </aside>
        </section>
      </div>
    </div>
  );
}
