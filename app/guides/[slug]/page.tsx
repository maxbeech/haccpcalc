import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/posts";
import { JsonLd, breadcrumbLd } from "@/components/JsonLd";
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
      <p className="border-t border-slate-200 pt-4 text-sm text-slate-500">
        Ready to apply this? <Link href="/#builder" className="text-emerald-700 underline">Build your HACCP plan →</Link>
      </p>
    </article>
  );
}
