import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import "leaflet/dist/leaflet.css";
import { Chrome } from "@/components/Chrome";
import { JsonLd } from "@/components/JsonLd";
import { company } from "@/data/company";
import { getFeaturedTours, getDestinations } from "@/lib/content";

const businessSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: company.name,
  description: company.tagline,
  url: company.url,
  telephone: company.phone,
  email: company.email,
  image: `${company.url}/og-default.svg`,
  address: {
    "@type": "PostalAddress",
    streetAddress: company.address.line,
    addressLocality: company.address.city,
    addressCountry: "ET",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: company.address.lat,
    longitude: company.address.lng,
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: company.ratings.googleScore,
    reviewCount: company.ratings.googleReviews,
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(company.url),
  title: {
    default: `${company.name} | Expert-Guided Ethiopia Tours & Packages`,
    template: `%s | ${company.name}`,
  },
  description:
    "Discover the soul of Ethiopia with expert local guides. Tailor-made tours to Lalibela, the Simien Mountains, the Omo Valley, Danakil and more. Book your adventure today.",
  keywords: [
    "Ethiopia tours",
    "Lalibela tours",
    "Simien Mountains trekking",
    "Omo Valley",
    "Danakil Depression",
    "Ethiopian tour operator",
  ],
  openGraph: {
    type: "website",
    siteName: company.name,
    title: `${company.name} | Expert-Guided Ethiopia Tours`,
    description:
      "Expert-guided tours to Africa's most ancient civilization. Lalibela, Simien Mountains, Omo Valley and beyond.",
    images: ["/og-default.svg"],
  },
  twitter: {
    card: "summary_large_image",
  },
  alternates: {
    canonical: "/",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Footer link data, resolved from the DB (with static fallback) and forwarded
  // through Chrome so the footer reflects admin-managed content.
  const [featured, destinations] = await Promise.all([
    getFeaturedTours(),
    getDestinations(),
  ]);
  const popularTours = featured.slice(0, 5).map((t) => ({ slug: t.slug, name: t.name }));
  const topDestinations = destinations.slice(0, 6).map((d) => ({ slug: d.slug, name: d.name }));

  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <JsonLd data={businessSchema} />
        <Chrome popularTours={popularTours} topDestinations={topDestinations}>
          {children}
        </Chrome>
      </body>
    </html>
  );
}
