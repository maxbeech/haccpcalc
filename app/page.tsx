import Link from "next/link";
import { PlanBuilder } from "@/components/PlanBuilder";
import { JsonLd, softwareAppLd, faqLd } from "@/components/JsonLd";
import { HOME_FAQ } from "@/lib/faq";
import { FOOD_TYPES } from "@/lib/data/foodTypes";
import { COOK_RULE_LIST } from "@/lib/data/temps";
import { SITE } from "@/lib/site";

export default function Home() {
  return (
    <div className="space-y-12">
      <JsonLd data={[softwareAppLd(), faqLd(HOME_FAQ)]} />

      <section className="space-y-4">
        <span className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          FDA Food Code 2022 · free
        </span>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Free HACCP plan builder &amp; food safety temperature calculator
        </h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Pick your food and process steps. {SITE.name} builds a 7-principle HACCP plan with critical
          control points, critical limits and corrective actions — every temperature cited verbatim from
          the FDA Food Code 2022 — and a printable temperature log for your kitchen.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <a href="#builder" className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700">
            Build my HACCP plan
          </a>
          <Link href="/cooking-temperatures" className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 hover:border-slate-400">
            Cooking temperature chart
          </Link>
        </div>
      </section>

      <PlanBuilder />

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">FDA Food Code minimum cooking temperatures</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[560px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">Food</th>
                <th className="px-3 py-2 font-semibold">Minimum temperature</th>
                <th className="px-3 py-2 font-semibold">Code citation</th>
              </tr>
            </thead>
            <tbody>
              {COOK_RULE_LIST.map((r) => (
                <tr key={r.category} className="border-b border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{r.label}</td>
                  <td className="px-3 py-2.5 text-slate-800">
                    {r.minTempF}°F for {r.holdSeconds}s
                  </td>
                  <td className="px-3 py-2.5 text-xs text-slate-400">{r.citation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">HACCP plan templates by food</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FOOD_TYPES.map((f) => (
            <Link
              key={f.slug}
              href={`/haccp-plan-template/${f.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-emerald-400 hover:shadow-sm"
            >
              <p className="font-medium text-slate-900">{f.name}</p>
              <p className="mt-1 line-clamp-2 text-sm text-slate-500">{f.summary}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Frequently asked questions</h2>
        <div className="space-y-3">
          {HOME_FAQ.map((qa) => (
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
