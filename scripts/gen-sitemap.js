/**
 * Generates sitemap.xml from the directory structure.
 *
 * Run by hand, commit the result. Deliberately NOT wired into vercel.json:
 * check-env.js is the build command and a non-zero exit fails the deploy.
 * An SEO file has no business on that path — a bug here should cost a re-run,
 * not a production deployment. Committing the output also means the sitemap
 * shows up in a diff, which is the one thing a build-time generator can never
 * give you.
 *
 * The URL rule is the same one every page's canonical already follows, so the
 * two cannot drift: index.html -> /, <dir>/index.html -> /<dir>/.
 *
 *   node scripts/gen-sitemap.js           write sitemap.xml
 *   node scripts/gen-sitemap.js --check   verify only, exit 1 if stale
 *
 * No lastmod. One commit touched every file, so the dates are all identical,
 * and a uniform lastmod is one Google discounts. Add it in a second pass once
 * per-page edits make the git dates genuinely differ.
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const ORIGIN = 'https://websitespixel.com';

/* Directories that never contain a page. api/ is POST-only endpoints; docs/,
   if present, is gitignored internal planning and must never be listed. */
const SKIP = new Set(['.git', 'assets', 'api', 'scripts', 'docs', 'node_modules']);

function findPages(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') || SKIP.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) findPages(full, out);
    else if (entry.name === 'index.html') out.push(path.relative(ROOT, full));
  }
  return out;
}

const toUrl = (file) =>
  ORIGIN + '/' + file.slice(0, -'index.html'.length).split(path.sep).join('/');

/* Escape before emitting. No current slug needs it, but a single unescaped &
   in a future page name emits invalid XML and silently voids the whole file.
   Ampersand first, or the entities below get double-escaped. */
const xmlEscape = (s) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

/* Homepage, then by depth, then alphabetical — so the diff reads in site order. */
function rank(url) {
  const p = url.slice(ORIGIN.length);
  return [p === '/' ? 0 : 1, (p.match(/\//g) || []).length, p];
}

const urls = findPages(ROOT)
  .map(toUrl)
  .sort((a, b) => {
    const [A, B] = [rank(a), rank(b)];
    return A[0] - B[0] || A[1] - B[1] || A[2].localeCompare(B[2]);
  });

const xml =
  '<?xml version="1.0" encoding="UTF-8"?>\n' +
  '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map((u) => `  <url><loc>${xmlEscape(u)}</loc></url>`).join('\n') +
  '\n</urlset>\n';

const target = path.join(ROOT, 'sitemap.xml');

if (process.argv.includes('--check')) {
  const current = fs.existsSync(target) ? fs.readFileSync(target, 'utf8') : '';
  if (current !== xml) {
    console.error(`sitemap.xml is out of date — ${urls.length} pages found`);
    process.exit(1);
  }
  console.log(`sitemap.xml up to date — ${urls.length} URLs`);
} else {
  fs.writeFileSync(target, xml);
  console.log(`Wrote sitemap.xml — ${urls.length} URLs`);
}
