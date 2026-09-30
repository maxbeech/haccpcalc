import type { Metadata } from "next";
import Link from "next/link";
import { checkPurchase } from "@/lib/analytics-purchase";
import { fetchCheckoutSession } from "@/lib/stripe-session";
import PurchaseTracker from "@/components/analytics/PurchaseTracker";

// Dynamic on purpose: reads the Stripe session for this visitor at request time, so it
// only reports a purchase once Stripe itself says the session is paid.
export const metadata: Metadata = {
  title: "Payment received",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ session_id?: string }> };

export default async function PricingSuccess({ searchParams }: Props) {
  const { session_id: sessionId } = await searchParams;
  const session = sessionId ? await fetchCheckoutSession(sessionId) : null;
  const purchase = checkPurchase(sessionId, session);

  return (
    <div className="mx-auto max-w-xl space-y-4 text-center">
      <PurchaseTracker check={purchase} />
      {purchase.ok ? (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Payment received</h1>
          <p className="text-lg text-slate-600">
            Thanks for subscribing to HACCPCalc Pro. Questions? Email hello@haccpcalc.com.
          </p>
        </>
      ) : (
        <>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">We could not confirm your payment</h1>
          <p className="text-lg text-slate-600">
            If you were charged, email hello@haccpcalc.com and we will sort it out.
          </p>
        </>
      )}
      <Link href="/" className="inline-block text-sm font-medium text-emerald-700 hover:underline">
        Back to the plan builder
      </Link>
    </div>
  );
}
