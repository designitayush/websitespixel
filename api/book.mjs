/**
 * POST /api/book — strategy-call bookings.
 *
 * Zero dependencies: Resend is called over its REST API with fetch, so there is
 * no SDK to keep updated and nothing to install. Swapping provider means
 * changing one function (deliver) and one env var.
 *
 * Env: RESEND_API_KEY   (required)
 *      BOOKING_TO       (optional, defaults to teamwebsitespixel@gmail.com)
 *      BOOKING_FROM     (optional, defaults to Resend's shared sending domain)
 */

const TO = process.env.BOOKING_TO || 'teamwebsitespixel@gmail.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';

const SERVICES = ['Shopify Store', 'Shopify Plus', 'CRO', 'Migration',
                  'Redesign', 'Custom Development', 'Retainer', 'Other'];

/* A booking is small and infrequent, so an in-memory window is enough to blunt
   floods. Serverless instances recycle, which is fine: this is a speed bump,
   not an access-control boundary. */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const win = 60_000;
  const list = (hits.get(ip) || []).filter((t) => now - t < win);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 500) hits.clear();
  return list.length > 5;
}

const clean = (v, max) => String(v == null ? '' : v).trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
const esc = (v) =>
  String(v).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function validate(b) {
  const errors = {};
  const out = {
    date: clean(b.date, 40),
    time: clean(b.time, 20),
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    company: clean(b.company, 160),
    website: clean(b.website, 200),
    service: clean(b.service, 60),
    project: clean(b.project, 4000),
  };
  if (!out.date) errors.date = 'Pick a date.';
  if (!out.time) errors.time = 'Pick a time.';
  if (out.name.length < 2) errors.name = 'Tell us your name.';
  if (!isEmail(out.email)) errors.email = 'That email address does not look right.';
  if (out.service && !SERVICES.includes(out.service)) errors.service = 'Unknown service.';
  if (out.project.length < 10) errors.project = 'A sentence or two about the project, please.';
  return { out, errors };
}

function template(d, stamp) {
  const row = (k, v) =>
    v ? `<tr><td style="padding:6px 16px 6px 0;color:#666;white-space:nowrap">${k}</td>
         <td style="padding:6px 0;color:#111"><strong>${esc(v)}</strong></td></tr>` : '';
  return `<div style="font-family:ui-sans-serif,system-ui,'Segoe UI',sans-serif;max-width:620px">
  <h2 style="margin:0 0 4px;font-size:19px;color:#111">New strategy call booked</h2>
  <p style="margin:0 0 20px;color:#666;font-size:14px">${esc(d.date)} at ${esc(d.time)}</p>
  <table style="border-collapse:collapse;font-size:14px;width:100%">
    ${row('Name', d.name)}${row('Email', d.email)}${row('Phone', d.phone)}
    ${row('Company', d.company)}${row('Website', d.website)}${row('Service', d.service)}${row('Their timezone', d.timezone)}
  </table>
  <p style="margin:20px 0 6px;color:#666;font-size:13px">Project</p>
  <p style="margin:0;padding:14px 16px;background:#f6f6f7;border-radius:8px;
     font-size:14px;line-height:1.6;color:#111;white-space:pre-wrap">${esc(d.project)}</p>
  <p style="margin:22px 0 0;color:#999;font-size:12px">Submitted ${esc(stamp)}</p>
</div>`;
}

async function deliver(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 500, detail: 'RESEND_API_KEY is not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: 502, detail: await res.text() };
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
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  /* Two silent spam checks: a field humans never see, and a form that came back
     faster than anyone could actually fill it in. Both answer 200 so bots get
     no signal that they were caught. */
  if (clean(body.company_url, 100)) return res.status(200).json({ ok: true });
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed) || elapsed < 3000) return res.status(200).json({ ok: true });

  const { out, errors } = validate(body);
  if (Object.keys(errors).length) return res.status(422).json({ errors });

  const stamp = new Date().toUTCString();
  const sent = await deliver({
    from: FROM,
    to: [TO],
    reply_to: out.email,
    subject: `Strategy call — ${out.name}${out.company ? ` (${out.company})` : ''} — ${out.date} ${out.time}`,
    html: template(out, stamp),
  });

  if (!sent.ok) {
    console.error('booking delivery failed:', sent.detail);
    return res.status(sent.status).json({ error: 'We could not send that. Please email us directly.' });
  }
  return res.status(200).json({ ok: true });
}
