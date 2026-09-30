"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics-events";
import type { PurchaseCheck } from "@/lib/analytics-purchase";

// Rendered by /pricing/success once the server has looked the session up with Stripe.
// A reload of the same URL must not count the sale twice, so a sent purchase is
// remembered per transaction id in localStorage. GA also drops a repeated
// transaction_id, this just avoids the second send.

const sentKey = (id: string) => `oh_purchase_sent:${id}`;

function alreadySent(id: string): boolean {
  try {
    return window.localStorage.getItem(sentKey(id)) === "1";
  } catch {
    return false;
  }
}

function remember(id: string) {
  try {
    window.localStorage.setItem(sentKey(id), "1");
  } catch {
    // Private mode or blocked storage: worst case a reload re-sends, and GA dedupes it.
  }
}

export default function PurchaseTracker({ check }: { check: PurchaseCheck }) {
  useEffect(() => {
    if (check.ok) {
      const id = check.params.transaction_id;
      if (alreadySent(id)) return;
      if (trackEvent("purchase", check.params)) remember(id);
    } else {
      trackEvent("purchase_confirmation_failed", { reason: check.reason });
    }
  }, [check]);
  return null;
}
