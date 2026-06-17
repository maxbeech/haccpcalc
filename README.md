# HACCPCalc

Free HACCP plan builder and food safety temperature calculator. Pick a food and
its process steps; get a 7-principle HACCP plan with critical control points,
critical limits, monitoring and corrective actions — every temperature cited
verbatim from the **FDA Food Code 2022** — plus a printable temperature log.

Live: https://haccpcalc.vercel.app

## What it does

- **HACCP plan builder** — maps a food's process category (no-cook / same-day cook /
  complex) to its critical control points and assigns each a Food Code critical limit.
- **Cooking temperature chart** — FDA Food Code 2022 minimum internal temperatures.
- **Temperature log generator** — printable monitoring sheet for receiving, cooking,
  cooling, reheating and hot/cold holding.
- **Programmatic SEO** — `/haccp-plan-template/[food-type]` (12 foods) and
  `/food-safety/[state]` (50 states), plus guides, `sitemap.ts`, `robots.ts`.
- **GEO** — JSON-LD (SoftwareApplication, FAQPage, Breadcrumb, Article), citable FAQ
  sections, and `public/llms.txt`.

## Stack

- Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- Deployed on Vercel (remote build)
- Stripe `/api/checkout` (env-gated; degrades to a friendly 503 without keys)

## No fabricated data

Every critical limit is drawn from `lib/data/temps.ts`, which cites the exact FDA
Food Code 2022 section for each value. The engine (`lib/calc/haccp.ts`) and the
temperature-log generator (`lib/calc/templog.ts`) read from that single source. See
`/methodology` and run `npm test` to validate the engine against hand-computed values.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm test         # engine tests (38 assertions)
npm run build
```

## Environment variables (optional)

| Var | Purpose |
| --- | --- |
| `STRIPE_SECRET_KEY` | Stripe Pro checkout (absent → 503 "launching shortly") |
| `STRIPE_PRICE_ID` | Stripe price for the Pro subscription |
| `NEXT_PUBLIC_SITE_URL` | Canonical base URL for checkout redirects |

## Follow-ups

- Custom domain `haccpcalc.com` (DNS)
- Dedicated Stripe account + price for Pro
- Supabase (Auth + Postgres) for saved plans / PDF export (Pro tier)
