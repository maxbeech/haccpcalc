"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";

// Last-resort boundary: report the crash before showing the fallback.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#f8fafc", fontFamily: "sans-serif" }}>
        <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "2rem", textAlign: "center" }}>
          <div style={{ maxWidth: 480 }}>
            <h1 style={{ fontSize: "1.5rem", color: "#0f172a" }}>Something went wrong</h1>
            <p style={{ color: "#64748b" }}>
              We have been told about it. Please try again, and if it keeps happening email hello@haccpcalc.com.
            </p>
            {error.digest && <p style={{ fontFamily: "monospace", fontSize: 12, color: "#94a3b8" }}>Error ID: {error.digest}</p>}
            <button
              onClick={reset}
              style={{ padding: "0.6rem 1.4rem", background: "#059669", color: "#fff", border: 0, borderRadius: 8, fontWeight: 600, cursor: "pointer" }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
