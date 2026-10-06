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
    const out = scrubLog({ level: "info", message: "x@y.io", attributes: { to: "x@y.io", n: 1 } })!;
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

import {
  beforeBreadcrumb,
  beforeSend,
  beforeSendTransaction,
  MAX_STRING,
  scrubLog as scrubLogShared,
} from "@/lib/sentry-scrub";
import { safeContext } from "@/lib/observability";

describe("scrubber: secrets", () => {
  const samples = [
    "sk_live_abcdefghijklmnop1234",
    "pk_test_abcdefghijklmnop1234",
    "whsec_abcdefghijklmnop1234",
    "hlm_sk_abcdefghijklmnop1234",
    "sntrys_abcdefghijklmnop1234",
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTYifQ.SflKxwRJSMeKKF2QT4fw",
    "Bearer abcdefgh12345678",
  ];
  it.each(samples)("redacts %s in text", (secret) => {
    expect(scrubText(`error with ${secret} here`)).not.toContain(secret.slice(-12));
  });
  it("redacts emails, phones and key=value secrets", () => {
    const t = scrubText('mail a@b.co call +44 7700 900123 password=hunter2 {"token":"abc123"}');
    expect(t).not.toMatch(/a@b\.co|7700|hunter2|abc123/);
  });
  it("keeps ISO dates", () => {
    expect(scrubText("at 2026-10-07 12:00")).toContain("2026-10-07");
  });
  it("redacts sensitive attributes and nested objects in logs", () => {
    const out = scrubLogShared({
      level: "info",
      message: "hi sk_live_abcdefghijklmnop1234",
      attributes: { password: "x", nested: { authorization: "y", ok: 1 } },
    } as never) as { message: string; attributes: Record<string, unknown> };
    expect(JSON.stringify(out)).not.toMatch(/sk_live|"x"|"y"/);
  });
});

describe("scrubber: long adversarial input", () => {
  it("truncates and finishes quickly", () => {
    const inputs = [
      "a".repeat(2_000_000),
      "a@".repeat(500_000),
      "1 ".repeat(1_000_000),
      "http://" + "a".repeat(1_000_000),
      "password=" + "=".repeat(1_000_000),
      "eyJ" + "a".repeat(1_000_000),
    ];
    const start = performance.now();
    for (const s of inputs) expect(scrubText(s).length).toBeLessThanOrEqual(MAX_STRING + 20);
    expect(performance.now() - start).toBeLessThan(1000);
  });
});

describe("scrubber: fail closed", () => {
  const bad = () => ({
    get message(): string {
      throw new Error("boom");
    },
  });
  it("drops events, transactions, breadcrumbs and logs when scrubbing throws", () => {
    expect(beforeSend(bad() as never)).toBeNull();
    expect(beforeSendTransaction(bad() as never)).toBeNull();
    expect(beforeBreadcrumb(bad() as never)).toBeNull();
    expect(scrubLogShared(bad() as never)).toBeNull();
  });
  it("keeps name and email on feedback events", () => {
    const out = beforeSend({
      type: "feedback",
      contexts: { feedback: { name: "Ann", contact_email: "ann@x.com", message: "mail me bob@y.com" } },
      user: { email: "ann@x.com" },
    } as never) as never as { contexts: { feedback: Record<string, string> }; user: Record<string, string> };
    expect(out.contexts.feedback.name).toBe("Ann");
    expect(out.contexts.feedback.contact_email).toBe("ann@x.com");
    expect(out.user.email).toBe("ann@x.com");
    expect(out.contexts.feedback.message).toBe("mail me bob@y.com");
  });
  it("still scrubs breadcrumbs, request and other contexts on feedback events", () => {
    const out = beforeSend({
      type: "feedback",
      contexts: { feedback: { name: "Ann", contact_email: "ann@x.com", message: "hello" }, other: { token: "t0k" } },
      breadcrumbs: [{ category: "navigation", data: { url: "https://a.com/p?token=abc" } }],
      request: { url: "https://a.com/p?token=abc", cookies: { s: "secret" } },
      user: { id: "1", email: "ann@x.com" },
    } as never) as never as {
      contexts: { feedback: Record<string, string>; other: Record<string, string> };
      breadcrumbs: Array<{ data: { url: string } }>;
      request: Record<string, unknown>;
    };
    expect(out.breadcrumbs[0].data.url).toBe("https://a.com/p");
    expect(out.request).toEqual({ url: "https://a.com/p" });
    expect(out.contexts.other.token).toBe("[redacted]");
    expect(out.contexts.feedback).toEqual({ name: "Ann", contact_email: "ann@x.com", message: "hello" });
  });
  it("strips user email from ordinary events", () => {
    const out = beforeSend({ message: "x", user: { id: "1", email: "a@b.co" } } as never) as never as { user: Record<string, string> };
    expect(out.user).toEqual({ id: "1" });
  });
});

describe("scrubber: breadcrumbs and transactions", () => {
  it("strips query strings from breadcrumb url/to/from and scrubs message", () => {
    const out = beforeBreadcrumb({
      message: "went to https://a.com/x?token=abc for a@b.co",
      data: { url: "/p?email=a@b.co", to: "/q?x=1#h", from: "/r?y=2", status: 200 },
    }) as { message: string; data: Record<string, unknown> };
    expect(out.message).toBe("went to https://a.com/x for [email]");
    expect(out.data).toEqual({ url: "/p", to: "/q", from: "/r", status: 200 });
  });
  it("strips request url and span http.url / url.query", () => {
    const out = beforeSendTransaction({
      type: "transaction",
      request: { url: "https://a.com/plans?id=9", cookies: { a: "b" } },
      spans: [{ description: "GET https://s.com/v?k=1", data: { "http.url": "https://s.com/v?k=1", "url.query": "k=1", "http.status_code": 200 } }],
    } as never) as never as {
      request: Record<string, unknown>;
      spans: Array<{ description: string; data: Record<string, unknown> }>;
    };
    expect(out.request).toEqual({ url: "https://a.com/plans" });
    expect(out.spans[0].description).toBe("GET https://s.com/v");
    expect(out.spans[0].data).toEqual({ "http.url": "https://s.com/v", "http.status_code": 200 });
  });
  it("is wired into the shared options", () => {
    const o = baseSentryOptions("https://k@example.ingest.sentry.io/1");
    expect(o.beforeSend).toBe(beforeSend);
    expect(o.beforeSendTransaction).toBe(beforeSendTransaction);
    expect(o.beforeBreadcrumb).toBe(beforeBreadcrumb);
  });
});

describe("safeContext", () => {
  it("keeps ids, codes, counts; omits free text and objects", () => {
    expect(safeContext({ scope: "checkout", status: 502, code: "card_declined", msg: "Ann said hello there", o: { a: 1 } })).toEqual({
      scope: "checkout",
      status: 502,
      code: "card_declined",
      msg: "[omitted]",
      o: "[omitted]",
    });
  });
});
