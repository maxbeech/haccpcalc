# Pro Offering Decision — Archived 2026-08-24

**Status: Project archived, pending re-evaluation. This doc is the "what to do if we pick this back up" note.**

## Why this was paused

The $29/mo "Pro" tier (saved plans, PDF export, team sharing, email reminders —
see `app/pricing/page.tsx`) was never built out beyond a Stripe Checkout stub
(`app/api/checkout/route.ts` degrades to a 503 without env keys — no auth, no
saved-plan storage, no PDF export exist). Before building any of that, we
checked whether the demand to support a recurring-subscription upsell
actually exists. It doesn't, in the form the product was scoped.

## What the market data showed

Pulled via Google Ads Keyword Planner (US). No Search Console data exists —
`haccpcalc.com` was never verified in GSC; the site only ever ran on the
`vercel.app` preview domain, so there's no real traffic to validate against,
only search-demand signal.

**Direct "buy HACCP software" terms are tiny and already contested:**

| Term | Avg/mo | Competition |
|---|---|---|
| haccp plan builder | 10 | HIGH |
| haccp plan generator | 10 | HIGH |
| haccp software | 50 | MEDIUM |
| haccp software for small business | ~0 (no data) | — |
| haccp software pricing | ~0 (no data) | — |
| foodready ai (competitor brand) | 140 | MEDIUM, CPC $8.70–$20 |
| fooddocs (competitor brand) | 140 | LOW |

Every direct buying-intent term tops out around 10–70 searches/month
nationally, and several are rated HIGH competition *despite* that volume —
FoodDocs / FoodReady AI / SafetyCulture / Xenia / Zip HACCP / Operandio
already own that sliver and are paying $6–$20/click for it.

**Informational terms have real, cheap, low-competition volume — but weak
purchase intent:**

| Term | Avg/mo | Competition |
|---|---|---|
| critical control point | 135,000 | LOW |
| haccp | 22,200 | LOW |
| haccp plan for restaurant | 2,900 | LOW |
| haccp plan template | 390 | LOW |
| cottage food law | 8,100 | LOW (competition index 1) |
| temperature log sheet | 210 | MEDIUM |
| food safety temperature chart | 390 | HIGH |

**Adjacent categories have the real dollar volume, but they're services/
courses, not software:**

| Term | Avg/mo | Competition |
|---|---|---|
| servsafe certification | 49,500 | MEDIUM |
| food handlers card | 40,500 | MEDIUM |
| food safety training | 12,100 | LOW |
| safetyculture (competitor brand) | 18,100 | LOW |
| haccp certification | 6,600 | MEDIUM |
| haccp consultant | 1,600 | MEDIUM, CPC $2.50–$10 |

## The conclusion

Not a "make Pro better" problem — it's a demand-shape problem:

- Nobody meaningfully searches to *buy* HACCP plan-builder software.
- The people who do search HACCP-adjacent terms either want a free
  reference/template (huge, cheap, low-competition — good SEO/GEO traffic)
  or want a personal certification / consultant (huge volume, real CPC —
  but that's a course or a service, not a SaaS subscription).
- The SEO content plan's own "Hidden Gems" (cottage food, food truck, church
  potluck — see `docs/seo_geo_content_plan.md`) skew toward one-person,
  build-it-once operators — the worst possible fit for recurring billing on
  a document that's built once and rarely revisited.

## If this gets resumed

1. **Keep the free builder + content engine.** The informational volume
   (critical control point, haccp, haccp plan for restaurant, cottage food
   law) is real and low-competition — worth having as a traffic asset
   regardless of monetization model. Get `haccpcalc.com` live and verified
   in Search Console before doing anything else, so the next pass has real
   traffic/conversion data instead of just keyword-volume estimates.
2. **Drop the $29/mo recurring Pro tier as scoped.** Recurring billing
   fights the actual usage pattern (build once, rarely revisit).
3. **Replace it with two smaller, better-fitted monetization paths:**
   - A **one-time low-price PDF/plan pack** ($9–19, impulse buy) for the
     slice of users who want a polished export — matches one-time-use
     behavior instead of fighting it.
   - **Affiliate/referral revenue** on certification providers (ServSafe,
     StateFoodSafety — content for this already exists per the blog posts
     referenced in git history) and HACCP consultants. This is where the
     actual search volume and CPC dollars in this space live. Not ads —
     commission on a purchase the visitor already needs.
4. **If a direct-pay SaaS tier is still wanted**, retarget it at
   multi-location/chain operators rather than the single-location persona
   the current content plan targets — that's the buyer FoodReady AI is
   paying $20/click to acquire, and the only segment with plausible
   recurring willingness-to-pay.
5. Re-run the keyword pull (`google_ads_keyword_metrics` /
   `google_ads_keyword_ideas` via the Google APIs MCP) before committing to
   a build — volumes shift, and by the time this is picked back up a fresher
   read is cheap to get.
