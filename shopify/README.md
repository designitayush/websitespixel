# Hero: website wall

A wall of your real work drifting slowly behind the hero. Large, clearly
visible, gently tilted, looping forever with no visible restart.

No libraries. No GSAP, no Three.js, no Lottie, no CDN calls. Liquid, CSS and a
small amount of vanilla JavaScript, all editable from the Shopify theme editor.

```
shopify/
├── sections/hero-website-wall.liquid   Drop-in hero section + full schema
├── snippets/website-wall.liquid        The background itself (markup, CSS, JS)
├── assets/wsp-wall-01..11.jpg          Your banners, resized for web
├── preview/index.html                  Browser preview, generated from the above
└── tools/                              Generators (not needed at runtime)
```

## Install

Copy into your theme:

```
sections/hero-website-wall.liquid  ->  sections/
snippets/website-wall.liquid       ->  snippets/
assets/wsp-wall-*.jpg              ->  assets/
```

Then add **Hero: website wall** to a page in the theme editor.

### Keeping your existing hero exactly as it is

The background is a standalone snippet, so you do not have to adopt the
section. Add one line inside your current hero — no other changes:

```liquid
<div class="your-existing-hero" style="position: relative;">
  {% render 'website-wall', uid: section.id %}

  <div style="position: relative; z-index: 1;">
    ...your existing hero markup, untouched...
  </div>
</div>
```

The hero needs `position: relative` (the wall is absolutely positioned inside
it) and your content needs to sit above it. Every setting below can be passed
as a `{% render %}` parameter, e.g. `opacity: 80, speed: 70, tilt: 0`.

## Settings

| Setting | Range | Default | Notes |
|---|---|---|---|
| Animate the background | on/off | on | Always off under `prefers-reduced-motion` |
| Drift direction | 2 diagonals | bottom-left to top-right | |
| Loop duration | 25–120s | 55s | Seamless at any value |
| Card breathing | on/off | on | Scale drift between 0.995 and 1.005 |
| Number of cards | 10–24 | 24 | Per screen. Phones show the first 14 |
| Card size | 60–180% | 100% | |
| Rotation randomness | 0–10° | 4° | How far each card tips from square |
| Wall tilt | -10–10° | -7° | Rotates the whole wall. 0 sits square |
| Corner radius | 0–24px | 12px | |
| Card opacity | 20–100% | 90% | How present the work looks |
| Blur intensity | 0–200% | 100% | Only softens the cards set furthest back |
| Overlay darkness | 0–100% | 70% | Raise it if your screenshots are light |
| Vignette and edge fade | on/off | on | |
| Background / Text colour | colour | `#05050A` / `#FFFFFF` | Edges fade into the background colour |

**The two settings that matter most** are *Card opacity* and *Overlay
darkness*, and they work against each other. High opacity plus a weak overlay
gives a busy background that fights the headline; the defaults (90% / 70%) keep
the work clearly readable while the text still wins. Light screenshots need a
stronger overlay than dark ones.

## Using your own screenshots

Add a **Screenshot** block per image in the theme editor. Any number works —
they are cycled across the wall, and they replace the bundled set entirely as
soon as one exists. Shopify serves them through `image_url`, so they are
resized and CDN-cached automatically.

Best results: desktop screenshots around 1600×1000, one per project rather than
several of the same site, and a mix of light and dark designs.

The bundled set is the 11 banners from `~/banner`, resized to 1000px wide and
compressed to 896 KB total (down from 35 MB). Re-run the resize whenever you
add new work:

```bash
sips -Z 1000 -s format jpeg -s formatOptions 62 source.png --out assets/wsp-wall-12.jpg
```

Then add the new file to `ASSETS` in `tools/gen-layout.mjs` with its
width ÷ height ratio and regenerate (below).

## How the seamless loop works

The wall is one plane, tilted, holding a 2×2 tiling of a single card layout.
One animation cycle translates it by exactly one tile diagonally, so the last
frame is pixel-identical to the first. No snap, no fade, and no JavaScript
involved in the motion.

This is verified, not assumed: the preview is sampled at `t = 0` and
`t = duration` and the two screenshots hash identically.

Everything sits on **one** plane rather than three moving at different speeds.
With cards this large, parallax layers would slide through each other and read
as broken. Depth instead comes from static per-card treatment — cards marked
`back` are smaller, dimmer and softly blurred — which reads as distance without
anything ever colliding.

Positions come from a jittered, row-staggered grid so the composition never
lines up, and the cards are emitted in a scattered order so that *any prefix
stays evenly spread* — which is why dropping to 14 cards on phones still looks
composed.

## Performance

Only `transform` and `opacity` are animated. Nothing animates `top`, `left`,
`width` or `height`.

The decision that mattered: **opacity and blur are applied to the cards, never
to the moving plane**. A plane carrying its own `opacity` or `filter` needs a
render surface several times the size of the viewport, and compositing those
every frame is what kills the frame rate. An earlier three-layer version
measured **16 fps** at 1440×900; the current single-plane build measures **60
fps** at the same size.

Two further safeguards:

- **Off-screen parking.** An `IntersectionObserver` pauses the animation
  whenever the hero is scrolled out of view, so it costs nothing while the
  visitor reads the rest of the page.
- **Automatic lite mode.** Shortly after load the section samples 60 real frame
  times. If the median is worse than 20ms it drops blur, breathing and the card
  count, so a weak device gets a calmer background instead of a stuttering one.

Measured in the preview (headless Chromium, which rasterises on the CPU with no
GPU compositing — real hardware will be faster, so treat these as a floor):

| Viewport | Frame rate |
|---|---|
| 1440 × 900 | 60 fps |
| 1920 × 1080 | 52 fps |
| 390 × 844 | 60 fps |

## Accessibility

The wall is `aria-hidden` with `role="presentation"` and `pointer-events: none`;
it is decorative and carries no information. Under
`prefers-reduced-motion: reduce` every animation is switched off and a static
composition is shown — verified with zero running animations. No text lives
inside the background, and the scrim keeps hero text contrast unaffected.

## Regenerating

```bash
node tools/gen-layout.mjs   # bake the card layout
node tools/preview.mjs      # rebuild preview/index.html
```

`gen-layout.mjs` writes `tools/layout.txt`; paste it into the
`assign rows = "..."` line in the snippet. `preview.mjs` extracts the CSS and
JS verbatim from the snippet and mirrors the Liquid loop, so the preview stays
a faithful stand-in for what Shopify renders. Serve it with any static server
(`python3 -m http.server 3300`) and open `/preview/`.

## Notes

Schema labels are plain English rather than `t:` translation keys, so the
section drops into any theme without needing matching entries in that theme's
locale files. If you want them translated, move the labels into
`locales/en.default.schema.json` and swap in the `t:` keys.
