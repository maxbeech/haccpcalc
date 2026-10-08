# Changelog

## 2026-10-08: Machine-readable site surfaces

- **Robots.** `app/robots.ts` now names GPTBot, ClaudeBot, PerplexityBot, Google-Extended and CCBot explicitly with `Allow: /`, so the AI-crawler policy is deliberate rather than implied.
- **llms.txt.** `public/llms.txt` lists the guides and states indexes and the sitemap, states that there is no public API, and no longer describes Pro as available: its features are not built.
- **Breadcrumbs.** `/guides`, `/states`, `/methodology`, `/pricing` and `/cooking-temperatures` now render the visible breadcrumb trail that their BreadcrumbList JSON-LD describes (`components/Breadcrumbs.tsx`).
- **Article schema.** Guides no longer emit `datePublished`, which was set to the last-updated date; the publish date is not stored. `dateModified` is unchanged.
- **Sitemap.** Guide entries use each post's `updated` date as `lastModified` instead of the build time.
- **Lint.** Escaped five straight quotes in `app/methodology/page.tsx` so `npm run lint` reports no errors.
- **Tests.** `test/geo-surfaces.test.ts` covers the crawler rules and the guide sitemap dates.

## 2026-10-07: Sentry scrubber security pass

- **Long secrets.** JWTs, bearer tokens, vendor keys (`sk_`, `whsec_`, `hlm_sk_`, `sntrys_`) and `key=value` secrets of any length are now redacted whole. The old bounded patterns left the tail of anything longer than their limit.
- **Truncation.** The 10k cut backs up to the previous delimiter, so half a secret can never survive at the boundary.
- **Encodings, URLs and key names.** URL queries and fragments (OAuth and magic-link tokens), percent-encoded emails, `Bearer%20...`, `token%3D...`, escaped JSON, `Authorization: Basic ...`, connection-string credentials and keys such as `passwd`, `pwd`, `jwt` and `Set-Cookie` are covered at any depth.
- **Fail closed, no bypass.** Events, transactions, breadcrumbs and logs are dropped if scrubbing throws. A second deep pass scrubs stack-frame vars, spans, contexts and tags, feedback events included (only the reporter's own `contexts.feedback` and user are kept).
- **Tests.** `test/scrub-hardening.test.ts` covers long JWTs, varied key lengths, secrets straddling the truncation boundary, hostile 20k strings, key variants and fail-closed behaviour.

## 2026-10-07

- Hardened the Sentry scrubber (`lib/sentry-scrub.ts`): events, transactions, breadcrumbs and logs now redact emails, phones, tokens and keys, strip URL query strings, truncate long strings, use linear-time regexes and drop the item if scrubbing fails. Feedback events keep the reporter's name, email and message but are otherwise scrubbed.
- Capture helper context is now limited to ids, codes and counts; the checkout rejection no longer sends Stripe's message text.

## 2026-10-06

- Added Sentry error tracking, console-to-Logs forwarding and a "Send feedback" link (header and footer) that files User Feedback in the `haccpcalc_web` project.
- Checkout failures are now reported instead of swallowed.
- Added `app/error.tsx` and `app/global-error.tsx` so render crashes are reported.
- Added unit tests (vitest) for the feedback control, Sentry options and the checkout failure path.
