"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Segment boundary: a render error in any page is reported, then recoverable.
export default function SegmentError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <h1 className="text-xl font-semibold text-slate-900">Something went wrong</h1>
      <p className="mt-2 text-sm text-slate-600">This has been reported. Please try again.</p>
      <button
        onClick={reset}
        className="mt-5 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
      >
        Try again
      </button>
    </div>
  );
}
