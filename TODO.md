# Delivery checklist

## Next.js and Base44 removal

- [x] The uploaded Vite/React export is rebuilt as a Next.js App Router project.
- [x] Base44 packages, generated integrations, runtime assumptions, and service dependencies are removed.
- [x] Existing restaurant branding, content, menu, navigation, and supplied imagery remain available in the rebuilt site.
- [x] The public site is responsive across mobile, tablet, and desktop layouts.

## Cart and WhatsApp ordering

- [x] Visitors can add menu items to a cart, adjust quantities, remove items, and see a running total.
- [x] Visitors can enter customer details and send an order.
- [x] The order is validated and persisted by a real server-side API route.
- [x] A successful order returns a WhatsApp deeplink with item details, totals, customer name, phone, and notes.
- [x] The UI provides clear success and error feedback.

## Real APIs and operational data

- [x] A real menu API serves structured menu data.
- [x] A dedicated footprint API captures relevant visits and interactions without storing raw sensitive payloads.
- [x] A validated lead API stores customer enquiries and contact details.
- [x] Persistent storage schema covers menu records, administrator accounts, order submissions, footprint events, and leads.

## Superadmin

- [x] Superadmin signup and login are available from a dedicated admin entry point.
- [x] Sessions are protected with HTTP-only signed cookies and logout is supported.
- [x] Administrative routes reject unauthenticated access.
- [x] The dashboard is responsive and provides visibility into menu data, orders, footprint records, and leads.
- [x] Menu records can be created, edited, and archived from the dashboard.

## Deployment

- [x] Environment variables are documented for database, session, and WhatsApp configuration.
- [x] Production build settings and deployment files support Vercel.
- [x] The project passes build and diagnostics checks before delivery.
