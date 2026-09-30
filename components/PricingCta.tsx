"use client";

import { useState } from "react";
import { analyticsFailureReason, trackEvent } from "@/lib/analytics-events";

// List price shown on /pricing; a promotion code can lower what Stripe finally charges.
const PRO_PRICE_USD = 29;

export function PricingCta() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.url) {
        trackEvent("begin_checkout", { currency: "USD", value: PRO_PRICE_USD });
        window.location.href = data.url;
        return;
      }
      trackEvent("checkout_failed", { reason: res.ok ? "no_checkout_url" : analyticsFailureReason(res.status) });
      setMsg(data.error ?? "Checkout is unavailable right now.");
    } catch {
      trackEvent("checkout_failed", { reason: analyticsFailureReason(null) });
      setMsg("Could not reach checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5">
      <button
        type="button"
        onClick={go}
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Starting…" : "Upgrade to Pro"}
      </button>
      {msg && <p className="mt-2 text-center text-sm text-slate-500">{msg}</p>}
    </div>
  );
}
