// trackEvent queues on the dataLayer only when a measurement id is set, and queues an
// `arguments` object, the only shape gtag.js processes (a plain array is ignored). The id
// is read when the module loads, so the "unset" case runs this file again in a child.
// Run: tsx test/analytics-track.test.mts
import { execFileSync } from "node:child_process";

let pass = 0, fail = 0;
function check(name: string, cond: boolean, extra = "") {
  if (cond) { pass++; console.log(`  ok   ${name}`); }
  else { fail++; console.error(`  FAIL ${name} ${extra}`); }
}

const win: { dataLayer?: unknown[]; location: { href: string } } = { location: { href: "https://x.test/" } };
(globalThis as unknown as { window: unknown }).window = win;
(globalThis as unknown as { document: unknown }).document = { title: "T" };

if (process.argv[2] === "off") {
  delete process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const { trackEvent } = await import("../lib/analytics-events.ts");
  const recorded = trackEvent("checkout_cancelled", {});
  process.exit(recorded === false && win.dataLayer === undefined ? 0 : 1);
}

const child = (() => {
  try {
    execFileSync(process.execPath, ["--import", "tsx", process.argv[1], "off"], {
      env: { ...process.env, NEXT_PUBLIC_GA_MEASUREMENT_ID: "" },
      stdio: "pipe",
    });
    return true;
  } catch {
    return false;
  }
})();
check("unset id records nothing and pushes no dataLayer", child);

process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID = "G-TEST12345";
const { trackEvent } = await import("../lib/analytics-events.ts");
const { identify, trackPageView } = await import("../lib/openhelm-analytics.tsx");
check("set id records the event", trackEvent("pricing_viewed", {}) === true);
const entry = win.dataLayer![0];
check("entry is an arguments object, not an array", Object.prototype.toString.call(entry) === "[object Arguments]" && !Array.isArray(entry));
check("payload is event, name, params", JSON.stringify(Array.from(entry as ArrayLike<unknown>)) === '["event","pricing_viewed",{}]');

trackEvent("calculator_used", { process: "complex" });
check("event params are passed through",
  JSON.stringify(Array.from(win.dataLayer![1] as ArrayLike<unknown>)) === '["event","calculator_used",{"process":"complex"}]');

trackPageView("/pricing");
const pv = Array.from(win.dataLayer![2] as ArrayLike<unknown>);
check("page_view is queued the same way", pv[0] === "event" && pv[1] === "page_view" && (pv[2] as { page_path: string }).page_path === "/pricing");

identify({ userRef: "12b9377cbe7e5c94", plan: "paid" });
check("identify sets both user properties",
  JSON.stringify(Array.from(win.dataLayer![3] as ArrayLike<unknown>)) === '["set","user_properties",{"oh_user_ref":"12b9377cbe7e5c94","oh_plan":"paid"}]');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
