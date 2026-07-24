import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock, MessageCircle, Zap, AlertTriangle } from "lucide-react";
import { company, waLink } from "@/data/company";
import { faqs, faqCategories } from "@/data/faqs";
import { ContactForm } from "@/components/contact/ContactForm";
import { FaqAccordion } from "@/components/FaqAccordion";
import { SocialLinks } from "@/components/SocialLinks";
import { getTours } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us — Plan Your Ethiopia Trip",
  description:
    "Get in touch with our Ethiopia travel experts by phone, email or WhatsApp. We typically respond within 2 hours during business hours. Office in Addis Ababa.",
  alternates: { canonical: "/contact" },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ tour?: string }>;
}) {
  const { tour } = await searchParams;
  const tours = await getTours();
  const tourOpts = tours.map((t) => ({ slug: t.slug, name: t.name }));
  const mapsEmbed = `https://maps.google.com/maps?q=${company.address.lat},${company.address.lng}&z=15&output=embed`;

  return (
    <div className="pt-[var(--header-h)]">
      <header className="bg-brand-green-dark py-10 text-center text-white">
        <div className="container-page">
          <h1 className="font-heading text-3xl font-bold text-white sm:text-4xl">Get in Touch</h1>
          <p className="mx-auto mt-2 max-w-xl text-white/80">
            Questions about a tour, a custom itinerary, or just want advice? We&apos;re here to help.
          </p>
        </div>
      </header>

      <div className="container-page grid gap-8 py-12 lg:grid-cols-[1fr_1.2fr]">
        {/* Info column */}
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-heading text-xl text-brand-green-dark">Contact Information</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Phone size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <span>
                  <span className="block text-ink/50">Phone</span>
                  <a href={company.phoneHref} className="font-medium hover:text-brand-green">{company.phone}</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MessageCircle size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <span>
                  <span className="block text-ink/50">WhatsApp</span>
                  <a href={waLink("Hello! I'd like to ask about your Ethiopia tours.")} target="_blank"
                    rel="noopener noreferrer" className="font-medium hover:text-brand-green">
                    Chat on WhatsApp ({company.whatsapp})
                  </a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <span>
                  <span className="block text-ink/50">Email</span>
                  <a href={`mailto:${company.email}`} className="font-medium hover:text-brand-green">{company.email}</a>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <span>
                  <span className="block text-ink/50">Office</span>
                  <span className="font-medium">{company.address.line}, {company.address.city}</span>
                  <span className="block text-xs text-ink/55">{company.address.landmark}</span>
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={18} className="mt-0.5 shrink-0 text-brand-green" />
                <span>
                  <span className="block text-ink/50">Office Hours</span>
                  <span className="font-medium">{company.officeHours}</span>
                </span>
              </li>
            </ul>

            <div className="mt-5 flex items-center gap-2 rounded-lg bg-brand-gold/15 px-4 py-3 text-sm">
              <Zap size={16} className="text-brand-gold-dark" />
              <span>We typically respond within <strong>2 hours</strong> during business hours.</span>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-danger/30 bg-danger/5 px-4 py-3 text-sm">
              <AlertTriangle size={16} className="text-danger" />
              <span>On tour &amp; need urgent help? 24/7 line: <a href={`tel:${company.emergencyPhone.replace(/\s/g, "")}`} className="font-semibold text-danger">{company.emergencyPhone}</a></span>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-sm font-semibold text-ink/70">Follow us</p>
              <SocialLinks tone="dark" />
            </div>
          </div>

          {/* Google Maps embed (§6.1 / §8.5) */}
          <div className="card overflow-hidden">
            <iframe
              title={`${company.name} office location on Google Maps`}
              src={mapsEmbed}
              className="h-72 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Form column */}
        <div>
          <ContactForm presetTour={tour} tours={tourOpts} />
        </div>
      </div>

      {/* FAQ (§6.4) */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-3 text-ink/70">
              Quick answers on visas, the best time to visit, health, payments and more.
            </p>
          </div>
          <div className="mx-auto max-w-3xl space-y-8">
            {faqCategories().map((cat) => (
              <div key={cat}>
                <h3 className="mb-3 font-heading text-lg text-brand-green-dark">{cat}</h3>
                <FaqAccordion items={faqs.filter((f) => f.category === cat)} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
