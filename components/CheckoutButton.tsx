"use client";

import { useState } from "react";

// Starts a Stripe Checkout session via /api/checkout. The route degrades to a
// friendly 503 message when STRIPE_* env vars are absent, which we surface here
// instead of failing — so the page is useful before billing is wired.
export default function CheckoutButton({ label = "Start HACCPCalc Pro — $29/mo" }: { label?: string }) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function start() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setMsg(data.error ?? "Checkout is not available yet — please check back soon.");
    } catch {
      setMsg("Could not start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        onClick={start}
        disabled={loading}
        className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {loading ? "Starting…" : label}
      </button>
      {msg && <p className="mt-2 text-center text-xs text-slate-500">{msg}</p>}
    </div>
  );
}
