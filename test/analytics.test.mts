// Analytics contract: user ref vector, event names, purchase confirmation, Stripe session
// helpers and failure codes. Run: tsx test/analytics.test.mts
import { userRefFor, isValidEventName } from "../lib/openhelm-analytics-mp.ts";
import { checkPurchase, PRO_ITEM_ID } from "../lib/analytics-purchase.ts";
import { analyticsFailureReason } from "../lib/analytics-events.ts";
import { checkoutBody, fetchCheckoutSession } from "../lib/stripe-session.ts";
import { readFileSync } from "node:fs";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${extra}`); }
}

// --- user ref (pinned contract vector) ---
check("userRefFor matches the contract vector",
  (await userRefFor("00000000-0000-0000-0000-000000000000")) === "12b9377cbe7e5c94");
check("userRefFor is 16 hex chars", /^[0-9a-f]{16}$/.test(await userRefFor("someone")));

// --- every event name in the typed map is a legal GA4 name ---
const src = readFileSync(new URL("../lib/analytics-events.ts", import.meta.url), "utf8");
const mapBody = src.slice(src.indexOf("interface AnalyticsEventMap"), src.indexOf("export type AnalyticsEventName"));
const names = [...mapBody.matchAll(/^  ([a-z_]+): /gm)].map((m) => m[1]);
check("event map lists the journey events",
  ["calculator_used", "plan_print_started", "pricing_viewed", "begin_checkout", "purchase"].every((n) => names.includes(n)), names.join(","));
for (const n of names) check(`event name ${n} is legal (<=40, snake_case)`, isValidEventName(n) && n === n.toLowerCase());

// --- purchase confirmation ---
const paid = { id: "cs_test_abc12345", mode: "subscription", payment_status: "paid", amount_total: 2900, currency: "usd" };
const ok = checkPurchase(paid.id, paid);
check("paid subscription session confirms", ok.ok);
if (ok.ok) {
  check("purchase carries the session as transaction_id", ok.params.transaction_id === paid.id);
  check("purchase value is dollars, currency upper-case", ok.params.value === 29 && ok.params.currency === "USD");
  check("purchase has one Pro item", ok.params.items.length === 1 && ok.params.items[0].item_id === PRO_ITEM_ID && ok.params.items[0].price === 29);
  check("purchase params hold no email or name", !/@|name|email/i.test(Object.keys(ok.params).join(",")));
}
const discounted = checkPurchase(paid.id, { ...paid, amount_total: 1450 });
check("a promotion-code amount is reported as charged", discounted.ok && discounted.params.value === 14.5);
const refused = (id: string | undefined, s: Parameters<typeof checkPurchase>[1]) => JSON.stringify(checkPurchase(id, s));
check("no session id is refused", refused(undefined, null) === '{"ok":false,"reason":"no_session_id"}');
check("failed lookup is refused", refused("cs_x", null) === '{"ok":false,"reason":"lookup_failed"}');
check("unpaid session is refused", refused(paid.id, { ...paid, payment_status: "unpaid" }) === '{"ok":false,"reason":"not_paid"}');
check("no-payment-required (free coupon) is refused", refused(paid.id, { ...paid, payment_status: "no_payment_required" }) === '{"ok":false,"reason":"not_paid"}');
check("one-off payment session is refused", refused(paid.id, { ...paid, mode: "payment" }) === '{"ok":false,"reason":"unrecognised_session"}');
check("session id that differs from the URL is refused", refused("cs_other", paid) === '{"ok":false,"reason":"unrecognised_session"}');

// --- failure codes ---
check("http status becomes http_<status>", analyticsFailureReason(502) === "http_502");
check("no status is network_error", analyticsFailureReason(null) === "network_error");

// --- checkout session body: success returns to the confirming page with the session id ---
const body = checkoutBody("https://example.test", "price_123");
check("success_url is the confirming page with the session placeholder",
  body.get("success_url") === "https://example.test/pricing/success?session_id={CHECKOUT_SESSION_ID}");
check("cancel_url is unchanged", body.get("cancel_url") === "https://example.test/pricing?status=cancel");
check("still a subscription with promo codes", body.get("mode") === "subscription" && body.get("allow_promotion_codes") === "true");

// --- Stripe session lookup ---
const stub = (status: number, json: unknown) =>
  (async () => ({ ok: status < 400, status, json: async () => json })) as unknown as typeof fetch;
const calls: string[] = [];
const spy = (async (url: string) => { calls.push(url); return { ok: true, json: async () => ({ ...paid, customer_details: { email: "x@y.z" } }) }; }) as unknown as typeof fetch;
const got = await fetchCheckoutSession(paid.id, "sk_test", spy);
check("lookup returns only the facts the check needs", !!got && !("customer_details" in got) && got.amount_total === 2900);
check("lookup asks Stripe for that session", calls[0] === `https://api.stripe.com/v1/checkout/sessions/${paid.id}`);
check("lookup without a secret is null and makes no call", (await fetchCheckoutSession(paid.id, undefined, spy)) === null && calls.length === 1);
check("a malformed id never reaches Stripe", (await fetchCheckoutSession("../customers", "sk_test", spy)) === null && calls.length === 1);
check("a Stripe error is null", (await fetchCheckoutSession(paid.id, "sk_test", stub(404, {}))) === null);
check("a network error is null",
  (await fetchCheckoutSession(paid.id, "sk_test", (async () => { throw new Error("offline"); }) as unknown as typeof fetch)) === null);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
