# Habesha Heritage Tours — Ethiopian Tourism Website

Phase 1 build of the Ethiopian tour operator website, implementing every **MUST-HAVE**
requirement from the specification across all 8 sections, plus selected SHOULD items.

Built with **Next.js (App Router) + React + TypeScript + Tailwind CSS**. Runs entirely on
mock data with no external API keys required.

## Quick start (frontend only)

```bash
npm install
npm run dev      # http://localhost:3000
```

The public site runs with **no configuration** — forms log to the console and the admin
dashboard shows a "connect your database" notice until you set up the backend below.

## Quick start (full-stack backend)

1. `cp .env.example .env` and fill in at least `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET`,
   `ADMIN_EMAIL`, `ADMIN_PASSWORD` (see **Setup → Supabase** below).
2. Create the tables, generate the client, and load data + the admin user:
   ```bash
   npm install
   npm run db:migrate      # creates tables in Supabase
   npm run db:seed         # loads tours/destinations/guides/reviews + admin login
   npm run dev
   ```
3. Visit **/admin/login** and sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`.

Other scripts: `npm run build`, `npm run start`, `npm run lint`, `npm run db:studio`
(visual DB browser), `npm run db:reset` (wipe + re-migrate + re-seed).

## Setup → accounts you create (all free)

| Service | Why | What to put in `.env` |
|--------|-----|-----------------------|
| **Supabase** | Postgres database | `DATABASE_URL` (pooler :6543) + `DIRECT_URL` (:5432) from Project Settings → Database → Connection string |
| **Resend** | Sends booking/contact emails | `RESEND_API_KEY` (optional — logs to console without it) |
| **Stripe** | Card deposit payments (test mode) | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |

`NEXTAUTH_SECRET` can be any long random string (e.g. `npx auth secret`).

## What's included (Phase 1)

| Section | Pages / Features |
|--------|------------------|
| 1 — Design system | Mobile-first responsive layout, sticky frosted nav with active state + hamburger, footer columns, brand palette, Playfair/Inter fonts, SVG logo + favicon, image lazy-loading, cache headers |
| 2 — Homepage | Hero + overlay + CTAs, search bar, featured tours, destinations preview, why-choose-us, testimonials carousel, trust signal |
| 3 — Tours | Listing with instant filters (destination, duration, price dual-slider, type, group size), sort, grid/list toggle, pagination, active-filter tags, mobile filter modal. Detail page: gallery + lightbox, sticky booking sidebar, day-by-day accordion, inclusions/exclusions, Leaflet route map, group pricing table, FAQ, related tours |
| 4 — Booking | Full booking form (all §4.1 fields), availability calendar, live price summary (30% deposit, 50% child), terms gate, success state, bank-transfer details + payment security display |
| 5 — About/Trust | Company story, stats bar, mission & values, licensed guide cards (ETO license), Google/TripAdvisor review widgets, office section |
| 6 — Contact | Info block (phone/WhatsApp/email/address/hours), Google Maps embed, social links, emergency contact, contact form (subject + honeypot + success), grouped FAQ, floating WhatsApp button |
| 7 — Content | Destination guide pages (12), Gallery + Blog placeholder pages (full versions = Phase 2) |
| 8 — SEO/Tech | Per-page meta titles/descriptions, clean slug URLs, single-H1 hierarchy, image alt text, `sitemap.xml`, `robots.txt`, Open Graph, JSON-LD (TravelAgency + TouristTrip) |

## Backend architecture (Phase 2)

- **Database:** Postgres (Supabase) via **Prisma** — `prisma/schema.prisma`. Models: Tour,
  Destination, Guide, Review, **Booking**, **ContactMessage**, **Availability**, **AdminUser**.
- **Bookings** (`app/api/booking/route.ts`) persist to the DB and trigger a customer confirmation
  + owner notification email. Resilient: still returns success if the DB/email aren't configured.
- **Contacts** (`app/api/contact/route.ts`) persist and route emails by subject (§6.2).
- **Email:** Resend (`lib/email.ts`) — falls back to console logging without `RESEND_API_KEY`.
- **Admin** (`/admin`, protected by `middleware.ts` + NextAuth credentials): dashboard with live
  stats, bookings table (status control → auto-emails customer, CSV export), messages inbox,
  and an availability calendar the owner can edit (feeds the public booking calendar).
- **Payments:** **Stripe** deposit checkout is wired (`/api/payment/stripe` + webhook). Bank
  transfer is live. PayPal + Telebirr/CBE are the next step (Phase 2B).

## Content CMS (admin-editable)

All content is editable from `/admin` and saved to the database — the public site reads it via
the repository in `lib/content.ts` (which falls back to `data/*.ts` when no DB is configured):

- **Tours** — full structured editor (itinerary days, pricing tiers, route stops, highlights,
  inclusions, photo uploads, destinations).
- **Destinations**, **Guides**, **Reviews** (moderation), **Blog** (write/publish with SEO),
  **Gallery** (upload + categorise).
- **Images** upload to **Supabase Storage** (`media` bucket) via `/api/admin/upload`; paste-URL
  also supported. Set `NEXT_PUBLIC_SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` and create a public
  `media` bucket.
- Existing seed content is preserved; re-seeding never overwrites edits.

## Still stubbed / next up

- **PayPal & Telebirr/CBE** payment methods (Stripe is done).
- **Anti-spam** — forms use a honeypot; add reCAPTCHA v3 verification in the API routes.
- **Reviews widgets** — Google/TripAdvisor badges on `/about` are placeholders (on-site reviews
  are fully managed in the admin).
- **Analytics** — GA4 / Search Console / Pixel not yet added.
- **Maps** — free **Leaflet + OpenStreetMap** (no key); contact office uses a Google Maps embed.

## Customising

- **Company identity, contact, socials, bank details:** edit `data/company.ts` (single source).
- **Tours / destinations / guides / reviews / FAQs:** edit the files in `data/`.
- **Images:** currently placeholder photos from picsum.photos (configured in `next.config.mjs`).
  Replace with real licensed Ethiopian photography and update the hosts/paths.
- **Brand colors / fonts:** `tailwind.config.ts` and `app/layout.tsx`.

## Project structure

```
app/        routes (App Router) + api stubs + robots/sitemap
components/  UI: header/footer, tour cards, filters, gallery, booking, maps, etc.
data/        mock data + domain types (single source of truth)
lib/         formatting, filtering, country list helpers
public/      logos, favicon, OG image
```

## Notes

- HTTPS is a deployment concern (e.g. Vercel/Netlify provide it automatically); the spec's SSL
  requirement is satisfied at hosting.
- Deferred to Phase 2 (mostly SHOULD/NICE): full blog/CMS, full gallery (masonry/360°), Amharic
  i18n toggle, live payments, WhatsApp Business API sends, live chat, newsletter, analytics,
  animated stat counters, custom tour builder, admin dashboard.
