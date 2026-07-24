import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Globe2, HeartHandshake, Star, ShieldCheck, BadgeCheck, MapPin, ExternalLink,
} from "lucide-react";
import { company } from "@/data/company";
import { getGuides } from "@/lib/content";
import { Stars } from "@/components/ui/Stars";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About Us — Our Story & Expert Local Guides",
  description:
    "Meet the licensed Ethiopian tour operator behind your journey. A decade of expert local guides, authentic experiences and 5,000+ happy travellers. Learn our story.",
  alternates: { canonical: "/about" },
};

const values = [
  { icon: Globe2, title: "Sustainable Tourism", text: "We protect the places and ecosystems that make Ethiopia extraordinary." },
  { icon: HeartHandshake, title: "Community Support", text: "Fair pay, local hiring, and genuine partnerships with the communities we visit." },
  { icon: Star, title: "Authentic Experience", text: "Real encounters with people, faith and landscape — never staged, never rushed." },
  { icon: ShieldCheck, title: "Traveler Safety", text: "Vetted transport, experienced crews and round-the-clock support on every tour." },
];

const img = (seed: string, w = 800, h = 600) => `https://picsum.photos/seed/${seed}/${w}/${h}`;

export default async function AboutPage() {
  const guides = await getGuides();
  const stats = [
    { label: "Founded", value: company.foundedYear },
    { label: "Tours Completed", value: `${company.stats.toursCompleted.toLocaleString()}+` },
    { label: "Countries Represented", value: `${company.stats.countriesServed}+` },
    { label: "Licensed Guides", value: company.stats.licensedGuides },
  ];

  return (
    <div className="pt-[var(--header-h)]">
      {/* Hero */}
      <header className="relative">
        <div className="relative h-[42vh] min-h-[300px] w-full overflow-hidden">
          <Image src={img("about-hero", 1920, 900)} alt="Our team guiding travellers through the Ethiopian highlands"
            fill priority sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
          <div className="container-page absolute inset-0 flex flex-col items-center justify-center text-center">
            <h1 className="font-heading text-4xl font-bold text-white sm:text-5xl">About {company.name}</h1>
            <p className="mt-3 max-w-2xl text-white/85">
              Ethiopia, shown to the world by the people who call it home.
            </p>
          </div>
        </div>
      </header>

      {/* Stats bar (§5.1) */}
      <section className="border-b border-black/5 bg-white">
        <div className="container-page grid grid-cols-2 gap-6 py-8 sm:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="font-heading text-3xl font-bold text-brand-green">{s.value}</p>
              <p className="mt-1 text-sm text-ink/60">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Story */}
      <section className="container-page grid items-center gap-10 py-16 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          <Image src={img("about-story", 900, 700)} alt="Our founder with a local guide in Lalibela" fill
            sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        </div>
        <div>
          <p className="text-sm font-bold uppercase tracking-widest text-brand-gold-dark">Our Story</p>
          <h2 className="mt-1 text-3xl font-bold">Born from a love of Ethiopia</h2>
          <div className="mt-4 space-y-4 text-ink/80 leading-relaxed">
            <p>
              {company.name} began in {company.foundedYear} with a simple belief: that Ethiopia —
              the cradle of humankind, an ancient Christian kingdom, a land of staggering landscapes
              — deserved to be shown by the people who know and love it best.
            </p>
            <p>
              Our founder grew up in the shadow of the northern historic route, guiding curious
              visitors through Lalibela&apos;s rock-hewn churches long before it became a career.
              What started as one passionate guide is today a team of {company.stats.licensedGuides}{" "}
              licensed local experts who have welcomed travellers from more than{" "}
              {company.stats.countriesServed} countries.
            </p>
            <p>
              Unlike generic operators, every itinerary we craft is rooted in genuine local
              knowledge, fair partnerships with communities, and an obsessive attention to the
              details that turn a trip into the journey of a lifetime.
            </p>
          </div>
          <Link href="/contact" className="btn-green mt-6">Get in touch</Link>
        </div>
      </section>

      {/* Mission & values (§5.1) */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Our Mission &amp; Values</h2>
            <p className="mt-3 text-ink/70">The principles that shape every journey we create.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10 text-brand-green">
                  <Icon size={24} />
                </span>
                <h3 className="mt-3 font-heading text-lg text-brand-green-dark">{title}</h3>
                <p className="mt-1 text-sm text-ink/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / guides (§5.2) */}
      <section className="container-page py-16">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold">Meet Our Expert Guides</h2>
          <p className="mt-3 text-ink/70">
            Licensed by the Ethiopian Tourism Organization — and passionate about sharing their home.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {guides.map((gd) => (
            <article key={gd.slug} className="card overflow-hidden">
              <div className="relative aspect-square">
                <Image src={gd.image} alt={`${gd.name}, ${gd.title}`} fill
                  sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />
                <span className="badge absolute left-2 top-2 bg-white/90 text-brand-green">
                  <BadgeCheck size={13} /> Licensed Guide
                </span>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-lg text-brand-green-dark">{gd.name}</h3>
                  <Stars rating={gd.rating} size={13} showNumber={false} />
                </div>
                <p className="text-sm text-ink/60">{gd.title}</p>
                <p className="mt-2 text-xs text-ink/70">{gd.bio}</p>
                <div className="mt-3 space-y-1 text-xs text-ink/60">
                  <p><strong>{gd.yearsExperience} yrs</strong> experience</p>
                  <p>Languages: {gd.languages.join(", ")}</p>
                  <p>Specialties: {gd.specialties.join(", ")}</p>
                  <p className="text-brand-green">ETO License: {gd.licenseNumber}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Reviews & trust (§5.3) — embed stubs */}
      <section className="bg-white py-16">
        <div className="container-page">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <h2 className="text-3xl font-bold">Trusted by Travellers Worldwide</h2>
            <p className="mt-3 text-ink/70">Independent reviews from the platforms travellers trust.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Google reviews stub */}
            <div className="card flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-black/5 text-2xl font-bold">G</div>
              <div className="flex-1">
                <p className="font-semibold">Google Reviews</p>
                <Stars rating={company.ratings.googleScore} count={company.ratings.googleReviews} />
                <a href="#" className="mt-1 inline-flex items-center gap-1 text-sm text-brand-green hover:underline">
                  Read on Google <ExternalLink size={13} />
                </a>
              </div>
            </div>
            {/* TripAdvisor stub */}
            <div className="card flex items-center gap-4 p-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#00aa6c]/10 text-2xl font-bold text-[#00aa6c]">T</div>
              <div className="flex-1">
                <p className="font-semibold">TripAdvisor</p>
                <Stars rating={company.ratings.tripadvisorScore} count={company.ratings.tripadvisorReviews} />
                <a href="#" className="mt-1 inline-flex items-center gap-1 text-sm text-brand-green hover:underline">
                  Certificate of Excellence <ExternalLink size={13} />
                </a>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center text-xs text-ink/40">
            (Review widgets are placeholders — connect the official Google &amp; TripAdvisor embeds at launch.)
          </p>
        </div>
      </section>

      {/* Office / legitimacy (§5.1 office photos + license) */}
      <section className="container-page py-16">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold">Come Visit Our Office</h2>
            <p className="mt-3 text-ink/75">
              We&apos;re a real, registered business with a physical office in the heart of Addis
              Ababa. Drop by for a coffee and let&apos;s plan your trip in person.
            </p>
            <p className="mt-4 flex items-start gap-2 text-sm text-ink/70">
              <MapPin size={18} className="mt-0.5 shrink-0 text-brand-green" />
              {company.address.line}, {company.address.city} — {company.address.landmark}
            </p>
            <div className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-green/5 px-4 py-3 text-sm">
              <ShieldCheck className="text-brand-green" size={18} />
              <span>Licensed by the Ethiopian Tourism Organization — <strong>No. {company.etoLicense}</strong></span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["office-1", "office-2", "office-3", "office-4"].map((s) => (
              <div key={s} className="relative aspect-square overflow-hidden rounded-xl">
                <Image src={img(s, 500, 500)} alt="Our Addis Ababa office and team" fill
                  sizes="(max-width: 1024px) 50vw, 25vw" className="object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
