/**
 * POST /api/book - strategy-call bookings.
 *
 * On a successful booking:
 *   1. the record is pushed to an optional durable sink (webhook -> Airtable,
 *      Sheets, Make, n8n) so a lead survives any email failure;
 *   2. an internal notification goes to the team, reply-to set to the client;
 *   3. a branded confirmation goes to the client, reply-to set to the team;
 *   4. both carry the same .ics calendar invite.
 *
 * Zero dependencies: Resend is called over its REST API with fetch.
 *
 * Env
 *   RESEND_API_KEY          required
 *   BOOKING_TO              team inbox             default teamwebsitespixel@gmail.com
 *   BOOKING_FROM            verified sender        default Resend shared domain
 *   BOOKING_TZ              business timezone      default Asia/Kolkata
 *   BOOKING_MINUTES         call length in minutes default 30
 *   BOOKING_MEETING_URL     standing video link    optional
 *   BOOKING_WEBHOOK_URL     durable sink           optional
 *   BOOKING_WEBHOOK_TOKEN   bearer token for sink  optional
 *   AIRTABLE_TOKEN          records:write PAT      optional
 *   AIRTABLE_BASE_ID        appXXXXXXXXXXXXXX      optional
 *   AIRTABLE_BOOKINGS_TABLE table name             default Bookings
 */

const TO = process.env.BOOKING_TO || 'teamwebsitespixel@gmail.com';
const FROM = process.env.BOOKING_FROM || 'WebsitesPixel <onboarding@resend.dev>';
const BIZ_TZ = process.env.BOOKING_TZ || 'Asia/Kolkata';
const MINUTES = Number(process.env.BOOKING_MINUTES) || 30;
const MEETING_URL = process.env.BOOKING_MEETING_URL || '';
const SINK = process.env.BOOKING_WEBHOOK_URL || '';
const SINK_TOKEN = process.env.BOOKING_WEBHOOK_TOKEN || '';
const MIN_ELAPSED = Number(process.env.FORM_MIN_ELAPSED_MS) || 1500;

/* Airtable is the system of record. Email is a notification, not storage:
   inboxes get archived, filtered and lost, and a lead you cannot query is
   not a pipeline. Leave the two secrets unset and every call below turns
   into a no-op, so the booking form keeps working either way.
     AIRTABLE_TOKEN               personal access token, scope data.records:write
     AIRTABLE_BASE_ID             looks like appXXXXXXXXXXXXXX
     AIRTABLE_BOOKINGS_TABLE      defaults to Bookings
*/
const AT_TOKEN = process.env.AIRTABLE_TOKEN || '';
const AT_BASE = process.env.AIRTABLE_BASE_ID || '';
const AT_BOOKINGS = process.env.AIRTABLE_BOOKINGS_TABLE || 'Bookings';

const BRAND = 'WebsitesPixel';
const SITE = 'https://websitespixel.com';

const SERVICES = ['Shopify Store', 'Shopify Plus', 'CRO', 'Migration',
  'Redesign', 'Custom Development', 'Retainer', 'Other'];

/* A booking is small and infrequent, so an in-memory window is enough to blunt
   floods. Serverless instances recycle, which is fine: this is a speed bump,
   not an access-control boundary. */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const list = (hits.get(ip) || []).filter((t) => now - t < 60000);
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

/* ---------------------------------------------------------------- time ---
   Slots are published in the business timezone. Turning a wall-clock time in
   a named zone into a real instant needs the zone's offset at that instant,
   which Intl can give us; one correction pass settles it. */
function zoneOffset(date, tz) {
  const f = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  });
  const p = {};
  for (const part of f.formatToParts(date)) p[part.type] = part.value;
  const asUTC = Date.UTC(Number(p.year), Number(p.month) - 1, Number(p.day),
    Number(p.hour) % 24, Number(p.minute), Number(p.second));
  return asUTC - date.getTime();
}

function zonedToUtc(isoDate, hhmm, tz) {
  const dm = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate || '');
  const tm = /^(\d{1,2}):(\d{2})$/.exec(hhmm || '');
  if (!dm || !tm) return null;
  const naive = Date.UTC(+dm[1], +dm[2] - 1, +dm[3], +tm[1], +tm[2]);
  let guess = new Date(naive - zoneOffset(new Date(naive), tz));
  guess = new Date(naive - zoneOffset(guess, tz));
  return isNaN(guess.getTime()) ? null : guess;
}

