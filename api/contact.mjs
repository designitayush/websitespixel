/**
 * POST /api/contact — messages from the /contact/ page.
 *
 * A separate function from /api/audit for the same reason audit.mjs is separate
 * from book.mjs: those paths are live and refactoring them into a shared module
 * would risk a working revenue path to save a few dozen lines. It also keeps
 * the inbox honest — a contact message arrives as a contact message, not as a
 * "Free audit request", so triage still works.
 *
 * Contract: this endpoint never reports success for work it did not do.
 * Every exit is either a genuine 200 with submitted:true, or a non-200 that
 * carries a machine-readable code the front end can act on. Nothing is
 * swallowed, and every rejection is logged.
 *
 * Env: RESEND_API_KEY (required), CONTACT_TO, BOOKING_TO, BOOKING_FROM (optional)
 *      FORM_MIN_ELAPSED_MS (optional, default 1200)
 *
 * The TO fallback is hello@websitespixel.com and must stay that way: it is the
 * address /contact/ displays. A fallback that contradicts the page would send
 * mail somewhere the visitor was never told about.
 */

const TO = process.env.CONTACT_TO || process.env.BOOKING_TO || 'hello@websitespixel.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';
const MIN_ELAPSED = Number(process.env.FORM_MIN_ELAPSED_MS) || 1200;

/* Same pair as api/audit.mjs: the auto-reply comes from a person, and replying
   to it reaches the inbox the page displays. */
const CLIENT_FROM = 'Ayush at WebsitesPixel <hello@websitespixel.com>';
const CLIENT_REPLY_TO = 'hello@websitespixel.com';

const SHELL = 'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;' +
  'max-width:600px;margin:0 auto;color:#111';
const P = 'margin:0 0 16px;font-size:15px;line-height:1.65';

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

/* Mirrors the helper in book.mjs and audit.mjs: never throws, always reports. */
async function send(payload) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return { ok: false, status: 500, detail: 'RESEND_API_KEY is not set' };
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (res.ok) return { ok: true };
  return { ok: false, status: 502, detail: await res.text() };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, submitted: false, error: 'Method not allowed' });
  }
  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    console.error('contact rate limited:', ip);
    return res.status(429).json({
      ok: false, submitted: false, code: 'rate_limited',
      error: 'Too many attempts. Try again shortly.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  /* Anti-bot checks, same pair as /api/audit and for the same reasons.

     The honeypot is a hard reject: it is a field no human can see, so a hit is
     real evidence. The timing check FAILS OPEN — a missing or unparseable
     elapsed value is an absent signal, not proof of a bot, so it is logged and
     the request is processed normally. Only a submission that actually reported
     an impossible speed is turned away, and it is told so explicitly. */
  if (clean(body.company_url, 100)) {
    console.error('contact rejected: honeypot filled, ip', ip);
    return res.status(422).json({
      ok: false, submitted: false, code: 'rejected',
      error: 'We could not accept that submission. Please email us directly.',
    });
  }
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed)) {
    console.error('contact: no usable elapsed value, processing anyway, ip', ip);
  } else if (elapsed < MIN_ELAPSED) {
    console.error('contact rejected: submitted in ' + elapsed + 'ms, ip', ip);
    return res.status(422).json({
      ok: false, submitted: false, code: 'too_fast',
      error: 'That was submitted a little too quickly. Please try again.',
    });
  }

  const d = {
    store: clean(body.store, 200),
    email: clean(body.email, 160),
    goal: clean(body.goal, 2000),
  };
  const errors = {};
  if (d.store.length < 4) errors.store = 'Which store should we look at?';
  if (!isEmail(d.email)) errors.email = 'That email address does not look right.';
  if (Object.keys(errors).length) {
    return res.status(422).json({ ok: false, submitted: false, code: 'invalid', errors });
  }

  const row = (k, v) => v ? `<tr><td style="padding:6px 16px 6px 0;color:#666">${k}</td>
<td style="padding:6px 0;color:#111"><strong>${esc(v)}</strong></td></tr>` : '';
  const html = `<div style="font-family:ui-sans-serif,system-ui,sans-serif;max-width:620px">
<h2 style="margin:0 0 16px;font-size:19px;color:#111">New contact message</h2>
<table style="border-collapse:collapse;font-size:14px;width:100%">
${row('Store', d.store)}${row('Email', d.email)}
</table>
${d.goal ? `<p style="margin:18px 0 6px;color:#666;font-size:13px">What is going wrong</p>
<p style="margin:0;padding:14px 16px;background:#f6f6f7;border-radius:8px;font-size:14px;
line-height:1.6;color:#111;white-space:pre-wrap">${esc(d.goal)}</p>` : ''}
<p style="margin:22px 0 0;color:#999;font-size:12px">Submitted ${esc(new Date().toUTCString())}</p>
</div>`;

  if (!process.env.RESEND_API_KEY) {
    console.error('contact: RESEND_API_KEY is not set');
    return res.status(500).json({
      ok: false, submitted: false, code: 'not_configured',
      error: 'We could not send that. Please email us directly.',
    });
  }

  /* Notification first. Everything below has already cleared the honeypot, the
     timing gate and isEmail(). */
  const r = await send({
    from: FROM, to: [TO], reply_to: d.email,
    subject: `New message — ${d.store}`, html,
  });
  if (!r.ok) {
    console.error('contact delivery failed:', r.status, r.detail);
    return res.status(502).json({
      ok: false, submitted: false, code: 'delivery_failed',
      error: 'We could not send that. Please email us directly.',
    });
  }

  /* Then the acknowledgement, wrapped so it can only ever log. The message is
     already in the inbox by the time this runs, so a failure here must not turn
     a delivered message into an error the sender sees. */
  const line = (t) => `<p style="${P}">${t}</p>`;
  const clientHtml = `<div style="${SHELL}">
${line('Hi,')}
${line('Thanks for reaching out. Your message came straight to my inbox &mdash; not a shared queue or a ticket system.')}
${line('I&rsquo;ll read it properly and come back to you personally within one working day, usually sooner.')}
${line('If anything else comes to mind in the meantime, just reply here.')}
${line('Ayush<br>WebsitesPixel')}
</div>`;
  const clientText = [
    'Hi,',
    'Thanks for reaching out. Your message came straight to my inbox - not a shared queue or a ticket system.',
    "I'll read it properly and come back to you personally within one working day, usually sooner.",
    'If anything else comes to mind in the meantime, just reply here.',
    'Ayush\nWebsitesPixel',
  ].join('\n\n');

  let confirmationSent = false;
  try {
    const c = await send({
      from: CLIENT_FROM, to: [d.email], reply_to: CLIENT_REPLY_TO,
      subject: 'Got your message',
      html: clientHtml, text: clientText,
    });
    confirmationSent = c.ok;
    if (!c.ok) console.error('contact auto-reply failed:', c.status, c.detail);
  } catch (err) {
    console.error('contact auto-reply threw:', err && err.message);
  }

  return res.status(200).json({ ok: true, submitted: true, confirmationSent });
}
