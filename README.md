# WebsitesPixel

Marketing site for **WebsitesPixel**, a Shopify design & development studio.
One-page, dark-luxury, motion-driven. Everything in this repository is owned by
us or freely licensed (fonts are SIL OFL, libraries are standard licenses) —
nothing here requires purchasing a license.

**Live:** deployed via Vercel from this repo (auto-deploys on every push to `main`).

---

## Project structure

```
websitespixel/
├── index.html              The entire site (all sections, semantic HTML)
├── assets/
│   ├── css/main.css        Single organized stylesheet (numbered sections, TOC at top)
│   ├── js/main.js          All interactions & motion (numbered sections, TOC at top)
│   ├── js/vendor/          GSAP + ScrollTrigger (vendored, no CDN calls)
│   ├── fonts/              Geist, Geist Mono, Source Serif 4 (self-hosted, SIL OFL)
│   └── logos/              wp-mark.svg (brand), shopify-bag.svg, tech-stack icons
└── README.md
```

## Run locally

No build step. Any static server works:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy

Push to `main` → GitHub → Vercel auto-deploys. That's the whole pipeline.

---

## How the site works (map for future edits)

| Section | Where | Notes |
|---|---|---|
| Hero | `index.html` › `.hero` | Centered headline w/ Shopify glyph, category strip, bloom atmosphere |
| Work set-piece | `.showcase` / `#work` | Sticky 340vh track. Reel starts near-full-frame, contracts to 36% while a portrait wall materialises in 3 layers. Native CSS scroll timelines (`@supports (animation-timeline: view())`) with a GSAP fallback in `main.js §06`. Cards open the case-study modal. |
| Storefront reel | `.store-stage` | 3 concept mini-stores, auto-cycling every 7s (Ken Burns + progress dots) |
| Proof band | `.proof` | The white hard-cut: count-up stats + brand marquee |
| Services | `.services` | Bento grid, slides over the white block with 35px radius |
| Why / Results | `.why` / `#results` | Sticky headline + metric list |
| Process | `.process` | Pinned horizontal pan (GSAP), 7 premium cards w/ ghost numerals |
| Review wall | `.voices` | 3 counter-scrolling marquee rows of real Shopify Partner reviews |
| Case-study modal | `main.js §08` | `CASES` object = all project data. Auto-scrolling branded preview, metrics, before/after, star quote, prev/next + arrow keys |
| Final CTA + footer | `.cta` / `.footer` | Blooms, "Let's talk Shopify." lockup, outlined watermark |

**Design tokens** live at the top of `main.css` (`:root`): surfaces, hairlines,
ink opacities, accent, radii, easings. Change them there, not inline.

**Case studies:** to add/edit a project, update the `CASES` and `CASE_META`
objects in `main.js §08` and add a card in the `.sc-grid` columns in
`index.html`. Keep the reveal-layer classes (`l1`/`l2`/`l3`) balanced.

---

## Roadmap / TODO (next work sessions)

**Content (highest impact)**
- [ ] Replace all `picsum.photos` placeholder images with real project
      screenshots/photography (set-piece tiles, reel slides, modal previews)
- [ ] Record a real store walkthrough video for the featured reel
- [ ] Replace concept case studies with real client projects + real metrics
- [ ] Swap `mailto:` CTAs for a real booking link (Calendly/Cal.com)
- [ ] Real social links in the footer (currently `#`)
- [ ] Connect the newsletter form to a real provider (currently front-end only)

**Features**
- [ ] Dedicated case-study pages (deep links, better SEO) in addition to the modal
- [ ] Blog / resources section for SEO content
- [ ] FAQ + pricing anchor section
- [ ] Contact form (backend or Formspree-style service) alongside the mailto

**Polish / tech**
- [ ] OG share image (`og:image`) + real favicon files (PNG fallbacks)
- [ ] Custom domain `websitespixel.com` on Vercel + canonical check
- [ ] Lighthouse pass once real images land (compress to WebP/AVIF, `srcset`)
- [ ] Sitemap.xml + robots.txt when more pages exist
- [ ] Analytics (GA4 or Plausible), consent-gated

---

## Credits & licenses

- Fonts: [Geist](https://vercel.com/font) & Geist Mono (SIL OFL),
  [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4) (SIL OFL) — self-hosted
- Animation: [GSAP](https://gsap.com) + ScrollTrigger (standard "no charge" license), vendored
- Tech-stack icons: [Simple Icons](https://simpleicons.org) (CC0)
- Placeholder photography: [picsum.photos](https://picsum.photos) — to be replaced
- Everything else (design, code, brand mark) © WebsitesPixel
