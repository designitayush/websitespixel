/**
 * Build-time environment check.
 *
 * A missing key should break the deploy loudly, in front of us, rather than
 * breaking the booking form silently, in front of a client. This runs as the
 * Vercel build command: a non-zero exit fails the deployment before it can
 * reach production.
 *
 * Variable NAMES live here and in .env.example. Values only ever live in
 * Vercel > Project Settings > Environment Variables. Never in the repository.
 */

/* Required in every environment the site is actually served from. Each of
   these has a real failure mode behind it: no key means no mail at all, no
   sender means Resend rejects the send, no Airtable pair means a booking has
   nowhere durable to land. */
const REQUIRED = [
  'RESEND_API_KEY',
  'BOOKING_FROM',
  'BOOKING_MEETING_URL',
  'AIRTABLE_TOKEN',
  'AIRTABLE_BASE_ID',
];

/* Optional: absent means a documented default applies, not a broken form.
   Worth printing so the build log says which defaults are in play. */
const OPTIONAL = [
  'BOOKING_TO',
  'BOOKING_TZ',
  'BOOKING_MINUTES',
  'AIRTABLE_BOOKINGS_TABLE',
  'BOOKING_WEBHOOK_URL',
  'BOOKING_WEBHOOK_TOKEN',
  'FORM_MIN_ELAPSED_MS',
];

/* An empty string is a missing variable wearing a disguise: Vercel will hand
   one over quite happily, and every consumer of it treats it as absent. */
function blank(name) {
  const value = process.env[name];
  return value === undefined || String(value).trim() === '';
}

const missing = REQUIRED.filter(blank);
const unset = OPTIONAL.filter(blank);

if (unset.length) {
  console.log('check-env: optional not set, defaults apply - ' + unset.join(', '));
}

if (missing.length) {
  console.error('');
  console.error('  Build stopped. Required environment variables are missing:');
  console.error('');
  missing.forEach(function (name) { console.error('    - ' + name); });
  console.error('');
  console.error('  Add them in Vercel > Project Settings > Environment Variables');
  console.error('  for Production and Preview, then redeploy. Names are listed in');
  console.error('  .env.example; values never belong in the repository.');
  console.error('');
  process.exit(1);
}

console.log('check-env: all ' + REQUIRED.length + ' required variables present.');