function whenIn(date, tz) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      timeZone: tz, weekday: 'long', day: 'numeric', month: 'long',
      hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'short',
    }).format(date);
  } catch (err) { return ''; }
}

/* ----------------------------------------------------------------- ics ---*/
const icsText = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;')
  .replace(/,/g, '\\,').replace(/\r?\n/g, '\\n');
const icsStamp = (d) => d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

/* RFC 5545 wants lines folded at 75 octets; Google is strict about it. */
function fold(line) {
  if (line.length <= 74) return line;
  const out = [line.slice(0, 74)];
  let rest = line.slice(74);
  while (rest.length > 73) { out.push(' ' + rest.slice(0, 73)); rest = rest.slice(73); }
  if (rest) out.push(' ' + rest);
  return out.join('\r\n');
}

function buildIcs(start, uid, summary, description) {
  const end = new Date(start.getTime() + MINUTES * 60000);
  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//WebsitesPixel//Strategy Call//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    'UID:' + uid,
    'DTSTAMP:' + icsStamp(new Date()),
    'DTSTART:' + icsStamp(start),
    'DTEND:' + icsStamp(end),
    'SUMMARY:' + icsText(summary),
    'DESCRIPTION:' + icsText(description),
    'LOCATION:' + icsText(MEETING_URL || 'Video call'),
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(fold).join('\r\n');
}

/* -------------------------------------------------------------- inputs ---*/
const REF_CHARS = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
function reference() {
  let s = '';
  for (let i = 0; i < 6; i++) s += REF_CHARS[Math.floor(Math.random() * REF_CHARS.length)];
  return 'WP-' + s;
}

function validate(b) {
  const errors = {};
  const out = {
    date: clean(b.date, 60),
    dateISO: clean(b.dateISO, 10),
    time: clean(b.time, 5),
    timezone: clean(b.timezone, 60),
    name: clean(b.name, 120),
    email: clean(b.email, 160),
    phone: clean(b.phone, 40),
    company: clean(b.company, 160),
    website: clean(b.website, 200),
    service: clean(b.service, 60),
    project: clean(b.project, 4000),
    utm: clean(b.utm, 300),
    referrer: clean(b.referrer, 300),
    landing: clean(b.landing, 300),
  };
  if (!out.date) errors.date = 'Pick a date.';
  if (!out.time) errors.time = 'Pick a time.';
  if (out.name.length < 2) errors.name = 'Tell us your name.';
  if (!isEmail(out.email)) errors.email = 'That email address does not look right.';
  if (out.service && !SERVICES.includes(out.service)) errors.service = 'Unknown service.';
  if (out.project.length < 10) errors.project = 'A sentence or two about the project, please.';
  return { out, errors };
}

/* ------------------------------------------------------------ templates ---*/
const SHELL = 'font-family:ui-sans-serif,system-ui,-apple-system,Segoe UI,sans-serif;' +
  'max-width:600px;margin:0 auto;color:#111';

function row(k, v) {
  if (!v) return '';
  return '<tr><td style="padding:7px 18px 7px 0;color:#6b6b70;white-space:nowrap;' +
    'font-size:14px;vertical-align:top">' + k + '</td>' +
    '<td style="padding:7px 0;color:#111;font-size:14px"><strong>' + esc(v) +
    '</strong></td></tr>';
}

function internalTemplate(d, when, ref, stamp) {
  return '<div style="' + SHELL + '">' +
    '<p style="margin:0 0 4px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;' +
    'color:#8a8a90">New booking &middot; ' + esc(ref) + '</p>' +
    '<h2 style="margin:0 0 6px;font-size:20px">' + esc(d.name) +
    (d.company ? ' &mdash; ' + esc(d.company) : '') + '</h2>' +
    '<p style="margin:0 0 20px;color:#555;font-size:15px">' + esc(when) + '</p>' +
    '<table style="border-collapse:collapse;width:100%">' +
    row('Email', d.email) + row('Phone', d.phone) + row('Company', d.company) +
    row('Website', d.website) + row('Service', d.service) +
    row('Their timezone', d.timezone) + row('Source', d.utm || d.referrer || 'direct') +
    row('Landing page', d.landing) +
    '</table>' +
    '<p style="margin:22px 0 6px;color:#6b6b70;font-size:13px">Project</p>' +
    '<p style="margin:0;padding:14px 16px;background:#f5f5f7;border-radius:10px;' +
    'font-size:14px;line-height:1.65;white-space:pre-wrap">' + esc(d.project) + '</p>' +
    '<p style="margin:22px 0 0;font-size:14px">Reply to this email and it goes straight to ' +
    esc(d.name.split(' ')[0]) + '.</p>' +
    '<p style="margin:14px 0 0;color:#9a9aa0;font-size:12px">Submitted ' + esc(stamp) + '</p>' +
    '</div>';
}

