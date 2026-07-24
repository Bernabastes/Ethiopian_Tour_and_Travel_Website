"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Minus, Plus, Loader2, ShieldCheck, Lock } from "lucide-react";
import { countries } from "@/lib/countries";
import { company } from "@/data/company";
import { formatUsd, formatEtb } from "@/lib/format";
import { AvailabilityCalendar } from "./AvailabilityCalendar";
import { BookingSuccess } from "./BookingSuccess";

const ACCOMMODATION = [
  { value: "budget", label: "Budget (guesthouses)", mult: 0.85 },
  { value: "standard", label: "Standard (3-star hotels)", mult: 1 },
  { value: "premium", label: "Premium (4–5 star lodges)", mult: 1.4 },
];

const HEARD_OPTIONS = [
  "Google Search", "TripAdvisor", "Instagram", "Facebook",
  "Friend/Family Referral", "Returning Customer", "Other",
];

const DEPOSIT_RATE = 0.3;
const CHILD_RATE = 0.5;

function minBookingDate() {
  const d = new Date();
  d.setDate(d.getDate() + 3); // §4.1 min lead time 3 days
  return d.toISOString().slice(0, 10);
}

interface Errors {
  [k: string]: string | undefined;
}

// Minimal tour shape the form needs (slug + name for the picker, price for the quote).
type BookableTour = { slug: string; name: string; priceFromUsd: number };

