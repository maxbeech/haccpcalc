import type { AnalyticsEventMap } from "./analytics-events";

// Decides, from what Stripe itself says about a Checkout Session, whether a `purchase`
// event may be sent. The redirect alone is not proof: the success page looks the session
// up server-side, and this only accepts one that is a paid subscription checkout.
// The amount is not pinned: the checkout allows promotion codes, so it can be below the
// list price. Whatever Stripe charged is what gets reported.

export const PRO_ITEM_ID = "haccpcalc-pro";
const PRO_ITEM_NAME = "HACCPCalc Pro";

export interface SessionFacts {
  id: string;
  mode?: string | null;
  payment_status?: string | null;
  amount_total?: number | null;
  currency?: string | null;
}

export type PurchaseCheck =
  | { ok: true; params: AnalyticsEventMap["purchase"] }
  | { ok: false; reason: "no_session_id" | "lookup_failed" | "not_paid" | "unrecognised_session" };

export function checkPurchase(sessionId: string | undefined, session: SessionFacts | null): PurchaseCheck {
  if (!sessionId) return { ok: false, reason: "no_session_id" };
  if (!session) return { ok: false, reason: "lookup_failed" };
  if (session.payment_status !== "paid") return { ok: false, reason: "not_paid" };
  const ours =
    session.mode === "subscription" &&
    session.id === sessionId &&
    typeof session.amount_total === "number" &&
    session.amount_total > 0 &&
    !!session.currency;
  if (!ours) return { ok: false, reason: "unrecognised_session" };
  const value = session.amount_total! / 100;
  return {
    ok: true,
    params: {
      transaction_id: session.id,
      currency: session.currency!.toUpperCase(),
      value,
      items: [{ item_id: PRO_ITEM_ID, item_name: PRO_ITEM_NAME, price: value, quantity: 1 }],
    },
  };
}