function clientTemplate(d, whenTheirs, whenOurs, ref) {
  const first = esc(d.name.split(' ')[0]);
  return '<div style="' + SHELL + '">' +
    '<p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;' +
    'color:#8a8a90">' + BRAND + '</p>' +
    '<h1 style="margin:0 0 14px;font-size:23px;line-height:1.25">Your strategy call is confirmed</h1>' +
    '<p style="margin:0 0 20px;font-size:15px;line-height:1.65">Hi ' + first + ', thanks for booking. ' +
    'Here are the details, and a calendar invite is attached to this email.</p>' +
    '<table style="border-collapse:collapse;width:100%;background:#f5f5f7;' +
    'border-radius:10px;padding:4px">' +
    '<tr><td style="padding:16px 18px">' +
    '<div style="font-size:17px;font-weight:700;margin-bottom:4px">' + esc(whenTheirs) + '</div>' +
    (whenOurs && whenOurs !== whenTheirs
      ? '<div style="font-size:13px;color:#6b6b70">' + esc(whenOurs) + ' our time</div>' : '') +
    '<div style="font-size:13px;color:#6b6b70;margin-top:6px">' + MINUTES +
    ' minutes &middot; video call &middot; ref ' + esc(ref) + '</div>' +
    (MEETING_URL ? '<div style="margin-top:12px"><a href="' + esc(MEETING_URL) +
      '" style="color:#0a7d5a;font-weight:600">Join the call</a></div>'
      : '<div style="font-size:13px;color:#6b6b70;margin-top:8px">' +
        'We will send the video link before the call.</div>') +
    '</td></tr></table>' +
    '<h3 style="margin:26px 0 8px;font-size:15px">What we will cover</h3>' +
    '<ul style="margin:0;padding-left:18px;font-size:14px;line-height:1.75;color:#333">' +
    '<li>Where your store is leaking conversion right now</li>' +
    '<li>The two or three changes with the biggest upside</li>' +
    '<li>A realistic scope, timeline and budget &mdash; no obligation</li>' +
    '</ul>' +
    '<h3 style="margin:24px 0 8px;font-size:15px">To make it useful</h3>' +
    '<p style="margin:0 0 8px;font-size:14px;line-height:1.7;color:#333">Reply to this email with ' +
    'your store URL and your current monthly revenue band, and we will come to the call ' +
    'having already looked. It turns a chat into a working session.</p>' +
    '<p style="margin:24px 0 0;font-size:14px;line-height:1.7">Need to move it? Just reply and ' +
    'we will sort a new time.</p>' +
    '<p style="margin:26px 0 0;font-size:14px">Speak soon,<br>' + BRAND + '</p>' +
    '<hr style="border:0;border-top:1px solid #e6e6ea;margin:26px 0 12px">' +
    '<p style="margin:0;color:#9a9aa0;font-size:12px">' +
    '<a href="' + SITE + '" style="color:#9a9aa0">websitespixel.com</a>' +
    ' &middot; Shopify design &amp; development &middot; ref ' + esc(ref) + '</p>' +
    '</div>';
}

/* ------------------------------------------------------------- delivery ---*/
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

/* Airtable refuses a whole record when one column name does not exist, which
   would mean losing a real lead over a typo in a table header. So read the
   field it objected to, drop it, and try again. A saved booking with missing
   columns beats a tidy schema and an empty base. */
