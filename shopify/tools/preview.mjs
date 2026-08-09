/**
 * Builds preview/index.html from the real section files.
 *
 * The CSS and JS are extracted verbatim from snippets/website-wall.liquid and
 * the markup mirrors the Liquid loop, so the preview is a faithful stand-in
 * for what Shopify renders.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const snippet = readFileSync(join(ROOT, "snippets", "website-wall.liquid"), "utf8");

const between = (src, open, close) => {
  const a = src.indexOf(open);
  const b = src.indexOf(close);
  if (a < 0 || b < 0) throw new Error(`missing ${open}`);
  return src.slice(a + open.length, b).trim();
};

const CSS = between(snippet, "{% stylesheet %}", "{% endstylesheet %}");
const JS = between(snippet, "{% javascript %}", "{% endjavascript %}");
const ROWS = between(snippet, 'assign rows = "', '" | split')
  .split(",")
  .map((r) => r.split("|"));

const MOBILE_COUNT = 14;

// Mirrors the snippet defaults.
const s = {
  count: 24,
  speed: 55,
  opacity: 90,
  blur: 100,
  size: 100,
  rot: 4,
  radius: 12,
  tilt: -7,
  overlay: 70,
  dir: "up_right",
  bg: "#05050A",
};

const rgbOf = (hex) => {
  const v = parseInt(hex.replace("#", ""), 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255].join(", ");
};
const rgba = (hex, a) => `rgba(${rgbOf(hex)}, ${a})`;

const a = s.overlay / 100;
const scrim =
  `radial-gradient(ellipse 62% 48% at 50% 50%, ${rgba(s.bg, (a * 0.55).toFixed(3))} 0%, ${rgba(s.bg, 0)} 78%),` +
  `linear-gradient(180deg, ${rgba(s.bg, (a * 0.8).toFixed(3))} 0%, ${rgba(s.bg, a.toFixed(3))} 45%, ${rgba(
    s.bg,
    (a * 0.8).toFixed(3)
  )} 100%)`;

const vignette = `radial-gradient(ellipse 86% 84% at 50% 50%, ${rgba(s.bg, 0)} 55%, ${rgba(
  s.bg,
  0.55
)} 85%, ${s.bg} 100%)`;

const vignetteMobile = `radial-gradient(ellipse 125% 90% at 50% 50%, ${rgba(s.bg, 0)} 60%, ${rgba(
  s.bg,
  0.5
)} 88%, ${s.bg} 100%)`;

function tile() {
  let html = "";
  for (let i = 0; i < Math.min(s.count, ROWS.length); i++) {
    const f = ROWS[i];
    const delay = (i * 1.9) % 22;
    const wide = i >= MOBILE_COUNT ? " wsp-wall__card--wide" : "";
    html +=
      `<div class="wsp-wall__card wsp-wall__card--${f[0]}${wide}" ` +
      `style="--x:${f[1]};--y:${f[2]};--w:${f[3]};--r:${f[4]};--ar:${f[5]};--bd:-${delay}s">` +
      `<img src="../assets/wsp-wall-${f[6]}.jpg" alt="" decoding="async" ` +
      `fetchpriority="low" draggable="false"></div>`;
  }
  return html;
}

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Website wall preview</title>
<style>
  *,*::before,*::after{box-sizing:border-box}
  body{margin:0;background:${s.bg};color:#fff;
    font-family:ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}
  .wsp-hero{position:relative;isolation:isolate;display:flex;align-items:center;
    min-height:100vh;padding:7rem 1.5rem 4rem;background:${s.bg};overflow:hidden}
  .wsp-hero__inner{position:relative;z-index:1;width:100%;max-width:1100px;
    margin-inline:auto;text-align:center}
  .wsp-hero__eyebrow{margin:0 0 1.25rem;font-size:.75rem;letter-spacing:.18em;
    text-transform:uppercase;opacity:.8}
  .wsp-hero__heading{margin:0;font-size:clamp(2.5rem,6.5vw,5rem);line-height:1.02;
    letter-spacing:-.035em;font-weight:700;
    text-shadow:0 2px 40px rgba(0,0,0,.5)}
  .wsp-hero__body{max-width:46ch;margin:1.5rem auto 0;font-size:1.0625rem;
    line-height:1.6;opacity:.85;text-shadow:0 1px 20px rgba(0,0,0,.6)}
  .wsp-hero__actions{display:flex;gap:.75rem;justify-content:center;margin-top:2.5rem}
  .wsp-hero__btn{display:inline-flex;align-items:center;padding:.9rem 1.75rem;
    border-radius:999px;font-size:.9375rem;font-weight:500;text-decoration:none}
  .wsp-hero__btn--primary{background:#fff;color:${s.bg}}
  .wsp-hero__btn--ghost{border:1px solid currentColor;color:inherit;opacity:.9}
  .wsp-wall__scrim{background:${scrim}}
  .wsp-wall__vignette{background:${vignette}}
  @media (max-width:749px){ .wsp-wall__vignette{background:${vignetteMobile}} }
  .after{min-height:180vh;display:grid;place-items:center;opacity:.35;
    border-top:1px solid rgba(255,255,255,.08)}

/* ---- extracted verbatim from snippets/website-wall.liquid ---- */
${CSS}
</style>
</head>
<body>
  <div class="wsp-hero">
    <div id="wsp-wall-preview" class="wsp-wall wsp-wall--${s.dir}"
      style="--wsp-op:${s.opacity / 100};--wsp-dur:${s.speed}s;--wsp-blur:${s.blur / 100};--wsp-size:${
  s.size / 100
};--wsp-rot:${s.rot / 4};--wsp-tilt:${s.tilt}deg;--wsp-radius:${s.radius}px"
      data-wsp-wall aria-hidden="true" role="presentation">
      <div class="wsp-wall__stage">
        <div class="wsp-wall__plane">
          ${`<div class="wsp-wall__tile">${tile()}</div>`.repeat(4)}
        </div>
      </div>
      <div class="wsp-wall__scrim"></div>
      <div class="wsp-wall__vignette"></div>
    </div>

    <div class="wsp-hero__inner">
      <p class="wsp-hero__eyebrow">A Shopify Design &amp; Development Studio</p>
      <h1 class="wsp-hero__heading">We build Shopify stores that scale.</h1>
      <p class="wsp-hero__body">Conversion-obsessed design and serious engineering for
        ecommerce brands that treat their store like their best salesperson.</p>
      <div class="wsp-hero__actions">
        <a class="wsp-hero__btn wsp-hero__btn--primary" href="#">Start a project</a>
        <a class="wsp-hero__btn wsp-hero__btn--ghost" href="#">See our work</a>
      </div>
    </div>
  </div>
  <div class="after">Content below the hero</div>

<script>
/* ---- extracted verbatim from snippets/website-wall.liquid ---- */
${JS}
</script>
</body>
</html>
`;

mkdirSync(join(ROOT, "preview"), { recursive: true });
writeFileSync(join(ROOT, "preview", "index.html"), html);
console.log("wrote preview/index.html");
console.log(`css ${CSS.length} bytes, js ${JS.length} bytes, ${ROWS.length} card rows`);
