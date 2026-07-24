import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { SearchBar } from "./SearchBar";
import { HeroSlideshow, type HeroSlide } from "./HeroSlideshow";
import { getDestinations } from "@/lib/content";

// §2.1 Hero — full-screen crossfading slideshow of Ethiopia's signature
// destinations (Ken Burns pan/zoom), dark gradient overlay, headline, CTAs.

// Featured destinations. Unsplash sources (verified loading); swap for licensed
// /public assets before production if stricter rights are required.
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=75`;

const HERO_SLIDES: HeroSlide[] = [
  { src: UNSPLASH("1768590284565-e9f67a7c4205"), alt: "Orthodox priest with a candle at the rock-hewn churches of Lalibela" },
  { src: UNSPLASH("1572888195250-3037a59d3578"), alt: "Aerial view of the peaks of the Simien Mountains" },
  { src: UNSPLASH("1516533075015-a3838414c3ca"), alt: "Glowing lava of the Danakil Depression" },
  { src: UNSPLASH("1637588168506-be08391079e4"), alt: "Highland scenery near the royal castles of Gondar" },
  { src: UNSPLASH("1580320209809-a0c51e645872"), alt: "Green highlands of the Bale Mountains" },
  { src: UNSPLASH("1530313292289-fa316f332666"), alt: "Cultures and communities of the Omo Valley" },
  { src: UNSPLASH("1624783136314-ff7dca58a015"), alt: "Boats on Lake Tana" },
];

export async function Hero() {
  const destinations = await getDestinations();
  const destOpts = destinations.map((d) => ({ slug: d.slug, name: d.name }));
  return (
    <section className="relative">
      <div className="relative min-h-[88vh] w-full overflow-hidden">
        {/* §2.1 Crossfading slideshow background with Ken Burns motion. */}
        <HeroSlideshow slides={HERO_SLIDES} />
        {/* §2.1 Text overlay — semi-transparent dark gradient for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/65" />

        <div className="container-page relative flex min-h-[88vh] flex-col items-center justify-center pb-40 pt-[var(--header-h)] text-center">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-semibold text-brand-gold ring-1 ring-white/20 backdrop-blur">
            🇪🇹 Licensed Ethiopian Tour Operator since 2014
          </p>
          <h1 className="max-w-4xl font-heading text-4xl font-bold leading-tight text-white drop-shadow-lg sm:text-5xl lg:text-6xl">
            Discover the Soul of Ethiopia
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-white/90 drop-shadow sm:text-xl">
            Expert-guided tours to Africa&apos;s most ancient civilization — from the rock-hewn
            churches of Lalibela to the peaks of the Simien Mountains.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/tours" className="btn-primary px-7 text-base">
              Explore Our Tours <ArrowRight size={18} />
            </Link>
            <Link href="/gallery" className="btn-outline px-6 text-base">
              <Play size={18} /> See Our Gallery
            </Link>
          </div>
        </div>
      </div>

      {/* §2.2 Search bar overlapping the next section for visual depth */}
      <div className="container-page relative z-10 -mt-28 sm:-mt-24">
        <SearchBar destinations={destOpts} />
      </div>
    </section>
  );
}