async function airtableCreate(table, fields) {
  if (!AT_TOKEN || !AT_BASE) return { skipped: true };
  const url = 'https://api.airtable.com/v0/' + encodeURIComponent(AT_BASE) +
    '/' + encodeURIComponent(table);
  const body = {};
  Object.keys(fields).forEach((k) => {
    if (fields[k] !== undefined && fields[k] !== null && fields[k] !== '') body[k] = fields[k];
  });
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + AT_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields: body, typecast: true }),
    });
    if (res.ok) {
      const json = await res.json().catch(() => ({}));
      return { ok: true, id: json.id };
    }
    const detail = await res.text();
    const missing = /Unknown field name: "([^"]+)"/.exec(detail);
    if (missing && Object.prototype.hasOwnProperty.call(body, missing[1])) {
      delete body[missing[1]];
      continue;
    }
    return { ok: false, detail: res.status + ' ' + detail };
  }
  return { ok: false, detail: 'gave up after ten unknown columns' };
}

/* Runs before a single email is sent. If Resend, DNS or Gmail fall over
   afterwards the lead is already sitting in Airtable, and neither sink is
   ever allowed to throw and take the booking down with it. */
async function persist(record) {
  const slot = [record.date, record.time].filter(Boolean).join(' at ') +
    (record.businessTimezone ? ' (' + record.businessTimezone + ')' : '');
  const source = [record.utm, record.referrer, record.landing]
    .filter(Boolean).join(' | ');

  /* persist() now reports back. skipped means no store is configured, so there
     was nothing to fail; stored:false with skipped:false means Airtable was
     asked and refused, which is a genuinely lost lead the handler must not
     paper over with a 200. */
  let outcome = { stored: false, skipped: true };

  try {
    const saved = await airtableCreate(AT_BOOKINGS, {
      Reference: record.reference,
      Name: record.name,
      Email: record.email,
      Phone: record.phone,
      Company: record.company,
      Website: record.website,
      Service: record.service,
      Project: record.project,
      Slot: slot,
      Start: record.startUtc,
      'Client Timezone': record.clientTimezone,
      Status: 'New',
      Source: source,
    });
    if (saved && saved.skipped) {
      outcome = { stored: false, skipped: true };
    } else if (saved && saved.ok === false) {
      console.error('airtable booking rejected:', saved.detail);
      outcome = { stored: false, skipped: false };
    } else {
      outcome = { stored: true, skipped: false };
    }
  } catch (err) {
    console.error('airtable booking threw:', err && err.message);
    outcome = { stored: false, skipped: false };
  }

  if (!SINK) return outcome;
  try {
    const headers = { 'Content-Type': 'application/json' };
    if (SINK_TOKEN) headers.Authorization = 'Bearer ' + SINK_TOKEN;
    const res = await fetch(SINK, {
      method: 'POST', headers, body: JSON.stringify(record),
    });
    if (!res.ok) console.error('booking sink rejected:', res.status, await res.text());
  } catch (err) {
    console.error('booking sink threw:', err && err.message);
  }

  return outcome;
}

