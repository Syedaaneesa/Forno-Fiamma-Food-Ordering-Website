# Forno & Fiamma — Next.js migration plan

## Product scope

Migrate the uploaded Base44 restaurant landing page into a self-contained Next.js App Router website with the existing Forno & Fiamma content, responsive layouts, cart ordering, WhatsApp order handoff, real API routes, footprint tracking, lead capture, and a protected superadmin dashboard.

## Implementation approach

- Replace Vite, React Router, Base44 SDK, Base44 Vite plugin, and Base44 authentication with Next.js App Router, server route handlers, signed HTTP-only sessions, and a Prisma data model.
- Keep the existing Playfair Display + Inter typography and charcoal/ember visual system, but improve hierarchy, responsive spacing, order affordances, and operational surfaces.
- Store menu, administrators, orders, footprint events, and leads in Prisma-backed tables. Use a safe read fallback for the public menu so the site can render before a deployment database is provisioned; production writes require `DATABASE_URL`.
- Use a server-side `/api/orders` route to validate cart and customer details, persist the order, and return a WhatsApp deeplink containing a formatted order summary. The browser opens WhatsApp only after the server accepts the order.
- Track privacy-light client footprint events through `/api/footprint` and lead form submissions through `/api/leads`.
- Protect `/admin` with a signed cookie session and role checks. Admin screens expose overview metrics, recent orders, leads, footprint events, and menu management.
- Keep environment variables documented in `.env.example`, include `vercel.json`, and use Next's default build/start contract.

## Project structure

- `app/` — App Router pages, route handlers, global styling, and layout metadata.
- `components/` — client-facing restaurant UI, cart drawer, forms, and admin panels.
- `lib/` — menu seed data, validation, Prisma client, sessions, and request helpers.
- `prisma/` — production schema and seed script.
- `public/images/` — locally copied restaurant imagery from the supplied export.

## Design direction

Three possible movements: **Ember Modernism (0.07)**, warm editorial restaurant minimalism (0.06), and rustic Mediterranean atelier (0.04). Chosen: **Ember Modernism**.

- **Design movement:** Ember Modernism — cinematic dark surfaces with precise editorial spacing and a bright fire-orange signature.
- **Core principles:** make the food the visual anchor; keep actions obvious; balance warmth with operational clarity; treat mobile ordering as a first-class experience.
- **Color philosophy:** charcoal backgrounds create a quiet gallery for the pizza photography; ember orange signals heat, action, and appetite; cream text keeps the brand tactile rather than stark.
- **Layout paradigm:** long-form editorial sections on the public site; a split-screen command-center layout for admin; cart and forms stay in reachable bottom-sheet/drawer patterns on small screens.
- **Signature elements:** orange hairline rules, rounded image frames with deep shadows, and compact uppercase metadata labels.
- **Interaction philosophy:** every high-intent element gets immediate feedback; add-to-cart states are visible; admin tables favor scanability and safe destructive boundaries.
- **Animation:** short fades and 8–12px rises on reveal; restrained hover scale on food photography; no animation blocks ordering or form completion.
- **Typography system:** Playfair Display for expressive headings and menu names, Inter for navigation, metadata, forms, and operational data.
- **Brand essence:** Neapolitan craft made immediate for Brooklyn diners. Personality: warm, assured, exacting.
- **Brand voice:** confident and sensory. Examples: “Crafted by fire, perfected by passion.” and “Send your order straight to our oven team.”
- **Wordmark & logo:** Forno and Fiamma separated by a small ember ampersand; use the ampersand as the recurring flame mark.
- **Signature brand color:** ember orange `#f59a3d`.
