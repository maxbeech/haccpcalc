import { beforeBreadcrumb, beforeSend, beforeSendTransaction, scrubLog } from "@/lib/sentry-scrub";

/**
 * One source of truth for the Sentry options shared by the browser, server
 * and edge inits, so the three cannot drift apart.
 */
export const SENTRY_ORG = "maxed-labs";
export const SENTRY_PROJECT = "haccpcalc_web";

/** Console levels forwarded to Sentry Logs. */
export const CONSOLE_LOG_LEVELS = ["log", "info", "warn", "error"] as const;

export { scrubText, scrubLog } from "@/lib/sentry-scrub";

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
    beforeSend,
    beforeSendTransaction,
    beforeBreadcrumb,
    beforeSendLog: scrubLog,
  };
}
