# Gokarna Puja Booking

Production-ready marketing and booking site for **Gokarna Puja Booking**: devotional visual design, step-based booking with Razorpay (India), Resend email notifications, SQLite + Prisma for local development (Postgres-ready), and a password-protected admin panel.

## Quick start

Prerequisite: **Node.js 18.18+** (recommended Node 20/22).

```bash
cd gokarna-puja-booking
cp .env.example .env
# Edit .env — set ADMIN_PASSWORD and SESSION_SECRET at minimum

npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Admin: [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

## Environment variables

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | SQLite locally: `file:./dev.db` (path relative to `prisma/schema.prisma`). For Postgres, replace with your connection string. |
| `ADMIN_PASSWORD` | Single admin login password (plain text comparison with timing-safe equality). |
| `SESSION_SECRET` | At least 32 characters recommended; signs the admin JWT cookie. |
| `RESEND_API_KEY` | Email delivery via [Resend](https://resend.com). If unset, emails are logged only. |
| `RESEND_FROM_EMAIL` | Verified sender, e.g. `Gokarna Puja <booking@yourdomain.com>`. |
| `OWNER_NOTIFY_EMAIL` | Receives booking and contact form notifications. |
| `RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET` | Server-side Razorpay keys. |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Same as key id for Checkout (browser). If unset, falls back to `RAZORPAY_KEY_ID`. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Digits only, country included (e.g. `919876543210`). |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for emails and sitemap (e.g. `https://yourdomain.com`). |
| `NEXT_PUBLIC_MAP_EMBED_URL` | Google Maps embed `src` URL for the contact page. |
| `WHATSAPP_API_TOKEN` / `WHATSAPP_PHONE_NUMBER_ID` | Optional Meta WhatsApp Cloud API; if unset, only click-to-chat links are used. |

## Database & Postgres

- **SQLite (default):** `DATABASE_URL="file:./dev.db"` in `.env`.
- **Postgres:** change `datasource` in `prisma/schema.prisma` to `provider = "postgresql"` and set `DATABASE_URL` to your Postgres URL, then run `npx prisma db push` (or `migrate dev`).

## Booking & payments

1. Customer completes the stepper on `/book`.
   - Step 2 is a **calendar availability view** (available, blocked, fully-booked, unavailable).
   - Dates that are blocked / full / unavailable are visually disabled.
   - Time slots are shown only after an available date is selected.
2. Booking is stored with status **Payment Pending** and `paymentStatus` **pending**.
3. If Razorpay keys are set, Checkout opens; on success, `/api/payments/verify` verifies the signature and sets **Confirmed** / **paid**.
4. If Razorpay is **not** configured, the UI shows **Test mode** and the booking stays **Payment Pending** (UPI / pay later).

Emails: confirmation to the customer (if email provided) and to the owner when Resend is configured. WhatsApp: always a **wa.me** deep link with prefilled text; optional Cloud API send does not block booking.

## Admin panel

- **Login:** `/admin` redirects as needed; primary entry is `/admin/login` with `ADMIN_PASSWORD`.
- **Bookings:** filter, change status (`Payment Pending`, `Confirmed`, `Completed`, `Cancelled`), update payment state.
- **Availability (drag-friendly board):** manage the **weekly template** as seven columns; **drag a weekly slot** onto another weekday to move it; block/unblock **whole dates**; add **per-day overrides** (capacity, per-slot block, day block). When overrides exist for a date, only those rows apply for that date (weekly template is ignored for that date).
- **Pujas:** add/edit pujas (including **Pitri Karya vs Puja Karya**), translations, and per-puja images (cover + ordering).
- **Media:** upload/reorder/delete **general gallery** images used on `/gallery`.

## Languages (i18n)

Supported locales: **English (default), Hindi, Telugu, Tamil, Kannada**.

- **Switcher:** header on public pages and admin; choice is stored in a cookie via `POST /api/language` and the page reloads so server-rendered content stays consistent.
- **UI strings:** `lib/i18n/messages.ts` (nested keys). Shared resolver: `lib/i18n/translate.ts` (used by the client provider and `getServerI18n()` for RSC pages).
- **Puja-specific copy (name, descriptions, popup story, requirements-style fields, benefits, etc.):** stored per locale in Prisma `PujaTranslation`, editable in **Admin → Puja → Translations**. Seeding creates rows for every locale; English is the authoring baseline.

## Content & config

- **Site copy & contact placeholders:** `content/site.config.ts`
- **Default puja narratives (significance, story, etc.):** `content/pujas.data.ts`
- **DB pujas:** seeded from `pujas.data.ts`; admin edits sync to Prisma.

## Images, uploads, and gallery

### Admin uploads (preferred)

- **General gallery:** Admin → **Media** uploads to `public/uploads/gallery/…` and records rows in `MediaAsset` (`GENERAL`). `/gallery` prefers these rows.
- **Per-puja images:** Admin → **Puja** editor: upload, **drag reorder**, **set cover**, delete. Stored under `public/uploads/pujas/<slug>/…` with `MediaAsset` rows (`PUJA`). Cards, detail pages, and the booking popup use the cover / gallery when present.

**Storage note:** `lib/media-storage.ts` encapsulates local disk writes (dev-friendly) so you can later swap the implementation for S3/R2 without changing UI code.

### Legacy manifests (optional)

If you are not using admin uploads yet, image lists can still be driven by JSON manifests:

- `content/gallery.manifest.json` — filenames under `public/gallery/`
- `content/pujas.manifest.json` — map of `slug` → filenames under `public/pujas/<slug>/`

```bash
npm run manifests
```

**Owner photo:** add `public/owner/owner.jpg`. If missing, the About section shows a gentle **ॐ** placeholder.

### Attribution policy for bundled/demo photography

Do **not** hotlink or scrape third-party sites. For demo or marketing imagery, use your own uploads, **royalty-free** sources (Unsplash/Pexels/Wikimedia) with license-compliant use, or simple SVG/gradient placeholders. If you ship example photos from a stock provider, keep attribution notes in this README under a short **Credits** subsection.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Next.js dev server (Turbopack) |
| `npm run build` | Prisma generate + production build |
| `npm run start` | Start production server |
| `npm run db:push` | Push schema to the database |
| `npm run db:seed` | Seed pujas + default weekly slots |
| `npm run db:studio` | Prisma Studio |
| `npm run manifests` | Regenerate gallery / puja image manifests |

## Stack

Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion, Prisma + SQLite, Zod + React Hook Form, cookie-backed i18n (`lib/i18n`), Resend, Razorpay Checkout, Sonner toasts.

## Accessibility & SEO

Skip link, focus styles, ARIA on key widgets, `metadata` + OpenGraph in root layout, `sitemap.ts` and `robots.ts`.

---

Offered with care for families travelling to Gokarna. Update `content/site.config.ts` with your brother’s name, phone, and final address before going live.
