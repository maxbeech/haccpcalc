import type { Log } from "@sentry/core";

/**
 * One source of truth for the Sentry options shared by the browser, server
 * and edge inits, so the three cannot drift apart.
 */
export const SENTRY_ORG = "maxed-labs";
export const SENTRY_PROJECT = "haccpcalc_web";

/** Console levels forwarded to Sentry Logs. */
export const CONSOLE_LOG_LEVELS = ["log", "info", "warn", "error"] as const;

const EMAIL_RE = /[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g;

/** Mask email addresses in free text; this app never needs them in a log line. */
export function scrubText(value: string): string {
  return value.replace(EMAIL_RE, "[email]");
}

/** Scrub a structured log before it leaves the process. */
export function scrubLog(log: Log): Log {
  const attributes = log.attributes
    ? Object.fromEntries(
        Object.entries(log.attributes).map(([k, v]) => [k, typeof v === "string" ? scrubText(v) : v]),
      )
    : log.attributes;
  return { ...log, message: typeof log.message === "string" ? scrubText(log.message) : log.message, attributes };
}

export function sentryDsn(): string | undefined {
  return process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;
}

/** Options common to every runtime. */
export function baseSentryOptions(dsn: string) {
  return {
    dsn,
    environment: process.env.NODE_ENV,
    tracesSampleRate: 0.05,
    sendDefaultPii: false,
    enableLogs: true,
    beforeSendLog: scrubLog,
  };
}
