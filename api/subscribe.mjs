/**
 * POST /api/subscribe - newsletter signups.
 *
 * Order matters. The address is written to Airtable first and only then
 * confirmed by email. A signup that is stored but unconfirmed is a small
 * problem; a signup that is confirmed but never stored is a lost reader.
 * The previous version of this form did the second thing: it faked a
 * success message with a timer and threw every address away.
 *
 * Env
 *   RESEND_API_KEY             required
 *   BOOKING_TO                 team inbox         default teamwebsitespixel@gmail.com
 *   BOOKING_FROM               verified sender    default Resend shared domain
 *   AIRTABLE_TOKEN             records PAT        optional
 *   AIRTABLE_BASE_ID           appXXXXXXXXXXXXXX  optional
 *   AIRTABLE_SUBSCRIBERS_TABLE table name         default Subscribers
 */

const TO = process.env.BOOKING_TO || 'teamwebsitespixel@gmail.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';
const AT_TOKEN = process.env.AIRTABLE_TOKEN || '';
const AT_BASE = process.env.AIRTABLE_BASE_ID || '';
const AT_SUBS = process.env.AIRTABLE_SUBSCRIBERS_TABLE || 'Subscribers';

const BRAND = 'WebsitesPixel';
const SITE = 'https://websitespixel.com';

/* Five a minute per address is generous for a human and useless to a script. */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < 60000);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 500) hits.clear();
  return recent.length > 5;
}

const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const esc = (v) =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const atUrl = (table) =>
  'https://api.airtable.com/v0/' + encodeURIComponent(AT_BASE) +
  '/' + encodeURIComponent(table);

const atHeaders = () => ({
  Authorization: 'Bearer ' + AT_TOKEN,
  'Content-Type': 'application/json',
});

/* Airtable rejects the whole record over one missing column name. Read the
   column it objected to, drop it, try again: a row with gaps beats no row. */
async function airtableCreate(table, fields) {
  if (!AT_TOKEN || !AT_BASE) return { skipped: true };
  const body = {};
  Object.keys(fields).forEach((k) => { if (fields[k]) body[k] = fields[k]; });
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const res = await fetch(atUrl(table), {
      method: 'POST',
      headers: atHeaders(),
      body: JSON.stringify({ fields: body, typecast: true }),
    });
    if (res.ok) return { ok: true };
    const detail = await res.text();
    const missing = /Unknown field name: "([^"]+)"/.exec(detail);
    if (missing && Object.prototype.hasOwnProperty.call(body, missing[1])) {
      delete body[missing[1]];
      continue;
    }
    return { ok: false, detail: res.status + ' ' + detail };
  }
  return { ok: false, detail: 'gave up after six unknown columns' };
}

/* Best effort only. If the token cannot read, allow the duplicate rather
   than turn a willing subscriber away. */
async function alreadyOnList(email) {
  if (!AT_TOKEN || !AT_BASE) return false;
  try {
    const formula = "LOWER({Email})='" + email.replace(/'/g, "") + "'";
    const url = atUrl(AT_SUBS) + '?maxRecords=1&filterByFormula=' +
      encodeURIComponent(formula);
    const res = await fetch(url, { headers: atHeaders() });
    if (!res.ok) return false;
    const json = await res.json();
    return Array.isArray(json.records) && json.records.length > 0;
  } catch (err) {
    return false;
  }
}

async function send(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, detail: 'RESEND_API_KEY is not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return { ok: true };
  return { ok: false, detail: await res.text() };
}

const SHELL = 'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,Roboto,'
  + 'Helvetica,Arial,sans-serif;color:#0b0c0e;line-height:1.6;font-size:15px';

function welcome() {
  return '<div style="' + SHELL + ';max-width:520px">'
    + '<p style="font-size:18px;font-weight:600;margin:0 0 12px">You are on the list.</p>'
    + '<p style="margin:0 0 14px">Thanks for subscribing to the ' + BRAND + ' notes.'
    + ' Once or twice a month we send one thing we learned shipping Shopify'
    + ' storefronts: a teardown, a conversion fix, or a build detail worth'
    + ' stealing. No filler, and unsubscribing is one reply away.</p>'
    + '<p style="margin:0 0 14px">If you have a store you would like a second'
    + ' opinion on, book a free 30 minute strategy call:</p>'
    + '<p style="margin:0 0 18px"><a href="' + SITE + '/#contact"'
    + ' style="background:#0b0c0e;color:#fff;text-decoration:none;padding:11px 18px;'
    + 'border-radius:8px;display:inline-block;font-weight:600">Book a strategy call</a></p>'
    + '<p style="margin:0;color:#6b7280;font-size:13px">' + BRAND + ' &middot; '
    + '<a href="' + SITE + '" style="color:#6b7280">websitespixel.com</a></p>'
    + '</div>';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    return res.status(429).json({ error: 'Too many attempts. Try again in a minute.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (err) { body = {}; } }
  body = body || {};

  const email = String(body.email || '').trim().slice(0, 200).toLowerCase();
  if (!isEmail(email)) {
    return res.status(422).json({ error: 'That email address does not look right.' });
  }

  const source = [body.utm, body.referrer, body.landing].filter(Boolean).join(' | ');

  /* Storage before confirmation, always. */
  let stored = false;
  try {
    if (await alreadyOnList(email)) {
      stored = true;
    } else {
      const saved = await airtableCreate(AT_SUBS, {
        Email: email,
        Status: 'Subscribed',
        Source: source || 'website footer',
      });
      if (saved && saved.ok === false) {
        console.error('airtable subscriber rejected:', saved.detail);
      }
      stored = !!(saved && (saved.ok || saved.skipped));
    }
  } catch (err) {
    console.error('airtable subscriber threw:', err && err.message);
  }

  /* Team ping. Cheap, and it means a signup is visible even with no base. */
  await send({
    from: FROM,
    to: [TO],
    reply_to: email,
    subject: 'Newsletter signup - ' + email,
    html: '<div style="' + SHELL + '"><p><strong>' + esc(email) + '</strong>'
      + ' joined the list.</p><p style="color:#6b7280;font-size:13px">Source: '
      + esc(source || 'direct') + '</p></div>',
  });

  /* The subscriber confirmation is the nice-to-have, never the blocker. */
  const hello = await send({
    from: FROM,
    to: [email],
    reply_to: TO,
    subject: 'You are on the ' + BRAND + ' list',
    html: welcome(),
  });
  if (!hello.ok) console.error('subscriber confirmation failed:', hello.detail);

  return res.status(200).json({ ok: true, stored, confirmationSent: hello.ok });
}
