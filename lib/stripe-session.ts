import type { SessionFacts } from "./analytics-purchase";

// Stripe Checkout helpers shared by /api/checkout and the /pricing/success page. Plain
// fetch against the REST API, as the checkout route already does (no Stripe SDK here).

/** Stripe replaces the placeholder with the real session id on the redirect. */
export function checkoutBody(base: string, price: string): URLSearchParams {
  return new URLSearchParams({
    mode: "subscription",
    "line_items[0][price]": price,
    "line_items[0][quantity]": "1",
    success_url: `${base}/pricing/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${base}/pricing?status=cancel`,
    allow_promotion_codes: "true",
  });
}

const SESSION_ID = /^cs_[A-Za-z0-9_]{8,200}$/;

/** Look a Checkout Session up with Stripe. Null on any failure; never throws. */
export async function fetchCheckoutSession(
  id: string,
  secret: string | undefined = process.env.STRIPE_SECRET_KEY,
  fetcher: typeof fetch = fetch,
): Promise<SessionFacts | null> {
  if (!secret || !SESSION_ID.test(id)) return null;
  try {
    const res = await fetcher(`https://api.stripe.com/v1/checkout/sessions/${id}`, {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const s = await res.json();
    return {
      id: s.id,
      mode: s.mode,
      payment_status: s.payment_status,
      amount_total: s.amount_total,
      currency: s.currency,
    };
  } catch {
    return null;
  }
}
