# Changelog

## 2026-10-06

- Added Sentry error tracking, console-to-Logs forwarding and a "Send feedback" link (header and footer) that files User Feedback in the `haccpcalc_web` project.
- Checkout failures are now reported instead of swallowed.
- Added `app/error.tsx` and `app/global-error.tsx` so render crashes are reported.
- Added unit tests (vitest) for the feedback control, Sentry options and the checkout failure path.
