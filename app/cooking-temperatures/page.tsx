import type { Metadata } from "next";
import Link from "next/link";
import { COOK_RULE_LIST, HOLDING, COOLING, REHEATING, DATE_MARKING, DANGER_ZONE, ftoC } from "@/lib/data/temps";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import { COOK_FAQ } from "@/lib/faq";

export const metadata: Metadata = {
  title: "FDA Food Code Cooking Temperatures Chart (2022)",
  description:
    "Free FDA Food Code 2022 minimum internal cooking temperatures chart: poultry 165°F, ground meat 155°F, whole-muscle meat and fish 145°F, plus holding, cooling and reheating rules.",
  alternates: { canonical: "/cooking-temperatures" },
};

export default function CookingTemps() {
  return (
    <div className="space-y-10">
      <JsonLd
        data={[
          faqLd(COOK_FAQ),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Cooking temperatures", path: "/cooking-temperatures" },
          ]),
        ]}
      />

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">FDA Food Code cooking temperatures (2022)</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Minimum internal cooking temperatures from the FDA Food Code 2022, with the lethality-equivalent
          time/temperature combinations the Code allows. Always verify with a calibrated probe thermometer in
          the thickest part of the food.
        </p>
      </section>

      <section className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-semibold">Food</th>
              <th className="px-3 py-2 font-semibold">Minimum (°F / °C)</th>
              <th className="px-3 py-2 font-semibold">Hold</th>
              <th className="px-3 py-2 font-semibold">Alternatives</th>
              <th className="px-3 py-2 font-semibold">Citation</th>
            </tr>
          </thead>
          <tbody>
            {COOK_RULE_LIST.map((r) => (
              <tr key={r.category} className="border-b border-slate-100 align-top">
                <td className="px-3 py-2.5 font-medium text-slate-800">
                  {r.label}
                  <span className="mt-0.5 block text-[11px] text-slate-400">{r.appliesTo.slice(0, 3).join(", ")}</span>
                </td>
                <td className="px-3 py-2.5 text-slate-800">{r.minTempF}°F / {ftoC(r.minTempF)}°C</td>
                <td className="px-3 py-2.5 text-slate-600">{r.holdSeconds}s</td>
                <td className="px-3 py-2.5 text-slate-600">
                  {r.alternatives?.length
                    ? r.alternatives.map((a) => `${a.tempF}°F/${a.holdSeconds}s`).join(", ")
                    : "—"}
                </td>
                <td className="px-3 py-2.5 text-[11px] text-slate-400">{r.citation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Fact title="Temperature danger zone">{DANGER_ZONE.lowF}°F – {DANGER_ZONE.highF}°F — limit TCS food to 4 cumulative hours</Fact>
        <Fact title="Cold / hot holding">Cold ≤ {HOLDING.coldHoldMaxF}°F · Hot ≥ {HOLDING.hotHoldMinF}°F</Fact>
        <Fact title="Two-stage cooling">{COOLING.stage1FromF}°F→{COOLING.stage1ToF}°F in {COOLING.stage1Hours}h, then →{COOLING.stage2ToF}°F within {COOLING.totalHours}h total</Fact>
        <Fact title="Reheating for hot holding">≥ {REHEATING.minTempF}°F for {REHEATING.holdSeconds}s within {REHEATING.withinHours}h</Fact>
        <Fact title="RTE date marking">Use within {DATE_MARKING.maxDays} days at ≤ {DATE_MARKING.atOrBelowF}°F (prep day = day 1)</Fact>
        <Fact title="Build a plan">
          <Link href="/#builder" className="text-emerald-700 underline">Open the HACCP plan builder →</Link>
        </Fact>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
        <div className="space-y-3">
          {COOK_FAQ.map((qa) => (
            <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

function Fact({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-sm text-slate-800">{children}</p>
    </div>
  );
}
