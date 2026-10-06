# Changelog

## 2026-10-07

- Hardened the Sentry scrubber (`lib/sentry-scrub.ts`): events, transactions, breadcrumbs and logs now redact emails, phones, tokens and keys, strip URL query strings, truncate long strings, use linear-time regexes and drop the item if scrubbing fails. Feedback events keep the reporter's name, email and message but are otherwise scrubbed.
- Capture helper context is now limited to ids, codes and counts; the checkout rejection no longer sends Stripe's message text.

## 2026-10-06

- Added Sentry error tracking, console-to-Logs forwarding and a "Send feedback" link (header and footer) that files User Feedback in the `haccpcalc_web` project.
- Checkout failures are now reported instead of swallowed.
- Added `app/error.tsx` and `app/global-error.tsx` so render crashes are reported.
- Added unit tests (vitest) for the feedback control, Sentry options and the checkout failure path.
