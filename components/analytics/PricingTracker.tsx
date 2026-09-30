"use client";

import { useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/analytics-events";

// Fires `pricing_viewed` once per mount, and `checkout_cancelled` when Stripe sent the
// visitor back via the cancel URL (?status=cancel). Mount inside <Suspense> so the
// pricing page stays statically rendered (useSearchParams).
export default function PricingTracker() {
  const params = useSearchParams();
  const cancelled = params?.get("status") === "cancel";
  const viewed = useRef(false);
  const cancelSent = useRef(false);

  useEffect(() => {
    if (viewed.current) return;
    viewed.current = true;
    trackEvent("pricing_viewed", {});
  }, []);

  useEffect(() => {
    if (!cancelled || cancelSent.current) return;
    cancelSent.current = true;
    trackEvent("checkout_cancelled", {});
  }, [cancelled]);

  return null;
}
