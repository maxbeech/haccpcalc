import type { Breadcrumb, ErrorEvent, Log, TransactionEvent } from "@sentry/core";

/**
 * The one shared Sentry scrubber (see _plans/SENTRY_STANDARD.md, section 2).
 *
 * - Covers events, transactions, breadcrumbs and structured logs.
 * - Fails closed: if scrubbing throws, the item is dropped (null), never sent raw.
 * - Strings are truncated to MAX_STRING before any regex runs, and every regex
 *   below uses bounded repetition with no nested or overlapping quantifiers, so
 *   hostile text cannot cause catastrophic backtracking.
 */
export const MAX_STRING = 10_000;
const MAX_DEPTH = 8;
const MAX_NODES = 5_000;

const REDACTED = "[redacted]";

// Order matters: bearer/JWT run before the generic key=value rule.
const PATTERNS: Array<[RegExp, string]> = [
  [/eyJ[\w-]{5,2000}\.[\w-]{5,2000}\.[\w-]{0,2000}/g, "[jwt]"],
  [/\bBearer\s{1,5}[A-Za-z0-9._~+/=-]{8,2000}/gi, "Bearer [token]"],
  [/\b(?:sk|pk|rk|whsec|hlm_sk|sntrys|sntryu|ghp|gho|ghs|xox[abp])_[A-Za-z0-9_-]{8,200}/g, "[api-key]"],
  [/\bsk-[A-Za-z0-9_-]{16,200}/g, "[api-key]"],
  [/\bAKIA[0-9A-Z]{16}\b/g, "[api-key]"],
  [
    /(password|passwd|pwd|secret|token|api[_-]?key|authorization|cookie)(["']?\s{0,3}[:=]\s{0,3}["']?)[^\s"',;&]{1,2000}/gi,
    "$1$2[redacted]",
  ],
  [/[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]{1,63}(?:\.[A-Za-z0-9-]{1,63}){1,8}/g, "[email]"],
  // 10 to 20 phone-ish characters; ISO dates are excluded up front.
  [/(?<![\w.])(?!\d{4}-\d{2}-\d{2})\+?\d[\d ()-]{8,18}\d(?![\d:])/g, "[phone]"],
  // Query string / fragment on any URL embedded in text.
  [/(https?:\/\/[^\s?#"'<>]{1,2000})[?#][^\s"'<>]{0,2000}/g, "$1"],
];

const SENSITIVE_KEY = /pass(?:word|wd)|secret|token|authorization|api[_-]?key|cookie|e-?mail|phone/i;
const URL_KEYS = new Set(["url", "to", "from", "http.url", "url.full", "http.target"]);
const QUERY_KEYS = new Set(["url.query", "http.query", "query_string", "query", "http.fragment"]);
const CONTACT_KEYS = new Set(["name", "email", "contact_email"]);

/** Truncate, then mask emails, phones, tokens, keys and URL query strings. */
export function scrubText(value: string): string {
  let out = value.length > MAX_STRING ? value.slice(0, MAX_STRING) : value;
  for (const [re, replacement] of PATTERNS) out = out.replace(re, replacement);
  return out;
}

/** Remove the query string and fragment from a URL or path. */
export function stripQuery(url: string): string {
  const s = url.length > MAX_STRING ? url.slice(0, MAX_STRING) : url;
  const cut = s.search(/[?#]/);
  return scrubText(cut === -1 ? s : s.slice(0, cut));
}

function scrubDeep(value: unknown, depth: number, budget: { n: number }): unknown {
  if (typeof value === "string") return scrubText(value);
  if (value === null || typeof value !== "object") return value;
  if (depth > MAX_DEPTH || ++budget.n > MAX_NODES) return "[truncated]";
  if (Array.isArray(value)) return value.slice(0, 200).map((v) => scrubDeep(v, depth + 1, budget));
  const out: Record<string, unknown> = {};
  for (const [key, v] of Object.entries(value as Record<string, unknown>)) {
    const k = key.length > 100 ? key.slice(0, 100) : key;
    if (QUERY_KEYS.has(k)) continue;
    if (typeof v === "string" && URL_KEYS.has(k)) out[key] = stripQuery(v);
    else if (SENSITIVE_KEY.test(k) && v !== null && typeof v !== "object") out[key] = REDACTED;
    else out[key] = scrubDeep(v, depth + 1, budget);
  }
  return out;
}

function scrubObject<T>(value: T): T {
  return scrubDeep(value, 0, { n: 0 }) as T;
}

/** Scrub an error event. Feedback events keep the submitter's name and email. */
export function scrubEvent<T extends ErrorEvent | TransactionEvent>(event: T): T {
  const isFeedback = (event as { type?: string }).type === "feedback";
  const e = event as unknown as {
    contexts?: { feedback?: Record<string, unknown> };
    user?: Record<string, unknown>;
  };
  // Feedback: stash the reporter's own contexts.feedback (name, email, message)
  // and user name/email, scrub everything else as normal, then restore them.
  const feedback = isFeedback ? e.contexts?.feedback : undefined;
  const contact: Record<string, unknown> = {};
  if (isFeedback) {
    for (const k of CONTACT_KEYS) if (e.user?.[k] !== undefined) contact[k] = e.user[k];
  }
  const out = scrubObject(event) as unknown as {
    contexts?: { feedback?: Record<string, unknown> };
    user?: Record<string, unknown>;
    request?: Record<string, unknown>;
  };
  if (isFeedback) {
    if (feedback) (out.contexts ??= {}).feedback = feedback;
    if (Object.keys(contact).length) Object.assign((out.user ??= {}), contact);
  } else if (out.user) {
    delete out.user.email;
    delete out.user.ip_address;
    delete out.user.username;
  }
  if (out.request) {
    delete out.request.cookies;
    delete out.request.data;
    delete out.request.query_string;
  }
  return out as unknown as T;
}

/** beforeSend: fail closed. */
export function beforeSend(event: ErrorEvent): ErrorEvent | null {
  try {
    return scrubEvent(event);
  } catch {
    return null;
  }
}

/** beforeSendTransaction: strips query strings from the request url and span data. */
export function beforeSendTransaction(event: TransactionEvent): TransactionEvent | null {
  try {
    return scrubEvent(event);
  } catch {
    return null;
  }
}

/** beforeBreadcrumb: scrub message and data, strip query strings from url/to/from. */
export function beforeBreadcrumb(crumb: Breadcrumb): Breadcrumb | null {
  try {
    return scrubObject(crumb);
  } catch {
    return null;
  }
}

/** beforeSendLog: scrub message and attributes; drop the log on failure. */
export function scrubLog(log: Log): Log | null {
  try {
    return scrubObject(log);
  } catch {
    return null;
  }
}
