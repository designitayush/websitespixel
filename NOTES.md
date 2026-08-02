# WebsitesPixel — Agency Website

The official site for **WebsitesPixel**, a Shopify design & development studio. A premium dark one-page experience: pure-black surfaces, blurred color blooms, a white hard-cut credibility block, and one scroll-driven hero set-piece. Fully static: no build step, no framework, no smooth-scroll library, no preloader.

**Everything in this repository is owned by WebsitesPixel or is free, open-source software.** Fonts are Geist + Geist Mono (SIL OFL, by Vercel) and Source Serif 4 (SIL OFL, by Adobe), all self-hosted. Libraries are GSAP + ScrollTrigger (free license). Tech logos are from Simple Icons (CC0). No paid or third-party-licensed assets remain.

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

Deployed on Vercel as a static site (no build command, output = repo root).

## Files

- `index.html` — the whole site (hero, work set-piece, stats + marquee, services bento, why, process, review wall, tech stack, CTA, footer)
- `wp.css` — design system. Dark theme locked, emerald `#43cf9c` accent, Geist type with Source Serif 4 for buttons and display accents, pill buttons / 15px cards
- `wp.js` — all interactions: showcase autoplay, scroll set-piece fallback, counters, marquees, case-study modal (content in the `CASES` object), process pan, review wall, newsletter states
- `fonts/` — self-hosted open-source fonts (Geist, Geist Mono, Source Serif 4)
- `vendor/` — GSAP 3.13 + ScrollTrigger (local, no CDN at runtime)
- `logos/` — brand mark (`wp-mark.svg`), Shopify bag, tech-stack SVGs

## The work set-piece (`#work`)

Directly after the hero: the featured storefront reel starts near-full-viewport, holds for the first 10% of scroll, then scales to 0.36 while a portrait masonry wall of 8 clickable project cards (+5 dim edge fragments) materialises around it in three radial layers. Native CSS Scroll-Driven Animations with a GSAP ScrollTrigger fallback. Clicking any card opens the case-study modal (auto-scrolling branded page preview, star testimonial, prev/next + arrow keys). Mobile and reduced-motion get a static reel followed by a 2-col portrait grid.

## Content notes

- **Images** are picsum.photos placeholder seeds, art-directed with duotone filters. Replace with real project photography: search `picsum.photos/seed/` in `index.html` and the `CASES` object in `wp.js`.
- **Case studies and client brands** are illustrative placeholders. Replace with real data before making claims publicly.
- **The review wall** adapts real reviews from the team's Shopify Partner profile (shopify.com/partners/directory/partner/graphixdesigners3). Verify texts against the live profile before launch.
- **Contact** actions are `mailto:teamwebsitepixle@gmail.com`. Newsletter form is front-end only; wire to Klaviyo/Mailchimp when ready.
