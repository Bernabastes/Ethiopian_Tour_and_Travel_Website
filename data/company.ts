// Single source of truth for company identity, contact (NAP), socials, and bank details.
// Change these placeholder values once to update the entire site.

export const company = {
  name: "Habesha Heritage Tours",
  tagline: "Expert-guided tours to Africa's most ancient civilization",
  legalName: "Habesha Heritage Tours PLC",
  foundedYear: 2014,
  // Site URL used for canonical + sitemap + Open Graph.
  // Reads NEXT_PUBLIC_SITE_URL in production (set it in Vercel); falls back for local dev.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "https://www.habeshaheritagetours.com",

  // Contact / NAP (§6.1)
  phone: "+251 91 234 5678",
  phoneHref: "tel:+251912345678",
  whatsapp: "+251912345678", // E.164, no symbols — used in wa.me links
  emergencyPhone: "+251 92 000 0000",
  email: "info@habeshaheritagetours.com",
  salesEmail: "sales@habeshaheritagetours.com",
  accountsEmail: "accounts@habeshaheritagetours.com",
  address: {
    line: "Bole Road, Friendship Building, 4th Floor",
    city: "Addis Ababa",
    country: "Ethiopia",
    landmark: "Near Friendship Park, opposite Bole Medhanialem",
    lat: 9.0108,
    lng: 38.7613,
  },
  officeHours: "Monday–Saturday, 8:00 AM – 6:00 PM EAT",

  // Trust / licensing (§5)
  etoLicense: "ETO-TO-2014-0421",
  stats: {
    toursCompleted: 1200,
    countriesServed: 42,
    licensedGuides: 18,
    happyClients: 5000,
    yearsExperience: new Date().getFullYear() - 2014,
  },
  ratings: {
    googleScore: 4.9,
    googleReviews: 127,
    tripadvisorScore: 4.8,
    tripadvisorReviews: 96,
  },

  // Socials (§8.3)
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    tiktok: "https://tiktok.com/",
    youtube: "https://youtube.com/",
    twitter: "https://x.com/",
  },

  // Bank transfer details (§4.4 MUST) — replace with real account before launch.
  bank: {
    bankName: "Commercial Bank of Ethiopia",
    accountName: "Habesha Heritage Tours PLC",
    accountNumber: "1000 1234 5678 90",
    swift: "CBETETAA",
    branch: "Bole Branch, Addis Ababa",
  },
} as const;

// Approximate USD→ETB rate for secondary price display (§2.3). Display-only.
export const ETB_PER_USD = 132;

export const usdToEtb = (usd: number) => Math.round(usd * ETB_PER_USD);

export function waLink(message: string) {
  return `https://wa.me/${company.whatsapp}?text=${encodeURIComponent(message)}`;
}
