"use client";

import { useState } from "react";

export function PricingCta() {
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
        return;
      }
      setMsg(data.error ?? "Checkout is unavailable right now.");
    } catch {
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
