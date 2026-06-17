// Pure presentational renderer for a HaccpPlan. Used by the interactive builder
// and by the programmatic food-type pages (which render a seeded plan server-side
// for SEO). No client state here.
import type { HaccpPlan } from "@/lib/calc/haccp";

export function PlanView({ plan }: { plan: HaccpPlan }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-lg font-semibold text-slate-900">
          HACCP plan: <span className="text-emerald-700">{plan.foodName}</span>
        </h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
          {plan.processLabel}
        </span>
        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
          {plan.ccpCount} critical control point{plan.ccpCount === 1 ? "" : "s"}
        </span>
      </div>

      {plan.warnings.map((w) => (
        <p key={w} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800">
          {w}
        </p>
      ))}

      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[720px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-semibold">Process step</th>
              <th className="px-3 py-2 font-semibold">Hazard</th>
              <th className="px-3 py-2 font-semibold">Critical limit</th>
              <th className="px-3 py-2 font-semibold">Monitoring</th>
              <th className="px-3 py-2 font-semibold">Corrective action</th>
            </tr>
          </thead>
          <tbody>
            {plan.rows.map((r) => (
              <tr key={r.step} className={`border-b border-slate-100 align-top ${r.isCcp ? "bg-emerald-50/40" : ""}`}>
                <td className="px-3 py-2.5 font-medium text-slate-800">
                  {r.stepLabel}
                  {r.isCcp && (
                    <span className="ml-1.5 rounded bg-emerald-600 px-1.5 py-0.5 text-[10px] font-bold text-white">
                      CCP-{r.ccpNumber}
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-slate-600">{r.hazard}</td>
                <td className="px-3 py-2.5 text-slate-800">
                  <span className={r.isCcp ? "font-medium" : ""}>{r.criticalLimit}</span>
                  <span className="mt-1 block text-[11px] text-slate-400">{r.citation}</span>
                </td>
                <td className="px-3 py-2.5 text-slate-600">{r.monitoring}</td>
                <td className="px-3 py-2.5 text-slate-600">{r.correctiveAction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Principle 6 — Verification</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {plan.verification.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-sm font-semibold text-slate-900">Principle 7 — Record-keeping</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
            {plan.recordkeeping.map((v) => (
              <li key={v}>{v}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
