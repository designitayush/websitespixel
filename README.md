# WebsitesPixel

Premium agency website for **WebsitesPixel** — a Shopify design, development, CRO, and AI-commerce growth studio.

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

See `.env.example` for all configurable values:

- `NEXT_PUBLIC_SITE_URL` — canonical site URL for SEO
- `NEXT_PUBLIC_CONTACT_EMAIL` — footer contact email
- `NEXT_PUBLIC_BOOKING_URL` — Calendly or booking link for strategy calls
- `LEAD_MAGNET_ENDPOINT` — server endpoint for lead magnet form submissions
- `CONTACT_FORM_ENDPOINT` — server endpoint for contact form submissions

Forms validate client-side and via API routes. When endpoints are empty, submissions succeed locally (useful for development) — configure endpoints before production launch.

## Before launch

Replace all placeholder content marked with brackets:

- `[XX]` metrics in the credibility ticker
- Case study names, metrics, and imagery
- Testimonials (currently marked as sample content)
- Social links and contact details
- Privacy Policy and Terms of Service
- Process timeline placeholders

## Project structure

```
src/
├── app/              # Pages, API routes, sitemap, robots
├── components/
│   ├── layout/       # Header, Footer, MobileMenu
│   ├── sections/     # Homepage sections
│   ├── ui/           # Buttons, forms, reveal animations
│   ├── visuals/      # Hero visual, commerce diagram
│   └── seo/          # JSON-LD schema
├── data/             # Services, case studies, insights (easy to swap)
└── lib/              # Config, validation, hooks, utils
```

## Build

```bash
npm run build
npm start
```
