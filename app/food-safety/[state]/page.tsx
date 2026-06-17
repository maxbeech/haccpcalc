import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATES, getState } from "@/lib/data/states";
import { COOK_RULE_LIST, HOLDING, COOLING, REHEATING, DATE_MARKING } from "@/lib/data/temps";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import type { QA } from "@/lib/faq";

export function generateStaticParams() {
  return STATES.map((s) => ({ state: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  const s = getState(state);
  if (!s) return {};
  return {
    title: `${s.name} Food Safety & Food Code Requirements`,
    description: `${s.name} retail food safety reference: the FDA Food Code basis, cooking temperatures, cooling and date-marking rules, and the ${s.agency}.`,
    alternates: { canonical: `/food-safety/${s.slug}` },
  };
}

export default async function StatePage({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  const s = getState(state);
  if (!s) notFound();

  const faq: QA[] = [
    {
      q: `Does ${s.name} follow the FDA Food Code?`,
      a: `Yes. ${s.name} bases its retail food regulations on the FDA Food Code, adopted with state-specific amendments and enforced by the ${s.agency}. Confirm the exact adopted edition and local amendments with that agency.`,
    },
    {
      q: `What temperature must chicken reach in ${s.name}?`,
      a: `Under the FDA Food Code basis used in ${s.name}, poultry must reach 165°F for 1 second. Ground meat must reach 155°F for 17 seconds, and whole-muscle meat and fish 145°F for 15 seconds.`,
    },
    {
      q: `Who regulates restaurants in ${s.name}?`,
      a: `Retail food establishments in ${s.name} are regulated by the ${s.agency}.`,
    },
  ];

  return (
    <div className="space-y-10">
      <JsonLd
        data={[
          faqLd(faq),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Food safety by state", path: "/states" },
            { name: s.name, path: `/food-safety/${s.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/states" className="hover:text-slate-900">Food safety by state</Link> <span className="px-1">/</span>
        <span className="text-slate-700">{s.name}</span>
      </nav>

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{s.name} food safety requirements</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          {s.name} bases its retail food regulations on the FDA Food Code, enforced by the{" "}
          <span className="font-medium text-slate-800">{s.agency}</span>. The cooking, cooling, holding and
          date-marking critical limits below come from the FDA Food Code 2022 model code — confirm the exact
          adopted edition and any local amendments with your jurisdiction.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Cooking temperatures in {s.name}</h2>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[480px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">Food</th>
                <th className="px-3 py-2 font-semibold">Minimum temperature</th>
              </tr>
            </thead>
            <tbody>
              {COOK_RULE_LIST.map((r) => (
                <tr key={r.category} className="border-b border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{r.label}</td>
                  <td className="px-3 py-2.5 text-slate-800">{r.minTempF}°F for {r.holdSeconds}s</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2">
        <Fact title="Cold / hot holding">≤ {HOLDING.coldHoldMaxF}°F cold · ≥ {HOLDING.hotHoldMinF}°F hot</Fact>
        <Fact title="Cooling rule">{COOLING.stage1FromF}°F→{COOLING.stage1ToF}°F in {COOLING.stage1Hours}h, →{COOLING.stage2ToF}°F in {COOLING.totalHours}h total</Fact>
        <Fact title="Reheating">≥ {REHEATING.minTempF}°F for {REHEATING.holdSeconds}s within {REHEATING.withinHours}h</Fact>
        <Fact title="RTE date marking">Use within {DATE_MARKING.maxDays} days at ≤ {DATE_MARKING.atOrBelowF}°F</Fact>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Build a {s.name} HACCP plan</h2>
        <p className="text-sm text-slate-600">
          Use the free <Link href="/#builder" className="text-emerald-700 underline">HACCP plan builder</Link> to
          generate a plan for your menu, then print a temperature log to satisfy a {s.name} inspection.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
        <div className="space-y-3">
          {faq.map((qa) => (
            <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
              <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-900">Other states</h2>
        <div className="flex flex-wrap gap-1.5 text-sm">
          {STATES.filter((x) => x.slug !== s.slug).map((x) => (
            <Link key={x.slug} href={`/food-safety/${x.slug}`} className="rounded border border-slate-200 bg-white px-2 py-0.5 text-slate-600 hover:border-emerald-400">
              {x.abbr}
            </Link>
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
