# Deploying Habesha Heritage Tours to Vercel

This app is a Next.js + Prisma + Postgres (Supabase) project. The recommended host is
**Vercel** (free Hobby tier), deploying from a **GitHub** repo. Total time ≈ 20–30 min.

---

## 0. Prerequisites
- A **GitHub** account — https://github.com
- A **Vercel** account — https://vercel.com (sign in with GitHub)
- Your **Supabase** project already created (from the backend setup)
- (Optional) **Resend** + **Stripe** accounts for email & payments

---

## 1. Put the code on GitHub

Easiest from VS Code:
1. Open the `ethiopian-tourism` folder in VS Code.
2. **Source Control** panel (left sidebar, branch icon) → **Initialize Repository**.
3. Type a commit message ("Initial commit") → **Commit**.
4. Click **Publish Branch** → choose **Private** repository → name it `habesha-tours`.

(Or with the terminal:)
```bash
git init
git add .
git commit -m "Initial commit"
gh repo create habesha-tours --private --source=. --push   # needs GitHub CLI
```

> `.env` is git-ignored, so your secrets are NOT uploaded. Good.

---

## 2. Import into Vercel
1. Go to https://vercel.com/new
2. **Import** your `habesha-tours` GitHub repo.
3. Framework preset: **Next.js** (auto-detected). Leave build settings as-is.
4. **Before clicking Deploy**, open **Environment Variables** and add the ones below.

---

## 3. Environment variables to add in Vercel

Add each as **Name → Value** (these are encrypted by Vercel). Use the SAME Supabase project
you set up locally, so your tables/data are already there.

| Name | Value | Notes |
|------|-------|-------|
| `DATABASE_URL` | Supabase **pooler** URI (port `6543`, ends with `?pgbouncer=true`) | Required |
| `DIRECT_URL` | Supabase **direct** URI (port `5432`) | Required (migrations) |
| `NEXTAUTH_SECRET` | a long random string | Required — run `npx auth secret` to generate |
| `NEXTAUTH_URL` | `https://YOUR-PROJECT.vercel.app` | Set after first deploy gives you the URL (see step 5) |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` | Same URL |
| `ADMIN_EMAIL` | your admin email | For the owner login |
| `ADMIN_PASSWORD` | a strong password | For the owner login |
| `RESEND_API_KEY` | from resend.com | Optional (emails log to console without it) |
| `EMAIL_FROM` | `Habesha Heritage Tours <noreply@yourdomain>` | Optional |
| `ADMIN_NOTIFY_EMAILS` | inbox(es) for booking alerts | Optional |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Optional (card payments) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Optional |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Set after step 6 |

Then click **Deploy**.

---

## 4. Create the database tables (once)

The build runs `prisma generate`, but the tables must exist in Supabase. If you already ran
`npm run db:migrate` + `npm run db:seed` locally against this Supabase project, **you're done** —
the data is already there.

If not, run once from your machine (with the production `.env` values):
```bash
npm run db:deploy   # applies migrations to Supabase
npm run db:seed     # loads tours + admin user
```

---

## 5. Point the app at its real URL
1. After the first deploy, Vercel shows your URL, e.g. `https://habesha-tours.vercel.app`.
2. In Vercel → **Settings → Environment Variables**, set `NEXTAUTH_URL` and
   `NEXT_PUBLIC_SITE_URL` to that exact URL.
3. **Redeploy** (Deployments → ⋯ → Redeploy) so the change takes effect.

---

## 6. Stripe webhook (only if using card payments)
1. Stripe Dashboard (test mode) → **Developers → Webhooks → Add endpoint**.
2. Endpoint URL: `https://YOUR-PROJECT.vercel.app/api/payment/stripe/webhook`
3. Event to send: `checkout.session.completed`
4. Copy the **Signing secret** (`whsec_...`) → add as `STRIPE_WEBHOOK_SECRET` in Vercel → redeploy.

---

## 7. Custom domain (optional)
1. Buy a domain (Namecheap, Google Domains, etc.) — e.g. `habeshaheritagetours.com`.
2. Vercel → **Settings → Domains → Add** → follow the DNS instructions.
3. Vercel provisions HTTPS/SSL automatically. Update `NEXTAUTH_URL` + `NEXT_PUBLIC_SITE_URL`
   to the custom domain and redeploy.

---

## Going from test → live (payments)
When the business is ready for real money: swap the Stripe **test** keys for **live** keys in
Vercel, create a **live-mode** webhook, and update `STRIPE_WEBHOOK_SECRET`. Nothing else changes.

## Notes
- **Connection pooling:** on serverless (Vercel) always use the Supabase **pooler** URL for
  `DATABASE_URL` (port 6543, `?pgbouncer=true`). Migrations use `DIRECT_URL` (5432).
- The public site reads tour/destination content from `data/*.ts`, so it renders even if the DB
  is briefly unavailable. Only bookings/contacts/admin need the database.
- Every push to your GitHub `main` branch auto-deploys to Vercel.
