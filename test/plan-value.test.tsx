import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { PlanBuilder } from "@/components/PlanBuilder";
import { trackEvent } from "@/lib/analytics-events";
vi.mock("@/lib/analytics-events", () => ({ trackEvent: vi.fn() }));
afterEach(() => { cleanup(); vi.clearAllMocks(); });
describe("delivered plan value", () => {
  it("does not count a seeded plan as delivered personalized value", () => {
    render(<PlanBuilder />);
    expect(trackEvent).not.toHaveBeenCalledWith("plan_generated", expect.anything());
  });
  it("counts a rendered successful customized plan once, without requiring print", () => {
    render(<PlanBuilder />);
    fireEvent.change(screen.getByLabelText("Food / dish name"), { target: { value: "Test chicken" } });
    expect(screen.getAllByText(/Test chicken/).length).toBeGreaterThan(0);
    expect(trackEvent).toHaveBeenCalledWith("plan_generated", { process: "same-day" });
    fireEvent.change(screen.getByLabelText("Food / dish name"), { target: { value: "Updated chicken" } });
    expect(vi.mocked(trackEvent).mock.calls.filter(([event]) => event === "plan_generated")).toHaveLength(1);
  });
  it("does not count a plan with missing cooking requirements", () => {
    render(<PlanBuilder />);
    fireEvent.change(screen.getByLabelText("Cook temperature category"), { target: { value: "" } });
    expect(trackEvent).not.toHaveBeenCalledWith("plan_generated", expect.anything());
  });
});
