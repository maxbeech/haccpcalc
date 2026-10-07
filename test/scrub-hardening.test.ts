import { describe, it, expect } from "vitest";
import { scrubText, scrubEvent, scrubLog } from "../lib/sentry-scrub";

const T = (name: string, fn: () => void) => it(name, fn);
const A = (cond: boolean, msg: string) => expect(cond, msg).toBe(true);

describe("scrubber hardening (SENTRY_STANDARD section 2)", () => {

  /* eslint-disable @typescript-eslint/no-explicit-any -- tests feed deliberately malformed events */
  const tail = (n: number) => "Z9Q7".repeat(Math.ceil(n / 4)).slice(0, n);
  const HEAD = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
  const NEEDLE = /Z9Q7Z9Q7|Q7Z9Q7Z9/;
  const leaks = (out: unknown, ...needles: string[]) => {
    const s = typeof out === "string" ? out : JSON.stringify(out);
    return needles.filter((n) => s.includes(n));
  };

  T("redacts a JWT whose segments are far longer than any bounded quantifier", () => {
    const jwt = `${HEAD}.${tail(3000)}.${tail(3000)}`;
    const out = scrubText(`failed with ${jwt} for the user`);
    A(!NEEDLE.test(out), "jwt tail leaked");
    A(!out.includes(HEAD.slice(0, 20)), "jwt head leaked");
  });

  T("redacts vendor keys of every length, with no tail left behind", () => {
    for (const n of [12, 24, 40, 99, 250, 400, 700, 1500]) {
      for (const prefix of ["sk_live_", "sk_test_", "whsec_", "hlm_sk_", "sntrys_"]) {
        const out = scrubText(`key ${prefix}${tail(n)} end`);
        A(!NEEDLE.test(out), `${prefix}${n} leaked: ${out.slice(0, 80)}`);
      }
    }
  });

  T("redacts bearer tokens of any length, any case, and percent-encoded", () => {
    for (const n of [20, 300, 2500, 5000]) {
      A(!NEEDLE.test(scrubText(`Authorization: Bearer ${tail(n)}`)), `bearer ${n}`);
      A(!NEEDLE.test(scrubText(`bearer ${tail(n)}`)), `lowercase bearer ${n}`);
      A(!NEEDLE.test(scrubText(`Authorization=Bearer%20${tail(n)}`)), `encoded bearer ${n}`);
    }
    A(!scrubText("Authorization: Basic dXNlcjpwYXNzd29yZDEyMzQ1").includes("dXNlcjpw"), "basic auth leaked");
  });

  T("redacts key=value secrets: JSON, escaped JSON, percent-encoded, very long quoted values", () => {
    A(!scrubText('{"password":"hunter2hunter2","access_token":"abcdef123456"}').includes("hunter2"), "json");
    A(!scrubText('{\\"password\\":\\"hunter2hunter2\\"}').includes("hunter2"), "escaped json");
    A(!scrubText("password%3Dhunter2hunter2&x=1").includes("hunter2"), "percent-encoded");
    A(!NEEDLE.test(scrubText(`token=${tail(3000)}`)), "long bare value");
    A(!NEEDLE.test(scrubText(`password: "${tail(800)}"`)), "long quoted value");
    A(!scrubText("postgres://user:s3cretpass@host:5432/db").includes("s3cretpass"), "connection string");
  });

  T("redacts emails (also percent-encoded), phones and URL query strings in text", () => {
    A(!scrubText("to=bob.smith%40example.com").includes("bob.smith"), "encoded email");
    A(!scrubText("call +44 7700 900123 or 07700 900123").includes("900123"), "uk phone");
    A(!scrubText("GET https://x.com/a?token=abc123secret&b=1 failed").includes("abc123secret"), "url query");
    A(!scrubText("GET https://x.com/a#access_token=abc123secret failed").includes("abc123secret"), "url fragment");
    A(!scrubText("GET /api/x?code=abc123secret failed").includes("abc123secret"), "path query");
  });

  T("URL fragments and queries lose all token material (OAuth implicit flow, magic links, codes)", () => {
    const frag = `https://x.test/cb#access_token=abc123tok&id_token=${HEAD}.eyJzdWIiOiIxMjM0NTY3ODkwIn0.sigsig&state=s1`;
    const q = "https://x.test/cb?code=zzcode99&state=s1";
    for (const u of [frag, q, `GET ${frag} failed`, `visit ${q} now`, "see /cb#access_token=abc123tok done", "see /cb?code=zzcode99 done"]) {
      const out = scrubText(u);
      A(!/abc123tok|zzcode99|eyJ|sigsig/.test(out), `URL material survived: ${out}`);
    }
  });

  T("a secret straddling the truncation boundary never leaves its head behind", () => {
    const secret = `sk_live_${"Q7".repeat(40)}`;
    for (const off of [9890, 9894, 9896, 9898, 9899, 9900, 9902, 9906, 9990, 9996, 10000, 10006]) {
      const text = `${"a ".repeat(off / 2)}${secret} tail ${"b".repeat(500)}`;
      const out = scrubText(text);
      A(!out.includes("sk_live_") && !out.includes("Q7Q7"), `secret head survived at ${off}`);
      const jwt = `${"a ".repeat(off / 2)}${HEAD}.eyJzdWIiOiIxMjM0NTY3ODkwIn0.sig`;
      A(!scrubText(jwt).includes("eyJh"), `jwt head survived at ${off}`);
      const bearer = `${"a ".repeat(off / 2)}Bearer ${"Q7".repeat(40)}`;
      A(!scrubText(bearer).includes("Q7Q7"), `bearer head survived at ${off}`);
    }
  });

  T("stays fast on hostile 20k strings (no catastrophic backtracking)", () => {
    const t0 = Date.now();
    for (const bad of ["eyJ".repeat(7000), "a@".repeat(10000), "+1".repeat(10000), "sk_".repeat(7000), "password=".repeat(2200), "Bearer ".repeat(3000), "https://".repeat(2500), "1-".repeat(10000), "a".repeat(200000) + "@"]) {
      scrubText(bad);
    }
    A(Date.now() - t0 < 3000, `hostile input took ${Date.now() - t0}ms`);
  });


  const baseEvent = (): any => ({
    message: "hi bob@example.com sk_live_" + tail(30),
    exception: { values: [{ type: "Error", value: "fail token=abc123xyz987 " + HEAD + ".eyJzdWIiOiIxMjM0NTY3ODkwIn0.sigsigsig", stacktrace: { frames: [{ vars: { password: "pw12345678", ok: 1 } }] } }] },
    request: { url: "https://x.com/p?token=secret123abc", headers: { Authorization: "Bearer abc12345678", Cookie: "s=abc" }, cookies: { s: "abc" }, query_string: "token=secret123abc", data: { password: "pw12345678", note: "bob@example.com" } },
    extra: { a: "bob@example.com", token: "tok" }, tags: { who: "bob@example.com" }, user: { id: "1", email: "bob@example.com" },
    contexts: { foo: { email: "bob@example.com", apiKey: "k" } },
    breadcrumbs: [{ message: "call bob@example.com", data: { url: "https://x.com/?token=bc123secret", token: "bctok" } }],
  });
  const EVENT_NEEDLES = ["bob@example.com", "secret123abc", "bc123secret", "pw12345678", "abc12345678", "abc123xyz987", "bctok", "sk_live_Z9", "eyJzdWIi"];

  T("scrubEvent: no secret or PII survives in message, exception, frame vars, request, extra, tags, contexts, breadcrumbs", () => {
    const out = scrubEvent(baseEvent());
    A(out !== null, "event dropped");
    const authEv: any = scrubEvent({ ...baseEvent(), extra: { auth: "opaque123", "x-auth": "opaque456" } });
    A(authEv !== null && leaks(authEv, "opaque123", "opaque456").length === 0, "auth keys leaked in extra");
    const found = leaks(out, ...EVENT_NEEDLES);
    A(found.length === 0, `leaked: ${found.join(", ")}`);
  });

  T("scrubEvent drops fragments and queries from request.url", () => {
    const out: any = scrubEvent({ ...baseEvent(), request: { url: "https://x.test/cb#access_token=abc123tok&id_token=eyJabcdef.eyJghijkl.sig" } });
    A(out !== null && !/abc123tok|eyJ/.test(JSON.stringify(out.request)), "request.url kept token material");
  });

  T("scrubEvent fails closed when scrubbing throws", () => {
    const bad = baseEvent();
    Object.defineProperty(bad, "extra", { get() { throw new Error("boom"); }, enumerable: true });
    A(scrubEvent(bad) === null, "raw event returned");
  });

  T("feedback: reporter's own contact fields survive, everything else on the event is fully scrubbed", () => {
    const fb = baseEvent();
    fb.type = "feedback";
    fb.user = { name: "Bob", email: "bob@example.com", ip_address: "1.2.3.4" };
    fb.contexts.feedback = { name: "Bob", contact_email: "bob@example.com", message: "it broke, ring me on +44 7700 900123" };
    fb.breadcrumbs = [{ message: "mail carol@example.com or +44 7700 900456", data: { url: "https://x.com/?token=bc123secret" } }];
    fb.extra = { note: "dave@example.com +44 7700 900789" };
    fb.tags = { who: "erin@example.com", phone: "+44 7700 900321" };
    const out: any = scrubEvent(fb);
    A(out !== null, "feedback dropped");
    A(out.contexts.feedback.contact_email === "bob@example.com" && out.contexts.feedback.name === "Bob", "reporter contact fields lost");
    A(out.contexts.feedback.message === "it broke, ring me on +44 7700 900123", "reporter message lost");
    A(out.user.email === "bob@example.com" && out.user.name === "Bob", "reporter user fields lost");
    const rest = JSON.parse(JSON.stringify(out));
    delete rest.contexts.feedback;
    delete rest.user;
    const found = leaks(rest, ...EVENT_NEEDLES, "carol@example.com", "900456", "dave@example.com", "900789", "erin@example.com", "900321", "secret123abc");
    A(found.length === 0, `feedback event bypassed the scrubber: ${found.join(", ")}`);
  });

  T("no argument can switch redaction off in the string scrubber", () => {
    const text = "mail bob@example.com or call +44 7700 900123";
    for (const arg of [true, { keep_email: true }, { keepContact: true }, { feedback: true }, "feedback", 1]) {
      const out = (scrubText as unknown as (s: string, a: unknown) => string)(text, arg);
      A(!out.includes("bob@example.com") && !out.includes("900123"), `redaction disabled by ${JSON.stringify(arg)}: ${out}`);
    }
  });

  T("scrubLog redacts message and attributes (including URLs and nested secrets) and fails closed", () => {
    const out = scrubLog({ level: "info", message: "x bob@example.com Bearer " + tail(30), attributes: { token: "logtok", email: "bob@example.com", url: "https://x.com/?token=lg123secret", nested: { a: "sk_live_" + tail(30) } } } as any);
    A(out !== null && leaks(out, "bob@example.com", "logtok", "lg123secret", "sk_live_Z9").length === 0 && !NEEDLE.test(JSON.stringify(out)), "log leaked");
    const bad: any = { level: "info", message: "x" };
    Object.defineProperty(bad, "attributes", { get() { throw new Error("boom"); }, enumerable: true });
    A(scrubLog(bad) === null, "raw log returned");
  });

});
