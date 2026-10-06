import * as Sentry from "@sentry/nextjs";
import { baseSentryOptions, CONSOLE_LOG_LEVELS } from "@/lib/sentry-options";

/**
 * Browser error reporting. The feedback integration backs the "Send feedback"
 * control in the header and footer, so a report from a person lands in the
 * same Sentry project as the exceptions from the code.
 */
const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    ...baseSentryOptions(dsn),
    // Requests go through our own tunnel route (next.config.ts). Required, not
    // cosmetic: a feedback report with a screenshot is sent as a raw
    // ArrayBuffer with NO Content-Type, so the tunnel would receive an empty
    // body and the submit would fail. See getsentry/sentry-javascript#16112.
    transportOptions: {
      headers: { "content-type": "application/x-sentry-envelope" },
    },
    integrations: [
      Sentry.consoleLoggingIntegration({ levels: [...CONSOLE_LOG_LEVELS] }),
      Sentry.feedbackIntegration({
        colorScheme: "system",
        // Opened by our own control; no floating Sentry button over the page.
        autoInject: false,
        showBranding: false,
        formTitle: "Send feedback",
        submitButtonLabel: "Send feedback",
        messagePlaceholder: "A bug, an idea, anything on your mind.",
        successMessageText: "Thank you. This went straight to the people who can act on it.",
      }),
    ],
  });
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
