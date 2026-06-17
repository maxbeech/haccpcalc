import type { Metadata } from "next";
import { PricingCta } from "@/components/PricingCta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "HACCPCalc is free to build HACCP plans and temperature logs. Pro adds saved plans, PDF export and team sharing.",
  alternates: { canonical: "/pricing" },
};

const FREE = [
  "HACCP plan builder (7 principles)",
  "FDA Food Code 2022 cooking temperatures",
  "Printable temperature log",
  "50-state food code reference",
  "All guides & methodology",
];

const PRO = [
  "Everything in Free",
  "Save unlimited HACCP plans to your account",
  "One-click PDF export of the full plan",
  "Team sharing & multi-location",
  "Email reminders for temperature log reviews",
];

export default function Pricing() {
  return (
    <div className="space-y-8">
      <section className="space-y-3 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Simple pricing</h1>
        <p className="mx-auto max-w-xl text-lg text-slate-600">
          Build plans and print temperature logs for free, forever. Upgrade to Pro when you want to save,
          export and share across your team.
        </p>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Free</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$0</p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {FREE.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border-2 border-emerald-500 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">Pro</h2>
          <p className="mt-1 text-3xl font-bold text-slate-900">$29<span className="text-base font-normal text-slate-500">/mo</span></p>
          <ul className="mt-4 space-y-2 text-sm text-slate-600">
            {PRO.map((f) => (
              <li key={f} className="flex gap-2"><span className="text-emerald-600">✓</span>{f}</li>
            ))}
          </ul>
          <PricingCta />
        </div>
      </div>
    </div>
  );
}
