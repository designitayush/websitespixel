# WebsitesPixel — Agency Website

A premium, dark-luxury one-page site for **WebsitesPixel** (Shopify design & development agency), built on the Charle Agency framework: pure-black surfaces, color only as 100px-blurred cyan/violet blooms, opacity-as-hierarchy text, a white hard-cut credibility block, 35px section overlaps, Season type, and one scroll-driven hero set-piece (the reel contracts into a 5×3 portfolio grid that materialises around it). Static site: no build step, no framework, no smooth-scroll library, no preloader.

**Motion architecture (Charle model):** the set-piece runs on native CSS Scroll-Driven Animations (`view-timeline` + `animation-range`, with Charle's hold percentages and `linear()` power-easing ramps); browsers without support get a GSAP ScrollTrigger fallback mirroring the same keyframes; reduced-motion and mobile get a static reel. Below the hero: hover transitions and ambient loops only (orbit, marquee, bento), plus the one pinned process pan.

## Run it

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Files

- `index.html` — the whole site (hero, work set-piece, stats + marquee, services bento, why, process, review wall, tech stack, CTA, footer)
- **Work set-piece** (`#work`, directly after the hero): the featured storefront reel starts near-full-bleed, holds for the first 10% of scroll, then scales down to 0.38 while a portrait masonry wall of 8 clickable project cards (+5 dim edge fragments) materialises around it in three radial layers. The reel stays centered and dominant; cards never overlap it. Native CSS scroll-driven animations with a GSAP ScrollTrigger fallback. Clicking any card FLIPs into the case-study modal (auto-scrolling branded page preview, star testimonial, prev/next + arrow keys). Mobile/reduced motion: static reel first, then a 2-col portrait grid.
- `wp.css` — design system. Tokens at the top: dark theme locked, emerald `#43cf9c` accent, Geist type, pill buttons / 20px cards / 12px media radii
- `wp.js` — all motion: preloader, Lenis smooth scroll, GSAP ScrollTrigger reveals, showcase pin-and-shrink, orbit engine, case-study modal (content lives in the `CASES` object), horizontal process pan, counters, newsletter states
- `fonts/` — self-hosted Season Sans + Season Serif (400/500, sourced from charleagency.com; **these are Charle's licensed fonts, buy a license or swap them before a commercial launch**), plus Geist (fallback) + Geist Mono (numerals)
- `vendor/` — GSAP 3.13, ScrollTrigger, Lenis (local, no CDN at runtime)
- `logos/` — tech-stack SVGs from Simple Icons

## Content notes

- **Images** are picsum.photos seeds, art-directed with duotone/grayscale filters so they read as one system. Replace with real project photography when available: search `picsum.photos/seed/` in `index.html` and the `CASES` object in `wp.js`.
- **Case studies and client brands** are illustrative placeholders written to be believable (the brief asked for this). Replace with real data before making claims publicly.
- **The review wall** uses real reviews adapted from the team's Shopify Partner profile (shopify.com/partners/directory/partner/graphixdesigners3). Verify the texts against the live profile before launch; a few were trimmed or lightly completed where the source screenshot was cut off.
- **Contact** actions are `mailto:teamwebsitepixle@gmail.com`. Newsletter form is front-end only; wire to Klaviyo/Mailchimp when ready.
- Reduced-motion users get a fully static page; mobile gets a snap-rail portfolio and vertical process instead of orbit/horizontal-pan.

## Legacy

`about.html`, `services.html`, `work.html`, `ai.html`, `contact.html`, `partials/`, `build.py`, `styles.css`, `app.js` are the old Charle Agency clone (kept for reference, hotlinked Charle assets, not linked from the new site). Safe to delete once no longer needed.
