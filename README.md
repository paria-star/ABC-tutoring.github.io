# ABC Tutoring — Prototype

A static prototype built for Dana (ABC Tutoring) as part of the Upskilling Together assessment.
Parents can browse tutors, view a tutor's profile and availability, and request a booking —
bookings are stored in the browser (`localStorage`) so the site reflects new bookings immediately
without a backend, per the assessment's GitHub Pages constraints.

## Structure

- `index.html` — single-page home: animated hero/intro, "why us" features, tutor browse grid
  (with subject filter), and a contact form — all reachable via the top nav tabs (Intro / Tutors / Contact Us)
- `tutor.html` — tutor profile + availability
- `booking.html` — booking form + confirmation
- `css/styles.css` — shared styling (light pink + green palette, animated background blobs on the hero)
- `js/tutors-data.js` — placeholder tutor data (6 tutors) — replace with real details once Dana provides them
- `js/analytics.js` — PostHog initialization (**set your project API key here**)
- `js/app.js` — rendering + booking + contact form logic
- `scripts/simulate-traffic.js` — Playwright script to simulate visitor traffic once deployed (see script header for usage)

## Before deploying

1. Open `js/analytics.js` and replace `YOUR_PROJECT_API_KEY` with your real PostHog project API key
   (and `api_host` if your project isn't on US cloud).
2. Replace the placeholder `contact@abctutoring.example` email (in each HTML file) and the
   placeholder Facebook link in the footer with Dana's real contact info.
3. Push to GitHub and confirm the site renders at `https://<org>.github.io/`.

## PostHog events tracked

- `tutor_profile_viewed` — fired when a tutor's profile page loads (property: `tutor_name`)
- `booking_started` — fired when the booking form loads
- `booking_completed` — fired when a booking is successfully submitted
- `contact_form_submitted` — fired when the contact form on the home page is submitted

Autocapture (pageviews, clicks, referrers) is on by default, so Facebook traffic will show up in
PostHog's referrer breakdown automatically once the link is shared there.

## Notes

- The contact form is a client-side demo (like booking): messages are saved to `localStorage` and
  a thank-you message is shown, but nothing is emailed yet. If Dana wants real message delivery,
  the next step is wiring the form to a form-backend service (e.g. Formspree) — no code changes
  needed beyond the form's `action` attribute.
- The hero background animation is pure CSS (soft blurred blobs drifting via `@keyframes`) — no
  JS library required, and it respects `prefers-reduced-motion`.
