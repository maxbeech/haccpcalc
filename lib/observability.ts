import * as Sentry from "@sentry/nextjs";
import { sentryDsn } from "@/lib/sentry-options";

/**
 * The one way server code reports a problem. With no DSN configured it falls
 * back to a console line (never throws inside an error handler).
 */
export function captureServerError(err: unknown, context: Record<string, unknown> = {}): void {
  const scope = typeof context.scope === "string" ? context.scope : "server";
  try {
    if (sentryDsn()) {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        for (const [k, v] of Object.entries(context)) {
          if (k !== "scope") s.setExtra(k, v);
        }
        s.captureException(err instanceof Error ? err : new Error(String(err)));
      });
      return;
    }
  } catch {
    // Reporting an error must never become an error.
  }
  console.error(`[${scope}]`, err, context);
}

/** Report a handled failure that is not an exception. */
export function captureServerMessage(message: string, context: Record<string, unknown> = {}): void {
  const scope = typeof context.scope === "string" ? context.scope : "server";
  try {
    if (sentryDsn()) {
      Sentry.withScope((s) => {
        s.setTag("scope", scope);
        s.setLevel("warning");
        for (const [k, v] of Object.entries(context)) {
          if (k !== "scope") s.setExtra(k, v);
        }
        s.captureMessage(message);
      });
      return;
    }
  } catch {
    /* see above */
  }
  console.warn(`[${scope}] ${message}`, context);
}
