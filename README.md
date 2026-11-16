# Forno & Fiamma

A Next.js App Router rebuild of the Forno & Fiamma restaurant website. The former Vite/Base44 export has been replaced with a self-contained application.

## What is included

The public site preserves the restaurant story, menu imagery, typography, navigation, and dark ember visual system while adding a persistent cart drawer, quantity controls, pickup/delivery selection, validated WhatsApp order handoff, client footprint capture, and lead enquiry form.

The operational layer includes `/api/menu`, `/api/orders`, `/api/leads`, and `/api/footprint`, plus protected admin APIs for overview data and menu management. The superadmin interface lives at `/admin`, with `/admin/signup` for the first account and `/admin/login` for later access.

## Run locally

1. Copy `.env.example` to `.env.local` and set `DATABASE_URL`, `AUTH_SECRET`, `PASSWORD_SALT`, and `SESSION_COOKIE_SECURE=false` for plain `http://localhost` development.
2. Install dependencies with `npm install`.
3. Provision the schema with `npm run db:push` and seed the menu with `npm run db:seed` when a MySQL connection is available.
4. Start the app with `npm run dev`, then visit `/admin/signup` to create the first superadmin account.

If no database URL is available, the public menu and the API routes use an in-process fallback so the interface can still be previewed. Production should always use a managed MySQL database for durable orders, leads, footprint data, menu changes, and admin accounts.

## Vercel

Import this repository into Vercel as a Next.js project. Add the variables from `.env.example` in the project settings, use a managed MySQL provider such as PlanetScale or Railway, run `npx prisma db push` against the production database, and run `npm run db:seed` once. The default Vercel build command is `npm run build`.

## API summary

- `GET /api/menu` — active menu records.
- `POST /api/orders` — validates items and customer details, persists the order, and returns a WhatsApp URL.
- `POST /api/leads` — validates and stores customer enquiries.
- `POST /api/footprint` — stores privacy-light visit and interaction events.
- `POST /api/auth/signup`, `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` — signed superadmin sessions.
- `GET /api/admin/overview`, `GET|POST /api/admin/menu` — protected operations data and menu management.
