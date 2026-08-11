/**
 * POST /api/audit — free store audit requests.
 *
 * Deliberately a separate function from /api/book rather than a shared module:
 * bookings are working in production and refactoring them to share code would
 * put a live revenue path at risk to save about forty lines.
 *
 * Contract: this endpoint never reports success for work it did not do.
 * Every exit is either a genuine 200 with submitted:true, or a non-200 that
 * carries a machine-readable code the front end can act on. Nothing is
 * swallowed, and every rejection is logged.
 *
 * Env: RESEND_API_KEY (required), BOOKING_TO, BOOKING_FROM (optional)
 *      FORM_MIN_ELAPSED_MS (optional, default 1200)
 */

const TO = process.env.BOOKING_TO || 'hello@websitespixel.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';
const MIN_ELAPSED = Number(process.env.FORM_MIN_ELAPSED_MS) || 1200;

/* The auto-reply is from a person, not the brand mailbox, and replies to it
   land in the same inbox the notification does. Kept literal rather than
   env-driven: the address is the one the site displays, and a fallback that
   could disagree with it is the failure this repo has already fixed once. */
const CLIENT_FROM = 'Ayush at WebsitesPixel <hello@websitespixel.com>';
const CLIENT_REPLY_TO = 'hello@websitespixel.com';

/* Same shell and paragraph styles as the booking confirmation in book.mjs, so
   both client emails read as one system without a shared module. */
const SHELL = 'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;' +
  'max-width:600px;margin:0 auto;color:#111';
const P = 'margin:0 0 16px;font-size:15px;line-height:1.65';
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

/* Mirrors the helper in book.mjs: never throws, always reports. */
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
    console.error('audit rate limited:', ip);
    return res.status(429).json({
      ok: false, submitted: false, code: 'rate_limited',
      error: 'Too many attempts. Try again shortly.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  body = body || {};

  /* Anti-bot checks, redesigned.

     The old pair answered 200 {ok:true} and did nothing else, so a real person
     saw a green tick for a request that was never processed and never logged.
     Neither branch is allowed to fake success again.

     The honeypot stays a hard reject: it is a field no human can see, so a hit
     is real evidence. The timing check now FAILS OPEN. A missing or
     unparseable elapsed value is an absent signal, not proof of a bot, so we
     log it and process the request normally. Only a submission that actually
     reported an impossible speed is turned away, and it is told so explicitly
     with a code the front end can handle. */
  if (clean(body.company_url, 100)) {
    console.error('audit rejected: honeypot filled, ip', ip);
    return res.status(422).json({
      ok: false, submitted: false, code: 'rejected',
      error: 'We could not accept that submission. Please email us directly.',
    });
  }
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed)) {
    console.error('audit: no usable elapsed value, processing anyway, ip', ip);
  } else if (elapsed < MIN_ELAPSED) {
    console.error('audit rejected: submitted in ' + elapsed + 'ms, ip', ip);
    return res.status(422).json({
      ok: false, submitted: false, code: 'too_fast',
      error: 'That was submitted a little too quickly. Please try again.',
    });
  }

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
  if (Object.keys(errors).length) {
    return res.status(422).json({ ok: false, submitted: false, code: 'invalid', errors });
  }

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

  if (!process.env.RESEND_API_KEY) {
    console.error('audit: RESEND_API_KEY is not set');
    return res.status(500).json({
      ok: false, submitted: false, code: 'not_configured',
      error: 'We could not send that. Please email us directly.',
    });
  }

  /* Notification first. Everything below this point has already cleared the
     honeypot, the timing gate and isEmail(), so nothing that reaches here can
     be a bot or an address we cannot write to. */
  const r = await send({
    from: FROM, to: [TO], reply_to: d.email,
    subject: `Free audit request — ${d.store}`, html,
  });
  if (!r.ok) {
    console.error('audit delivery failed:', r.status, r.detail);
    return res.status(502).json({
      ok: false, submitted: false, code: 'delivery_failed',
      error: 'We could not send that. Please email us directly.',
    });
  }

  /* Then the acknowledgement to the person who submitted. Someone who has just
     handed over their store URL should not be met with silence.

     The goal sentence is dropped entirely when the field is empty rather than
     printed as empty quotes - the same conditional the notification above uses
     for the same field.

     This send is wrapped and can only ever log. The lead is already captured
     and already notified by the time it runs, so a failure here must not turn a
     received request into an error the visitor sees. */
  const line = (t) => `<p style="${P}">${t}</p>`;
  const clientHtml = `<div style="${SHELL}">
${line('Hi,')}
${line(`Thanks for sending over ${esc(d.store)}. I&rsquo;ve got it.`)}
${d.goal ? line(`You said you&rsquo;d most like to fix: &ldquo;${esc(d.goal)}&rdquo; &mdash; that&rsquo;s where I&rsquo;ll start.`) : ''}
${line('I&rsquo;ll go through the store myself rather than run it through a tool, and send you a recorded walkthrough plus the three highest-impact fixes in priority order. You&rsquo;ll have it within three working days.')}
${line('Nothing to pay, and no call needed. If anything else comes to mind meanwhile, just reply &mdash; it comes straight to me.')}
${line('Ayush<br>WebsitesPixel')}
</div>`;
  const clientText = [
    'Hi,',
    `Thanks for sending over ${d.store}. I've got it.`,
    d.goal ? `You said you'd most like to fix: "${d.goal}" - that's where I'll start.` : null,
    "I'll go through the store myself rather than run it through a tool, and send you a recorded walkthrough plus the three highest-impact fixes in priority order. You'll have it within three working days.",
    'Nothing to pay, and no call needed. If anything else comes to mind meanwhile, just reply - it comes straight to me.',
    'Ayush\nWebsitesPixel',
  ].filter(Boolean).join('\n\n');

  let confirmationSent = false;
  try {
    const c = await send({
      from: CLIENT_FROM, to: [d.email], reply_to: CLIENT_REPLY_TO,
      subject: `Your store teardown — ${d.store}`,
      html: clientHtml, text: clientText,
    });
    confirmationSent = c.ok;
    if (!c.ok) console.error('audit auto-reply failed:', c.status, c.detail);
  } catch (err) {
    console.error('audit auto-reply threw:', err && err.message);
  }

  return res.status(200).json({ ok: true, submitted: true, confirmationSent });
}