export function BookingForm({
  preselectTour,
  tours,
  telebirrEnabled = false,
  chapaEnabled = false,
  paypalEnabled = false,
}: {
  preselectTour?: string;
  tours: BookableTour[];
  telebirrEnabled?: boolean;
  chapaEnabled?: boolean;
  paypalEnabled?: boolean;
}) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [dialCode, setDialCode] = useState("+251");
  const [phone, setPhone] = useState("");
  const [isWhatsapp, setIsWhatsapp] = useState(false);
  const [country, setCountry] = useState("Ethiopia");
  const [tourSlug, setTourSlug] = useState(preselectTour ?? "");
  const [travelDate, setTravelDate] = useState("");
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [accommodation, setAccommodation] = useState("standard");
  const [requests, setRequests] = useState("");
  const [heard, setHeard] = useState("");
  const [agree, setAgree] = useState(false);
  const [website, setWebsite] = useState(""); // honeypot

  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { ref: string }>(null);

  const tour = tours.find((t) => t.slug === tourSlug);
  const accMult = ACCOMMODATION.find((a) => a.value === accommodation)?.mult ?? 1;

  const price = useMemo(() => {
    const base = tour ? tour.priceFromUsd * accMult : 0;
    const adultsCost = base * adults;
    const childrenCost = base * CHILD_RATE * children;
    const total = Math.round(adultsCost + childrenCost);
    return {
      base: Math.round(base),
      adultsCost: Math.round(adultsCost),
      childrenCost: Math.round(childrenCost),
      total,
      deposit: Math.round(total * DEPOSIT_RATE),
    };
  }, [tour, accMult, adults, children]);

  function validate(): boolean {
    const e: Errors = {};
    if (fullName.trim().length < 2) e.fullName = "Please enter your full name (letters only).";
    else if (/\d/.test(fullName)) e.fullName = "Please enter your full name (letters only).";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email address.";
    if (phone.trim().length < 6) e.phone = "Please enter a valid phone number.";
    if (!tourSlug) e.tour = "Please select a tour.";
    if (!travelDate) e.travelDate = "Please choose a travel date.";
    if (adults < 1) e.adults = "At least one adult is required.";
    if (!agree) e.agree = "You must accept the Terms & Conditions to continue.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (website) return; // honeypot tripped — silently drop
    if (!validate()) {
      const firstErr = document.querySelector("[data-error='true']");
      firstErr?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName, email, phone: `${dialCode} ${phone}`, isWhatsapp, country,
          tour: tour?.name, tourSlug, travelDate, adults, children, infants,
          accommodation, requests, heard, price,
        }),
      });
      const data = await res.json();
      setDone({ ref: data.reference ?? "HHT-PENDING" });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setErrors({ form: "Something went wrong. Please try again or contact us on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <BookingSuccess
        reference={done.ref}
        firstName={fullName.split(" ")[0]}
        email={email}
        tourName={tour?.name}
        deposit={price.deposit}
        telebirrEnabled={telebirrEnabled}
        chapaEnabled={chapaEnabled}
        paypalEnabled={paypalEnabled}
      />
    );
  }

  const stepBtn = "flex h-10 w-10 items-center justify-center rounded-lg border border-black/15 hover:border-brand-green disabled:opacity-40";

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-8">
        {/* Personal details */}
        <fieldset className="card p-6">
          <legend className="px-2 font-heading text-xl text-brand-green-dark">Your Details</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div data-error={!!errors.fullName}>
              <label className="label" htmlFor="fullName">Full Name *</label>
              <input id="fullName" className={`input ${errors.fullName ? "input-error" : ""}`}
                placeholder="Enter your full name" value={fullName}
                onChange={(e) => setFullName(e.target.value)} maxLength={100} />
              {errors.fullName && <p className="mt-1 text-xs text-danger">{errors.fullName}</p>}
            </div>
            <div data-error={!!errors.email}>
              <label className="label" htmlFor="email">Email *</label>
              <input id="email" type="email" className={`input ${errors.email ? "input-error" : ""}`}
                placeholder="your@email.com" value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
                  setErrors((p) => ({ ...p, email: "Please enter a valid email address." }))} />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
            </div>
            <div data-error={!!errors.phone}>
              <label className="label" htmlFor="phone">Phone *</label>
              <div className="flex gap-2">
                <select value={dialCode} onChange={(e) => setDialCode(e.target.value)}
                  className="input w-28 px-2" aria-label="Country code">
                  {countries.filter((c) => c.dial !== "+").map((c) => (
                    <option key={c.code} value={c.dial}>{c.flag} {c.dial}</option>
                  ))}
                </select>
                <input id="phone" className={`input flex-1 ${errors.phone ? "input-error" : ""}`}
                  placeholder="09XXXXXXXX" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <label className="mt-2 flex items-center gap-2 text-sm text-ink/70">
                <input type="checkbox" checked={isWhatsapp} onChange={(e) => setIsWhatsapp(e.target.checked)}
                  className="h-4 w-4 accent-brand-green" />
                This number is on WhatsApp
              </label>
              {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone}</p>}
            </div>
            <div>
              <label className="label" htmlFor="country">Country *</label>
              <select id="country" value={country} onChange={(e) => setCountry(e.target.value)} className="input">
                {countries.filter((c) => c.name !== "Other").map((c) => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Travel details */}
        <fieldset className="card p-6">
          <legend className="px-2 font-heading text-xl text-brand-green-dark">Travel Details</legend>
          <div className="mt-2 grid gap-4">
            <div data-error={!!errors.tour}>
              <label className="label" htmlFor="tour">Tour *</label>
              <select id="tour" value={tourSlug} onChange={(e) => setTourSlug(e.target.value)}
                className={`input ${errors.tour ? "input-error" : ""}`}>
                <option value="">Select a tour…</option>
                {tours.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
              </select>
              {errors.tour && <p className="mt-1 text-xs text-danger">{errors.tour}</p>}
            </div>

            <div data-error={!!errors.travelDate}>
              <label className="label" htmlFor="travelDate">Travel Date *</label>
              <input id="travelDate" type="date" min={minBookingDate()} value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className={`input ${errors.travelDate ? "input-error" : ""}`} />
              <p className="mt-1 text-xs text-ink/50">
                Minimum 3 days lead time. Or pick an available date on the calendar →
              </p>
              {errors.travelDate && <p className="mt-1 text-xs text-danger">{errors.travelDate}</p>}
            </div>

            <div>
              <span className="label">Number of Travelers *</span>
              <div className="grid gap-3 sm:grid-cols-3">
                {([
                  ["Adults (18+)", adults, setAdults, 1],
                  ["Children (2–17)", children, setChildren, 0],
                  ["Infants (under 2)", infants, setInfants, 0],
                ] as const).map(([label, val, setter, min]) => (
                  <div key={label} className="rounded-lg border border-black/10 p-3">
                    <p className="mb-2 text-xs font-medium text-ink/60">{label}</p>
                    <div className="flex items-center justify-between">
                      <button type="button" className={stepBtn} disabled={val <= min}
                        onClick={() => setter(Math.max(min, val - 1))} aria-label={`Decrease ${label}`}>
                        <Minus size={16} />
                      </button>
                      <span className="w-8 text-center text-lg font-semibold">{val}</span>
                      <button type="button" className={stepBtn}
                        onClick={() => setter(val + 1)} aria-label={`Increase ${label}`}>
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span className="label">Accommodation Preference</span>
              <div className="grid gap-2 sm:grid-cols-3">
                {ACCOMMODATION.map((a) => (
                  <label key={a.value}
                    className={`flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm ${
                      accommodation === a.value ? "border-brand-green bg-brand-green/5" : "border-black/10"
                    }`}>
                    <input type="radio" name="acc" value={a.value} checked={accommodation === a.value}
                      onChange={() => setAccommodation(a.value)} className="h-4 w-4 accent-brand-green" />
                    {a.label}
                  </label>
                ))}
              </div>
            </div>
          </div>
        </fieldset>

        {/* Preferences */}
        <fieldset className="card p-6">
          <legend className="px-2 font-heading text-xl text-brand-green-dark">Preferences</legend>
          <div className="mt-2 space-y-4">
            <div>
              <label className="label" htmlFor="requests">Special Requests</label>
              <textarea id="requests" rows={5} maxLength={500} value={requests}
                onChange={(e) => setRequests(e.target.value)} className="input resize-y"
                placeholder="Any dietary requirements, medical conditions, special occasions, specific interests or questions for us?" />
              <p className="mt-1 text-right text-xs text-ink/40">{requests.length}/500</p>
            </div>
            <div>
              <label className="label" htmlFor="heard">How did you find us?</label>
              <select id="heard" value={heard} onChange={(e) => setHeard(e.target.value)} className="input">
                <option value="">Select…</option>
                {HEARD_OPTIONS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>
        </fieldset>

        {/* Honeypot (anti-spam) */}
        <input type="text" tabIndex={-1} autoComplete="off" value={website}
          onChange={(e) => setWebsite(e.target.value)} name="website"
          className="absolute left-[-9999px] h-0 w-0 opacity-0" aria-hidden="true" />
      </div>

      {/* Sticky summary sidebar (§4.1 price summary) */}
      <aside>
        <div className="lg:sticky lg:top-[88px] space-y-4">
          <AvailabilityCalendar selected={travelDate} onSelect={setTravelDate} tourSlug={tourSlug} />

          <div className="card p-5">
            <h3 className="font-heading text-lg text-brand-green-dark">Price Summary</h3>
            {tour ? (
              <dl className="mt-3 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink/60">Base price / person</dt>
                  <dd>{formatUsd(price.base)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink/60">Adults × {adults}</dt>
                  <dd>{formatUsd(price.adultsCost)}</dd>
                </div>
                {children > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink/60">Children × {children} (50%)</dt>
                    <dd>{formatUsd(price.childrenCost)}</dd>
                  </div>
                )}
                {infants > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-ink/60">Infants × {infants}</dt>
                    <dd>Free</dd>
                  </div>
                )}
                <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
                  <dt>Total</dt>
                  <dd className="text-brand-green">{formatUsd(price.total)}</dd>
                </div>
                <p className="text-right text-xs text-ink/45">{formatEtb(price.total)}</p>
                <div className="mt-1 flex justify-between rounded-lg bg-brand-gold/15 px-3 py-2 text-sm">
                  <dt className="font-medium">Deposit to confirm (30%)</dt>
                  <dd className="font-bold">{formatUsd(price.deposit)}</dd>
                </div>
              </dl>
            ) : (
              <p className="mt-2 text-sm text-ink/50">Select a tour to see pricing.</p>
            )}

            {/* Terms (§4.1) */}
            <label className="mt-4 flex items-start gap-2 text-sm" data-error={!!errors.agree}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-brand-green" />
              <span>
                I have read and agree to the{" "}
                <Link href="/terms" target="_blank" className="text-brand-green underline">Terms &amp; Conditions</Link>{" "}
                and{" "}
                <Link href="/privacy" target="_blank" className="text-brand-green underline">Privacy Policy</Link>.
              </span>
            </label>
            {errors.agree && <p className="mt-1 text-xs text-danger">{errors.agree}</p>}
            {errors.form && <p className="mt-2 text-xs text-danger">{errors.form}</p>}

            <button type="submit" disabled={submitting} className="btn-primary mt-4 w-full text-base disabled:opacity-60">
              {submitting ? (<><Loader2 size={18} className="animate-spin" /> Processing…</>) : "Submit Booking Request"}
            </button>

            <div className="mt-3 flex items-center justify-center gap-3 text-[11px] text-ink/50">
              <span className="inline-flex items-center gap-1"><Lock size={12} /> SSL Secured</span>
              <span className="inline-flex items-center gap-1"><ShieldCheck size={12} /> No payment now</span>
            </div>
            <p className="mt-2 text-center text-[11px] text-ink/45">
              We&apos;ll confirm availability &amp; send a quote within 24 hours. Questions?{" "}
              <a href={company.phoneHref} className="text-brand-green">{company.phone}</a>
            </p>
          </div>
        </div>
      </aside>
    </form>
  );
}
