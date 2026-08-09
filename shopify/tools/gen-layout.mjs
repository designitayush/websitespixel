/**
 * Bakes the collage layout for the hero wall.
 *
 *   node tools/gen-layout.mjs
 *
 * Large cards on a single tilted plane, packed like a wall of work rather than
 * scattered confetti. Positions come from a jittered grid so the composition
 * reads as intentional but never lines up; the grid wraps across tile edges so
 * the seamless loop still holds.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

function prng(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = prng(20260806);

// Real banners, in the order they were exported to assets/.
// ar = width / height.
const ASSETS = [
  { id: "01", ar: 1.548 },
  { id: "02", ar: 1.548 },
  { id: "03", ar: 1.548 },
  { id: "04", ar: 1.548 },
  { id: "05", ar: 1.548 },
  { id: "06", ar: 2.053 },
  { id: "07", ar: 1.616 },
  { id: "08", ar: 0.731 },
  { id: "09", ar: 0.731 },
  { id: "10", ar: 0.731 },
  { id: "11", ar: 1.069 },
];

const COLS = 6;
const ROWS = 4;
const CELLS = COLS * ROWS; // 24 cards per tile

// Depth is static (size + dimming), not parallax: every card sits on one plane
// so large overlapping cards can never slide through each other.
const DEPTHS = ["back", "mid", "front"];

const cards = [];
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const i = r * COLS + c;

    // Cell centre, offset on alternating rows so columns never align.
    const cellW = 100 / COLS;
    const cellH = 100 / ROWS;
    const stagger = r % 2 === 0 ? 0 : cellW * 0.5;
    const cx = (c + 0.5) * cellW + stagger + (rand() - 0.5) * cellW * 0.34;
    const cy = (r + 0.5) * cellH + (rand() - 0.5) * cellH * 0.3;

    // Two in five cards sit back: smaller, dimmer, a touch softer.
    const depth = i % 5 === 0 ? "back" : i % 5 === 2 ? "mid" : "front";
    const base = depth === "back" ? 13 : depth === "mid" ? 15.5 : 17.5;
    const w = base + rand() * 3.5;

    const asset = ASSETS[i % ASSETS.length];

    cards.push({
      x: ((cx % 100) + 100) % 100,
      y: cy,
      w,
      rot: (rand() * 2 - 1) * 3.5, // the whole plane is already tilted
      depth,
      asset,
    });
  }
}

// Order so any prefix keeps the wall evenly covered: walk cells in a scattered
// sequence rather than left-to-right, so trimming for mobile never leaves a
// bare half. The stride must be coprime with the cell count (to visit every
// cell once) and must not be a multiple of the image count, or every step
// would land on the same image and the wall would repeat itself.
const STRIDE = 7;
const ordered = [];
for (let k = 0; k < CELLS; k++) ordered.push(cards[(k * STRIDE) % CELLS]);

const gcd = (a, b) => (b ? gcd(b, a % b) : a);
if (gcd(STRIDE, CELLS) !== 1 || STRIDE % ASSETS.length === 0) {
  throw new Error(`bad stride ${STRIDE} for ${CELLS} cells / ${ASSETS.length} images`);
}
for (let k = 1; k < ordered.length; k++) {
  if (ordered[k].asset.id === ordered[k - 1].asset.id) {
    console.warn(`warning: image ${ordered[k].asset.id} repeats back to back at ${k}`);
  }
}

const rows = ordered.map((c) =>
  [
    c.depth,
    c.x.toFixed(1),
    c.y.toFixed(1),
    c.w.toFixed(1),
    c.rot.toFixed(1),
    c.asset.ar.toFixed(3),
    c.asset.id,
  ].join("|")
);

writeFileSync(join(ROOT, "tools", "layout.txt"), rows.join(",") + "\n");

console.log(`${rows.length} cards per tile`);
console.log(
  `depth mix: ${ordered.filter((c) => c.depth === "back").length} back / ` +
    `${ordered.filter((c) => c.depth === "mid").length} mid / ` +
    `${ordered.filter((c) => c.depth === "front").length} front`
);
console.log(rows.join(",").slice(0, 160) + "...");
