import type { Metadata } from "next";
import Link from "next/link";
import { STATES } from "@/lib/data/states";

export const metadata: Metadata = {
  title: "Food Safety Requirements by State",
  description:
    "Retail food safety and FDA Food Code requirements for all 50 US states — the regulatory agency, cooking temperatures, cooling and date-marking rules for each.",
  alternates: { canonical: "/states" },
};

export default function StatesIndex() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Food safety requirements by state</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Every US state bases its retail food regulations on the FDA Food Code. Pick your state for its
          regulatory agency, cooking temperatures, cooling and date-marking rules.
        </p>
      </section>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {STATES.map((s) => (
          <Link
            key={s.slug}
            href={`/food-safety/${s.slug}`}
            className="flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm transition hover:border-emerald-400"
          >
            <span className="font-medium text-slate-800">{s.name}</span>
            <span className="text-xs text-slate-400">{s.abbr}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
