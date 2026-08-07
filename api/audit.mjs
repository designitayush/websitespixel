/**
 * POST /api/audit — free store audit requests.
 *
 * Deliberately a separate function from /api/book rather than a shared module:
 * bookings are working in production and refactoring them to share code would
 * put a live revenue path at risk to save about forty lines.
 *
 * Env: RESEND_API_KEY (required), BOOKING_TO, BOOKING_FROM (optional)
 */

const TO = process.env.BOOKING_TO || 'teamwebsitespixel@gmail.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';
const REVENUE = ['Under $10k', '$10k - $50k', '$50k - $250k', '$250k - $1M', '$1M+', 'Pre-launch'];

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60_000);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return list.length > 5;
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const esc = (v) => String(v).replace(/[&<>"']/g, (c) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) return res.status(429).json({ error: 'Too many attempts. Try again shortly.' });

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  if (clean(body.company_url, 100)) return res.status(200).json({ ok: true });
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < 3000) return res.status(200).json({ ok: true });

  const d = {
    store: clean(body.store, 200),
    email: clean(body.email, 160),
    name: clean(body.name, 120),
    revenue: clean(body.revenue, 40),
    goal: clean(body.goal, 2000),
  };
  const errors = {};
  if (d.store.length < 4) errors.store = 'Which store should we look at?';
  if (!isEmail(d.email)) errors.email = 'That email address does not look right.';
  if (d.revenue && !REVENUE.includes(d.revenue)) errors.revenue = 'Unknown range.';
  if (Object.keys(errors).length) return res.status(422).json({ errors });

  const row = (k, v) => v ? `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td>
    <td style="padding:6px 0;color:#111"><strong>${esc(v)}</strong></td></tr>` : '';
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:620px">
    <h2 style="margin:0 0 16px;font-size:19px;color:#111">Free audit requested</h2>
    <table style="border-collapse:collapse;font-size:14px;width:100%">
      ${row('Store', d.store)}${row('Name', d.name)}${row('Email', d.email)}${row('Monthly revenue', d.revenue)}
    </table>
    ${d.goal ? `<p style="margin:18px 0 6px;color:#666;font-size:13px">What they want to fix</p>
    <p style="margin:0;padding:14px 16px;background:#f6f6f7;border-radius:8px;font-size:14px;
       line-height:1.6;color:#111;white-space:pre-wrap">${esc(d.goal)}</p>` : ''}
    <p style="margin:22px 0 0;color:#999;font-size:12px">Submitted ${esc(new Date().toUTCString())}</p>
  </div>`;

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error('audit: RESEND_API_KEY is not set');
    return res.status(500).json({ error: 'We could not send that. Please email us directly.' });
  }
  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: FROM, to: [TO], reply_to: d.email,
      subject: `Free audit request — ${d.store}`, html,
    }),
  });
  if (!r.ok) {
    console.error('audit delivery failed:', await r.text());
    return res.status(502).json({ error: 'We could not send that. Please email us directly.' });
  }
  return res.status(200).json({ ok: true });
}
