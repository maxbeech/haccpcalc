import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { JsonLd, faqLd, breadcrumbLd } from "@/components/JsonLd";
import { SITE } from "@/lib/site";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return { title: p.title, description: p.description, alternates: { canonical: `/guides/${p.slug}` } };
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: p.description,
    datePublished: p.updated,
    dateModified: p.updated,
    author: { "@type": "Organization", name: SITE.name },
    publisher: { "@type": "Organization", name: SITE.name },
  };

  return (
    <article className="space-y-6">
      <JsonLd
        data={[
          articleLd,
          ...(p.faq?.length ? [faqLd(p.faq)] : []),
          breadcrumbLd([
            { name: "Home", path: "/" },
            { name: "Guides", path: "/guides" },
            { name: p.title, path: `/guides/${p.slug}` },
          ]),
        ]}
      />
      <nav className="text-sm text-slate-500">
        <Link href="/guides" className="hover:text-slate-900">Guides</Link> <span className="px-1">/</span>
        <span className="text-slate-700">{p.title}</span>
      </nav>
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{p.title}</h1>
        <p className="text-lg text-slate-600">{p.description}</p>
      </header>
      <div className="space-y-6">
        {p.sections.map((s) => (
          <section key={s.heading} className="space-y-2">
            <h2 className="text-xl font-semibold text-slate-900">{s.heading}</h2>
            {s.body.map((para, i) => (
              <p key={i} className="text-slate-600">{para}</p>
            ))}
          </section>
        ))}
      </div>

      {p.table && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">{p.table.caption}</h2>
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  {p.table.headers.map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {p.table.rows.map((row, i) => (
                  <tr key={i} className="border-b border-slate-100 align-top">
                    {row.map((cell, j) => (
                      <td key={j} className={j === 0 ? "px-3 py-2.5 font-medium text-slate-800" : "px-3 py-2.5 text-slate-600"}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {p.faq?.length ? (
        <section className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
          <div className="space-y-3">
            {p.faq.map((qa) => (
              <details key={qa.q} className="rounded-xl border border-slate-200 bg-white p-4">
                <summary className="cursor-pointer font-medium text-slate-900">{qa.q}</summary>
                <p className="mt-2 text-sm text-slate-600">{qa.a}</p>
              </details>
            ))}
          </div>
        </section>
      ) : null}

      {p.relatedLinks?.length ? (
        <section className="space-y-2 border-t border-slate-200 pt-4">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Keep reading</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {p.relatedLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-emerald-700 underline">{l.text}</Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {p.sources?.length ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Sources</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            {p.sources.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-emerald-700 underline">{l.text}</a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <p className="border-t border-slate-200 pt-4 text-sm text-slate-500">
        Ready to apply this? <Link href="/#builder" className="text-emerald-700 underline">Build your HACCP plan →</Link>
      </p>
    </article>
  );
}
