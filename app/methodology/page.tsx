import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Methodology & Sources",
  description:
    "How HACCPCalc derives its critical limits: every temperature is cited verbatim from the FDA Food Code 2022. No fabricated values.",
  alternates: { canonical: "/methodology" },
};

export default function Methodology() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Methodology &amp; sources</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          HACCPCalc builds plans from a single authoritative source — the FDA Food Code 2022 — and cites the
          exact section for every critical limit. We do not invent or estimate temperatures.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">Primary source</h2>
        <p className="text-slate-600">
          <strong>FDA Food Code 2022</strong> — the model code the U.S. Food and Drug Administration publishes
          for retail and foodservice. U.S. states and local jurisdictions adopt the Food Code, in whole or with
          amendments, as their enforceable retail food regulation.
        </p>
        <ul className="list-disc space-y-1 pl-5 text-slate-600">
          <li>§3-401.11 — minimum cooking temperatures for raw animal foods</li>
          <li>§3-501.14 — cooling of cooked TCS food (two-stage rule)</li>
          <li>§3-501.16 — cold and hot holding temperatures</li>
          <li>§3-403.11 — reheating for hot holding</li>
          <li>§3-501.17 — ready-to-eat TCS date marking</li>
          <li>Annex 4 — the food establishment "process approach" to HACCP</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">How the plan is built</h2>
        <ol className="list-decimal space-y-1 pl-5 text-slate-600">
          <li>You choose a food and its process category (no-cook, same-day cook, or complex).</li>
          <li>We map the process to its critical control points using the FDA process approach.</li>
          <li>Each CCP is assigned its critical limit verbatim from the Food Code section above.</li>
          <li>Monitoring procedures, corrective actions, verification and record-keeping complete the 7 principles.</li>
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-slate-900">State data</h2>
        <p className="text-slate-600">
          For each state we list the regulatory agency that enforces retail food rules and note that the state
          bases its code on the FDA Food Code. Because states update their adopted edition over time, we point
          you to the agency to confirm the exact edition and local amendments rather than hard-coding a number
          that could go stale. Source of record: the FDA's "Adoption of the FDA Food Code by State."
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <h2 className="text-lg font-semibold text-amber-900">Disclaimer</h2>
        <p className="text-sm text-amber-800">
          HACCPCalc produces planning drafts, not legal advice or an approved HACCP plan. Always confirm your
          plan, critical limits and permit requirements with your local regulatory authority and a certified
          food protection manager before relying on it for an inspection.
        </p>
      </section>

      <p className="text-sm text-slate-500">
        <Link href="/" className="text-emerald-700 underline">← Back to the builder</Link>
      </p>
    </div>
  );
}
