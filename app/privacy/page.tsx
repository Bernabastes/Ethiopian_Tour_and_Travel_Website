import type { Metadata } from "next";
import { company } from "@/data/company";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${company.name} collects and uses your personal data.`,
  alternates: { canonical: "/privacy" },
  robots: { index: false },
};

export default function PrivacyPage() {
  return (
    <div className="pt-[var(--header-h)]">
      <div className="container-page max-w-3xl py-12">
        <h1 className="font-heading text-3xl font-bold sm:text-4xl">Privacy Policy</h1>
        <p className="mt-2 text-sm text-ink/50">Placeholder content — replace with your reviewed privacy policy before launch.</p>
        <div className="prose mt-6 space-y-4 text-ink/80">
          <h2 className="text-xl font-bold">What We Collect</h2>
          <p>When you make a booking or contact us, we collect the details you provide — such as your name, email, phone number, country and travel preferences — solely to respond to your enquiry and manage your trip.</p>
          <h2 className="text-xl font-bold">How We Use It</h2>
          <p>We use your information to process bookings, communicate about your tour, and (only with your consent) send occasional travel offers. We never sell your data.</p>
          <h2 className="text-xl font-bold">Your Rights</h2>
          <p>You may request access to, correction of, or deletion of your personal data at any time by emailing <a href={`mailto:${company.email}`} className="text-brand-green underline">{company.email}</a>. You can unsubscribe from marketing at any time.</p>
          <h2 className="text-xl font-bold">Cookies</h2>
          <p>We use essential cookies to run the site and, where enabled, analytics cookies to understand how visitors use it. EU visitors will be asked for consent.</p>
        </div>
      </div>
    </div>
  );
}
