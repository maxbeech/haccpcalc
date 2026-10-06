// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";

const { form, sentry, scopeCapture } = vi.hoisted(() => {
  const form = { appendToDom: vi.fn(), open: vi.fn() };
  const feedback = { createForm: vi.fn(async () => form) };
  const scopeCapture = vi.fn();
  const sentry = {
    getFeedback: vi.fn((): unknown => feedback),
    withScope: vi.fn((cb: (s: unknown) => void) =>
      cb({ setTag: vi.fn(), setExtra: vi.fn(), setLevel: vi.fn(), captureException: scopeCapture, captureMessage: vi.fn() }),
    ),
  };
  return { form, sentry, scopeCapture };
});
vi.mock("@sentry/nextjs", () => sentry);

import { FeedbackButton } from "@/components/FeedbackButton";
import { captureServerError } from "@/lib/observability";
import { baseSentryOptions, scrubLog, scrubText, CONSOLE_LOG_LEVELS } from "@/lib/sentry-options";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  delete process.env.SENTRY_DSN;
  delete process.env.NEXT_PUBLIC_SENTRY_DSN;
});

describe("FeedbackButton", () => {
  it("renders and opens the Sentry feedback form", async () => {
    render(<FeedbackButton />);
    fireEvent.click(screen.getByTestId("feedback-button"));
    await waitFor(() => expect(form.open).toHaveBeenCalled());
    expect(form.appendToDom).toHaveBeenCalled();
  });

  it("says so when feedback is not configured", async () => {
    sentry.getFeedback.mockReturnValueOnce(undefined);
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    render(<FeedbackButton />);
    fireEvent.click(screen.getByTestId("feedback-button"));
    await waitFor(() => expect(screen.getByText(/not set up here/)).toBeTruthy());
    expect(err).toHaveBeenCalled();
    err.mockRestore();
  });
});

describe("sentry options", () => {
  it("enables logs, forwards all console levels, scrubs", () => {
    const o = baseSentryOptions("https://k@example.ingest.sentry.io/1");
    expect(o.enableLogs).toBe(true);
    expect(o.beforeSendLog).toBe(scrubLog);
    expect(o.sendDefaultPii).toBe(false);
    expect([...CONSOLE_LOG_LEVELS]).toEqual(["log", "info", "warn", "error"]);
  });
  it("masks email addresses in log text and attributes", () => {
    expect(scrubText("mail a.b@c.com now")).toBe("mail [email] now");
    const out = scrubLog({ level: "info", message: "x@y.io", attributes: { to: "x@y.io", n: 1 } });
    expect(out.message).toBe("[email]");
    expect(out.attributes).toEqual({ to: "[email]", n: 1 });
  });
});

describe("captureServerError", () => {
  it("sends to Sentry when a DSN is set", () => {
    process.env.SENTRY_DSN = "https://k@example.ingest.sentry.io/1";
    captureServerError(new Error("boom"), { scope: "checkout" });
    expect(sentry.withScope).toHaveBeenCalled();
    expect(scopeCapture).toHaveBeenCalled();
  });
  it("falls back visibly to the console without a DSN", () => {
    const err = vi.spyOn(console, "error").mockImplementation(() => {});
    captureServerError(new Error("boom"), { scope: "checkout" });
    expect(err).toHaveBeenCalled();
    expect(sentry.withScope).not.toHaveBeenCalled();
    err.mockRestore();
  });
});
