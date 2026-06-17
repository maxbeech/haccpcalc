"use client";

import { useMemo, useState } from "react";
import { buildPlan, ProcessCategory, StepId, STEP_LABELS, STEP_ORDER } from "@/lib/calc/haccp";
import { buildLogSheet, LogPointId } from "@/lib/calc/templog";
import { FOOD_TYPES } from "@/lib/data/foodTypes";
import { COOK_RULES, CookCategory } from "@/lib/data/temps";
import { PlanView } from "@/components/PlanView";

const COOK_CATS = Object.values(COOK_RULES);

// Map a HACCP step set + cook category to the temperature-log monitoring points.
function logPoints(steps: StepId[]): LogPointId[] {
  const pts: LogPointId[] = [];
  if (steps.includes("receiving")) pts.push("receiving");
  if (steps.includes("cold-storage")) pts.push("cold-storage");
  if (steps.includes("cooking")) pts.push("cooking");
  if (steps.includes("cooling")) pts.push("cooling-2h", "cooling-6h");
  if (steps.includes("cold-holding")) pts.push("cold-holding");
  if (steps.includes("reheating")) pts.push("reheating");
  if (steps.includes("hot-holding")) pts.push("hot-holding");
  return pts;
}

export function PlanBuilder({ initialSlug = "chicken" }: { initialSlug?: string }) {
  const preset = FOOD_TYPES.find((f) => f.slug === initialSlug) ?? FOOD_TYPES[0];
  const [foodName, setFoodName] = useState(preset.name);
  const [process, setProcess] = useState<ProcessCategory>(preset.process);
  const [cookCategory, setCookCategory] = useState<CookCategory | "">(preset.cookCategory ?? "");
  const [steps, setSteps] = useState<StepId[]>(preset.steps);

  function applyPreset(slug: string) {
    const f = FOOD_TYPES.find((x) => x.slug === slug);
    if (!f) return;
    setFoodName(f.name);
    setProcess(f.process);
    setCookCategory(f.cookCategory ?? "");
    setSteps(f.steps);
  }

  function toggleStep(s: StepId) {
    setSteps((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  const plan = useMemo(
    () => buildPlan({ foodName: foodName || "Your food", process, cookCategory: cookCategory || undefined, steps }),
    [foodName, process, cookCategory, steps],
  );
  const log = useMemo(
    () => buildLogSheet({ foodName: foodName || "Your food", cookCategory: cookCategory || undefined, points: logPoints(steps) }),
    [foodName, cookCategory, steps],
  );

  return (
    <div className="space-y-8" id="builder">
      <div className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-2 print:hidden">
        <label className="block text-sm">
          <span className="font-medium text-slate-700">Start from a food</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            defaultValue={preset.slug}
            onChange={(e) => applyPreset(e.target.value)}
          >
            {FOOD_TYPES.map((f) => (
              <option key={f.slug} value={f.slug}>{f.name}</option>
            ))}
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Food / dish name</span>
          <input
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            value={foodName}
            onChange={(e) => setFoodName(e.target.value)}
            placeholder="e.g. Grilled chicken breast"
          />
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Process category</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            value={process}
            onChange={(e) => setProcess(e.target.value as ProcessCategory)}
          >
            <option value="no-cook">Process 1 — No cook (ready-to-eat)</option>
            <option value="same-day">Process 2 — Same-day cook & serve</option>
            <option value="complex">Process 3 — Complex (cook, cool & reheat)</option>
          </select>
        </label>

        <label className="block text-sm">
          <span className="font-medium text-slate-700">Cook temperature category</span>
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900"
            value={cookCategory}
            onChange={(e) => setCookCategory(e.target.value as CookCategory | "")}
          >
            <option value="">— none / not cooked —</option>
            {COOK_CATS.map((c) => (
              <option key={c.category} value={c.category}>
                {c.label} ({c.minTempF}°F)
              </option>
            ))}
          </select>
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-slate-700">Process steps</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {STEP_ORDER.map((s) => {
              const on = steps.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleStep(s)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                    on
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : "border-slate-300 bg-white text-slate-600 hover:border-slate-400"
                  }`}
                >
                  {STEP_LABELS[s]}
                </button>
              );
            })}
          </div>
        </fieldset>
      </div>

      <PlanView plan={plan} />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Temperature log sheet</h2>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-lg bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700 print:hidden"
          >
            Print / Save as PDF
          </button>
        </div>
        <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-3 py-2 font-semibold">Check point</th>
                <th className="px-3 py-2 font-semibold">Target</th>
                <th className="px-3 py-2 font-semibold">Frequency</th>
                <th className="px-3 py-2 font-semibold">Corrective action</th>
                <th className="px-3 py-2 font-semibold">Temp / initials</th>
              </tr>
            </thead>
            <tbody>
              {log.rows.map((r) => (
                <tr key={r.id} className="border-b border-slate-100">
                  <td className="px-3 py-2.5 font-medium text-slate-800">{r.label}</td>
                  <td className="px-3 py-2.5 text-slate-800">{r.target}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r.interval}</td>
                  <td className="px-3 py-2.5 text-slate-600">{r.correctiveAction}</td>
                  <td className="px-3 py-2.5 text-slate-300">__________</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs text-slate-400">{log.citation}</p>
      </div>
    </div>
  );
}
