# Ethiopian Tourism Website — Project Overview (Plain English)

A complete tour-operator website **and** booking system for an Ethiopian travel company.
Built with Next.js + React + a Supabase (Postgres) database.

---

## 1. What the website has

**Public site (what visitors see):**
- Home page with hero, search, featured tours, testimonials
- Tours page with filters (destination, price, duration, type), sorting, map
- Tour detail page: photos, day-by-day plan, price table, map, booking button
- Destinations guide pages (Lalibela, Simien, Omo Valley, etc.)
- About page (story, team/guides, trust badges)
- Contact page (form, map, WhatsApp)
- Blog and Photo Gallery
- Works on phones, fast, SEO-ready (Google-friendly)

**Booking system:**
- Booking form → saves to the database
- Sends confirmation email to the customer + alert to the owner
- Availability calendar (owner controls which dates are open)
- Pay the 30% deposit by card (Stripe) or bank transfer

**Admin dashboard (`/admin`, password-protected):**
- See & manage all bookings (change status → auto-emails customer, export to Excel/CSV)
- Read contact messages
- Open/close dates on the availability calendar
- **Edit ALL content without code:** Tours, Destinations, Guides, Reviews, Blog, Gallery
- Upload photos directly from your computer

---

## 2. The tools we use (and why)

| Tool | What it does | Cost |
|------|--------------|------|
| **Next.js / React** | The website framework | Free |
| **Supabase** | Database + photo storage | Free tier |
| **Resend** | Sends the emails | Free tier |
| **Stripe** | Card payments (test mode now) | Free to start |
| **Leaflet maps** | Tour & office maps | Free (no key) |

All settings/keys live in one file called **`.env`** (kept private, never shared).

---

## 3. How to run it on your computer

Open the `ethiopian-tourism` folder in VS Code, open the terminal, then:

```
npm install          # installs everything (run once, or after updates)
npm run db:migrate   # creates the database tables (type "cms" if it asks for a name)
npm run db:seed      # loads the starter tours, photos, blog posts
npm run dev          # starts the site at http://localhost:3000
```

Admin login is at **http://localhost:3000/admin** using the `ADMIN_EMAIL` and
`ADMIN_PASSWORD` you set in `.env`.

**Common fix:** if a command says `EPERM` or "file in use", stop the dev server
(Ctrl+C), then run the command again.

---

## 4. The accounts you set up (free)

1. **Supabase** → the database. Copy `DATABASE_URL` + `DIRECT_URL` into `.env`,
   and create a public storage bucket named **`media`** for photo uploads.
2. **Resend** → email key (`RESEND_API_KEY`). *Free tier only emails your own
   signup address until you verify a domain.*
3. **Stripe** → test keys for card payments.

(Full step-by-step is in **DEPLOYMENT.md** and **README.md**.)

---

## 5. Where things live (folders)

- `app/` — the pages (home, tours, booking, admin, etc.)
- `components/` — reusable building blocks (buttons, cards, forms, maps)
- `data/` — starter content + the company info (name, phone, bank details) in `data/company.ts`
- `lib/` — the "engine" (database, email, content, payments)
- `prisma/` — the database structure + seed data

To change the company name, phone, address, social links, bank details →
edit **`data/company.ts`** once.

---

## 6. Done vs. still to do

**✅ Done**
- Whole public website
- Database + bookings + emails
- Admin dashboard
- Card payments (Stripe, test mode)
- Full content management (edit everything from admin)

**🔲 Next (optional)**
- PayPal + Telebirr/CBE Birr payments
- Put it live on the internet (deploy to Vercel + domain)
- Google Analytics, spam protection (reCAPTCHA)
- Replace placeholder photos/tours with the real business's content
- Amharic language toggle

---

## 7. Important notes

- The current photos and tours are **placeholders** — replace them with real ones via the admin.
- Emails and payments are in **test mode** — switch to live keys when ready for real customers.
- Going live (real domain + HTTPS) is done through **Vercel** — see DEPLOYMENT.md.
- Other docs in this folder: **README.md** (technical), **DEPLOYMENT.md** (going live).