/* -------------------------------------------------------------- handler ---*/
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, booked: false, error: 'Method not allowed' });
  }

  const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'unknown';
  if (rateLimited(ip)) {
    console.error('booking rate limited:', ip);
    return res.status(429).json({
      ok: false, booked: false, code: 'rate_limited',
      error: 'Too many attempts. Try again in a minute.',
    });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (err) { body = {}; } }
  body = body || {};

  /* Anti-bot checks, redesigned.

     These two used to answer 200 {ok:true} and do nothing else. A visitor whose
     elapsed value never arrived got a green tick for a booking that was never
     validated, never stored and never emailed, and nothing was logged. Neither
     branch may fake success again.

     The honeypot stays a hard reject: no human can see that field, so a hit is
     real evidence. The timing check now FAILS OPEN. A missing or unparseable
     elapsed value is an absent signal, not proof of a bot, so we log it and
     carry on. Only a submission that actually reported an impossible speed is
     turned away, and it is told so with a code the front end can handle. */
  if (clean(body.company_url, 100)) {
    console.error('booking rejected: honeypot filled, ip', ip);
    return res.status(422).json({
      ok: false, booked: false, code: 'rejected',
      error: 'We could not accept that submission. Please email us directly.',
    });
  }
  const elapsed = Number(body.elapsed);
  if (!Number.isFinite(elapsed)) {
    console.error('booking: no usable elapsed value, processing anyway, ip', ip);
  } else if (elapsed < MIN_ELAPSED) {
    console.error('booking rejected: submitted in ' + elapsed + 'ms, ip', ip);
    return res.status(422).json({
      ok: false, booked: false, code: 'too_fast',
      error: 'That form was submitted too quickly. Please try again.',
    });
  }

  const parsed = validate(body);
  const out = parsed.out;
  if (Object.keys(parsed.errors).length) {
    return res.status(422).json({
      ok: false, booked: false, code: 'invalid', errors: parsed.errors,
    });
  }

  const ref = reference();
  const stamp = new Date().toUTCString();
  const start = zonedToUtc(out.dateISO, out.time, BIZ_TZ);

  /* Their timezone is only ever a display convenience; the instant is ours. */
  const theirTz = out.timezone || BIZ_TZ;
  const whenOurs = start ? whenIn(start, BIZ_TZ) : out.date + ' at ' + out.time;
  const whenTheirs = start ? whenIn(start, theirTz) : out.date + ' at ' + out.time;

  const stored = await persist({
    reference: ref, receivedAt: new Date().toISOString(),
    startUtc: start ? start.toISOString() : null,
    date: out.date, dateISO: out.dateISO, time: out.time,
    businessTimezone: BIZ_TZ, clientTimezone: out.timezone,
    name: out.name, email: out.email, phone: out.phone, company: out.company,
    website: out.website, service: out.service, project: out.project,
    utm: out.utm, referrer: out.referrer, landing: out.landing, ip: ip,
  });

  /* Storage first, mail second. If a store is configured and it refused the
     record, the lead really is gone and the only honest answer is a 500. If no
     store is configured there was nothing to fail and email is the only trail. */
  if (stored && stored.skipped === false && stored.stored === false) {
    console.error('booking not stored, refusing to report success, ref', ref);
    return res.status(500).json({
      ok: false, booked: false, code: 'storage_failed',
      error: 'We could not save that booking. Please email us directly.',
    });
  }

  const summary = 'Strategy call - ' + BRAND + ' x ' + out.name;
  const detail = 'A ' + MINUTES + ' minute Shopify strategy call.' +
    (MEETING_URL ? ' Join: ' + MEETING_URL : '') +
    ' Booking reference ' + ref + '.';
  const invite = start ? buildIcs(start, ref + '@websitespixel.com', summary, detail) : null;
  const attachments = invite
    ? [{
      filename: 'strategy-call.ics',
      content: Buffer.from(invite, 'utf8').toString('base64'),
      content_type: 'text/calendar',
    }]
    : undefined;

  const subject = 'Strategy call - ' + out.name +
    (out.company ? ' (' + out.company + ')' : '') +
    ' - ' + out.date + ' ' + out.time + ' - ' + out.email;

  const team = await send({
    from: FROM,
    to: [TO],
    reply_to: out.email,
    subject: subject,
    html: internalTemplate(out, whenOurs, ref, stamp),
    attachments: attachments,
  });

  if (!team.ok) {
    console.error('booking notification failed:', team.status, team.detail);
    /* The record is already stored at this point. If it saved, the booking
       genuinely happened, and calling it a failure would be the same lie in
       the opposite direction - so report the mail failure truthfully instead. */
    if (stored && stored.stored) {
      return res.status(200).json({
        ok: true, booked: true, reference: ref,
        confirmationSent: false, teamNotified: false,
      });
    }
    return res.status(team.status).json({
      ok: false, booked: false, code: 'delivery_failed',
      error: 'We could not send that. Please email us directly.',
    });
  }

  /* The client confirmation is important but never worth failing a booking
     over: the lead is already captured and the team already knows. */
  const guest = await send({
    from: FROM,
    to: [out.email],
    reply_to: TO,
    subject: 'Your strategy call is confirmed - ' + out.date + ' at ' + out.time,
    html: clientTemplate(out, whenTheirs, whenOurs, ref),
    attachments: attachments,
  });
  if (!guest.ok) console.error('client confirmation failed:', guest.detail);

  return res.status(200).json({
    ok: true, booked: true, reference: ref,
    confirmationSent: guest.ok, teamNotified: true,
  });
}
