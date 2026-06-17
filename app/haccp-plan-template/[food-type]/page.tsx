import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FOOD_TYPES, getFoodType } from "@/lib/data/foodTypes";
import { buildPlan } from "@/lib/calc/haccp";
import { PlanView } from "@/components/PlanView";
import { PlanBuilder } from "@/components/PlanBuilder";
import { JsonLd, softwareAppLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";
import type { QA } from "@/lib/faq";

export function generateStaticParams() {
  return FOOD_TYPES.map((f) => ({ "food-type": f.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ "food-type": string }> }): Promise<Metadata> {
  const { "food-type": slug } = await params;
  const f = getFoodType(slug);
  if (!f) return {};
  const title = `${f.name} HACCP Plan Template (FDA Food Code 2022)`;
  return {
    title,
    description: `Free ${f.keyword} HACCP plan template with critical control points, critical limits and a temperature log. ${f.summary}`,
    alternates: { canonical: `/haccp-plan-template/${f.slug}` },
  };
}

export default async function FoodTypePage({ params }: { params: Promise<{ "food-type": string }> }) {
  const { "food-type": slug } = await params;
  const f = getFoodType(slug);
  if (!f) notFound();

  const plan = buildPlan({ foodName: f.name, process: f.process, cookCategory: f.cookCategory, steps: f.steps });

  const faq: QA[] = [
    {
      q: `What are the critical control points for ${f.keyword}?`,
      a: `For ${f.name.toLowerCase()} (${plan.processLabel}), the critical control points are: ${plan.rows
        .filter((r) => r.isCcp)
        .map((r) => r.stepLabel.toLowerCase())
        .join(", ")}. Each has a measurable critical limit drawn from the FDA Food Code 2022.`,
    },
    {
      q: `What temperature should ${f.keyword} be cooked to?`,
      a:
        plan.rows.find((r) => r.step === "cooking")?.criticalLimit ??
        `${f.name} is a no-cook ready-to-eat food; cold holding at 41°F or below and 7-day date marking are the controls.`,
    },
  ];

  return (
    <div className="space-y-10">
      <JsonLd
        data={[
          softwareAppLd(),
          faqLd(faq),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "HACCP plan templates", path: "/" },
            { name: f.name, path: `/haccp-plan-template/${f.slug}` },
          ]),
        ]}
      />

      <nav className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-900">Home</Link> <span className="px-1">/</span>
        <span className="text-slate-700">{f.name} HACCP plan</span>
      </nav>

      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{f.name} HACCP plan template</h1>
        <p className="max-w-2xl text-lg text-slate-600">{f.summary}</p>
        <p className="text-sm text-slate-500">Examples: {f.examples.join(", ")}.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Ready-made plan</h2>
        <PlanView plan={plan} />
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Customize this plan</h2>
        <p className="text-sm text-slate-600">
          Adjust the food name, process steps or cook temperature category below, then print your
          temperature log.
        </p>
        <PlanBuilder initialSlug={f.slug} />
      </section>

      <section className="space-y-4">
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

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Other food types</h2>
        <div className="flex flex-wrap gap-2 text-sm">
          {FOOD_TYPES.filter((x) => x.slug !== f.slug).map((x) => (
            <Link key={x.slug} href={`/haccp-plan-template/${x.slug}`} className="rounded-full border border-slate-300 bg-white px-3 py-1 text-slate-600 hover:border-emerald-400">
              {x.name}
            </Link>
          ))}
        </div>
      </section>

      <p className="text-xs text-slate-400">
        Limits cited from the FDA Food Code 2022. {SITE.name} provides planning drafts — confirm with your
        local regulatory authority. See our <Link href="/methodology" className="underline">methodology</Link>.
      </p>
    </div>
  );
}
