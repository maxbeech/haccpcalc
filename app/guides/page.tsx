import type { Metadata } from "next";
import Link from "next/link";
import { POSTS } from "@/lib/posts";

export const metadata: Metadata = {
  title: "HACCP & Food Safety Guides",
  description:
    "Plain-language guides to HACCP and food safety: the 7 principles, the temperature danger zone, the two-stage cooling rule, and HACCP vs ServSafe.",
  alternates: { canonical: "/guides" },
};

export default function GuidesIndex() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">HACCP &amp; food safety guides</h1>
        <p className="max-w-2xl text-lg text-slate-600">
          Short, sourced explainers on the food safety rules behind every HACCP plan.
        </p>
      </section>
      <div className="grid gap-3 sm:grid-cols-2">
        {POSTS.map((p) => (
          <Link key={p.slug} href={`/guides/${p.slug}`} className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-emerald-400 hover:shadow-sm">
            <h2 className="font-semibold text-slate-900">{p.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{p.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
