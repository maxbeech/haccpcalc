"use client";

import { useCallback, useState } from "react";
import { SITE } from "@/lib/site";

/**
 * The user-facing feedback control. Opens Sentry's feedback dialog so a report
 * lands in the same project as the exceptions. The SDK is imported lazily so a
 * footer link does not pull the browser SDK into the initial bundle.
 */
export function FeedbackButton({
  className = "",
  variant = "link",
}: {
  className?: string;
  variant?: "link" | "pill";
}) {
  const [unavailable, setUnavailable] = useState(false);

  const open = useCallback(async () => {
    const Sentry = await import("@sentry/nextjs");
    const feedback = Sentry.getFeedback();
    if (!feedback) {
      // No DSN on this deployment: say so rather than do nothing.
      console.error("[feedback] Sentry feedback is not configured (NEXT_PUBLIC_SENTRY_DSN missing).");
      setUnavailable(true);
      return;
    }
    const form = await feedback.createForm();
    form.appendToDom();
    form.open();
  }, []);

  if (unavailable) {
    return (
      <span className={className}>
        Feedback is not set up here. Email{" "}
        <a className="underline underline-offset-2" href={`mailto:${SITE.email}`}>
          {SITE.email}
        </a>
        .
      </span>
    );
  }

  const styles =
    variant === "pill"
      ? "rounded-lg border border-slate-300 bg-white px-3 py-1.5 font-medium text-slate-700 hover:border-slate-400 hover:text-slate-900"
      : "hover:text-slate-900";

  return (
    <button type="button" data-testid="feedback-button" onClick={open} className={`${styles} ${className}`}>
      Send feedback
    </button>
  );
}
