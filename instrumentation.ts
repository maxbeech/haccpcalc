import * as Sentry from "@sentry/nextjs";
import { baseSentryOptions, CONSOLE_LOG_LEVELS, sentryDsn } from "@/lib/sentry-options";

/**
 * Server and edge error reporting. Next calls `register()` once per runtime.
 * Without a DSN the app runs normally and reports nothing.
 */
export async function register() {
  const dsn = sentryDsn();
  if (!dsn) return;

  Sentry.init({
    ...baseSentryOptions(dsn),
    integrations: [Sentry.consoleLoggingIntegration({ levels: [...CONSOLE_LOG_LEVELS] })],
  });
}

// Reports errors thrown while rendering a server component or route handler.
export const onRequestError = Sentry.captureRequestError;
