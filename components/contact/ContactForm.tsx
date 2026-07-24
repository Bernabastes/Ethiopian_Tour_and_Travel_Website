"use client";

import { useState } from "react";
import { Loader2, CheckCircle2 } from "lucide-react";
import { company, waLink } from "@/data/company";

const SUBJECTS = [
  "Tour Inquiry",
  "Custom Tour Request",
  "Booking Question",
  "Payment Issue",
  "General Question",
  "Partnership / Media",
  "Other",
];

export function ContactForm({
  presetTour,
  tours,
}: {
  presetTour?: string;
  tours: { slug: string; name: string }[];
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [tour, setTour] = useState(presetTour ?? "");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Please enter a valid email.";
    if (!subject) e.subject = "Please choose a subject.";
    if (message.trim().length < 10) e.message = "Please enter at least 10 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (website) return; // honeypot
    if (!validate()) return;
    setSubmitting(true);
    try {
      await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, subject, tour, message }),
      });
      setSent(true);
    } catch {
      setErrors({ form: "Something went wrong. Please try again or reach us on WhatsApp." });
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div className="card p-8 text-center">
        <CheckCircle2 size={48} className="mx-auto text-brand-green" />
        <h3 className="mt-3 text-xl font-bold">Message sent!</h3>
        <p className="mt-2 text-sm text-ink/70">
          Thanks {name.split(" ")[0]} — we&apos;ll reply to <strong>{email}</strong> within 24 hours.
        </p>
        <a href={waLink("Hello! I just sent a message via your website.")} target="_blank"
          rel="noopener noreferrer" className="btn-green mt-5">
          Chat with us on WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="card space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="c-name">Your Full Name *</label>
          <input id="c-name" className={`input ${errors.name ? "input-error" : ""}`}
            value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Traveller" />
          {errors.name && <p className="mt-1 text-xs text-danger">{errors.name}</p>}
        </div>
        <div>
          <label className="label" htmlFor="c-email">Email *</label>
          <input id="c-email" type="email" className={`input ${errors.email ? "input-error" : ""}`}
            value={email} onChange={(e) => setEmail(e.target.value)} placeholder="your@email.com" />
          {errors.email && <p className="mt-1 text-xs text-danger">{errors.email}</p>}
        </div>
        <div>
          <label className="label" htmlFor="c-phone">Phone / WhatsApp (optional)</label>
          <input id="c-phone" className="input" value={phone}
            onChange={(e) => setPhone(e.target.value)} placeholder="+251 9XX XXX XXX" />
        </div>
        <div>
          <label className="label" htmlFor="c-subject">Subject *</label>
          <select id="c-subject" className={`input ${errors.subject ? "input-error" : ""}`}
            value={subject} onChange={(e) => setSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          {errors.subject && <p className="mt-1 text-xs text-danger">{errors.subject}</p>}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="c-tour">Which tour are you interested in? (optional)</label>
        <select id="c-tour" className="input" value={tour} onChange={(e) => setTour(e.target.value)}>
          <option value="">No specific tour</option>
          {tours.map((t) => <option key={t.slug} value={t.name}>{t.name}</option>)}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="c-message">Message *</label>
        <textarea id="c-message" rows={5} maxLength={1000}
          className={`input resize-y ${errors.message ? "input-error" : ""}`}
          value={message} onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your travel plans, questions, or anything we can help with." />
        <p className="mt-1 text-right text-xs text-ink/40">{message.length}/1000</p>
        {errors.message && <p className="text-xs text-danger">{errors.message}</p>}
      </div>

      {/* Honeypot */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true"
        value={website} onChange={(e) => setWebsite(e.target.value)}
        className="absolute left-[-9999px] h-0 w-0 opacity-0" />

      {errors.form && <p className="text-sm text-danger">{errors.form}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full text-base disabled:opacity-60">
        {submitting ? (<><Loader2 size={18} className="animate-spin" /> Sending…</>) : "Send Message"}
      </button>
      <p className="text-center text-xs text-ink/50">
        Protected against spam. Prefer to chat? Message us on{" "}
        <a href={waLink("Hello! I have a question about your Ethiopia tours.")} target="_blank"
          rel="noopener noreferrer" className="text-brand-green underline">WhatsApp</a>{" "}
        ({company.whatsapp}).
      </p>
    </form>
  );
}
