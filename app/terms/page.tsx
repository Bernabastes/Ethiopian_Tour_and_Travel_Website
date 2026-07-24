import type { Metadata } from "next";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: `Booking terms and conditions for ${company.name}.`,
  alternates: { canonical: "/terms" },
  robots: { index: false },
};

export default function TermsPage() {
  return (
    <div className="pt-[var(--header-h)]">
      <div className="container-page max-w-3xl py-12">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Terms &amp; Conditions</h1>
        <p className="mt-2 text-sm text-ink/50">Placeholder content — replace with your reviewed legal terms before launch.</p>
        <div className="prose mt-6 space-y-4 text-ink/80">
          <h2 className="text-xl font-bold">1. Bookings &amp; Deposits</h2>
          <p>A 30% deposit is required to confirm any booking. The balance is due before the tour start date. Bookings are subject to availability and confirmation by {company.name}.</p>
          <h2 className="text-xl font-bold">2. Cancellations &amp; Refunds</h2>
          <p>Cancellation terms vary by tour and season. In general, cancellations made 30+ days before departure receive a refund of payments less the deposit. Please contact us for the policy applicable to your specific booking.</p>
          <h2 className="text-xl font-bold">3. Travel Insurance</h2>
          <p>Comprehensive travel insurance is strongly recommended (and mandatory for trekking and expedition tours), covering medical care, evacuation, and trip cancellation.</p>
          <h2 className="text-xl font-bold">4. Health &amp; Safety</h2>
          <p>Travellers are responsible for ensuring they have the required vaccinations and are physically able to participate in their chosen tour. Difficulty levels are indicated on each tour page.</p>
          <h2 className="text-xl font-bold">5. Liability</h2>
          <p>{company.legalName} acts as an agent for transport, accommodation and other services and is not liable for circumstances beyond its reasonable control. Full terms will be provided with your booking confirmation.</p>
          <p className="text-sm text-ink/50">ETO License No. {company.etoLicense}.</p>
        </div>
      </div>
    </div>
  );
}
