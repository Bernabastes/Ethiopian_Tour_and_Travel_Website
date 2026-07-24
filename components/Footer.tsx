import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { company } from "@/data/company";
import { SocialLinks } from "./SocialLinks";

type FooterLink = { slug: string; name: string };

export function Footer({
  popularTours = [],
  topDestinations = [],
  linkPrefetch = true,
}: {
  // DB-backed link lists, resolved in the root layout and passed through Chrome.
  popularTours?: FooterLink[];
  topDestinations?: FooterLink[];
  linkPrefetch?: boolean;
}) {

  return (
    <footer className="mt-20 bg-brand-green-dark text-white/80">
      <div className="container-page grid grid-cols-2 gap-8 py-14 md:grid-cols-4 lg:grid-cols-5">
        <div className="col-span-2 lg:col-span-1">
          <Image
            src="/logo-light.svg"
            alt="Habesha Heritage Tours"
            width={200}
            height={43}
            className="h-10 w-auto"
          />
          <p className="mt-4 text-sm leading-relaxed text-white/70">{company.tagline}.</p>
          <p className="mt-4 text-xs text-white/50">
            ETO License No. <span className="font-semibold text-brand-gold">{company.etoLicense}</span>
          </p>
          <SocialLinks className="mt-5" tone="light" />
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            {[
              ["/tours", "Tours & Packages"],
              ["/destinations", "Destinations"],
              ["/about", "About Us"],
              ["/gallery", "Gallery"],
              ["/blog", "Blog"],
              ["/contact", "Contact"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} prefetch={linkPrefetch} className="hover:text-brand-gold">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Popular Tours</h3>
          <ul className="space-y-2 text-sm">
            {popularTours.map((t) => (
              <li key={t.slug}>
                <Link href={`/tours/${t.slug}`} prefetch={linkPrefetch} className="hover:text-brand-gold">
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Destinations</h3>
          <ul className="space-y-2 text-sm">
            {topDestinations.map((d) => (
              <li key={d.slug}>
                <Link href={`/destinations/${d.slug}`} prefetch={linkPrefetch} className="hover:text-brand-gold">
                  {d.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">Contact Info</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <MapPin size={16} className="mt-0.5 shrink-0 text-brand-gold" />
              <span>
                {company.address.line}, {company.address.city}, {company.address.country}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={16} className="shrink-0 text-brand-gold" />
              <a href={company.phoneHref} className="hover:text-brand-gold">
                {company.phone}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Mail size={16} className="shrink-0 text-brand-gold" />
              <a href={`mailto:${company.email}`} className="hover:text-brand-gold">
                {company.email}
              </a>
            </li>
            <li className="flex items-start gap-2">
              <Clock size={16} className="mt-0.5 shrink-0 text-brand-gold" />
              <span>{company.officeHours}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </p>
          <p className="flex gap-4">
            <Link href="/terms" prefetch={linkPrefetch} className="hover:text-brand-gold">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" prefetch={linkPrefetch} className="hover:text-brand-gold">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
