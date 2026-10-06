import { afterEach, expect, it, vi } from "vitest";

const { captured } = vi.hoisted(() => ({ captured: vi.fn() }));
vi.mock("@/lib/observability", () => ({ captureServerError: captured, captureServerMessage: vi.fn() }));

import { POST } from "@/app/api/checkout/route";

afterEach(() => {
  vi.unstubAllGlobals();
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_PRICE_ID;
});

it("reports a Stripe network failure instead of swallowing it", async () => {
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_PRICE_ID = "price_x";
  vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));
  const res = await POST();
  expect(res.status).toBe(502);
  expect(captured).toHaveBeenCalledWith(expect.any(Error), { scope: "checkout" });
});
