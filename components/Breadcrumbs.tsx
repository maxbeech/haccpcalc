import Link from "next/link";

export type Crumb = { name: string; path: string };

export function Breadcrumbs({ trail }: { trail: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-slate-500">
      {trail.map((t, i) => (
        <span key={t.path}>
          {i > 0 && <span className="px-1">/</span>}
          {i < trail.length - 1 ? (
            <Link href={t.path} className="hover:text-slate-900">{t.name}</Link>
          ) : (
            <span className="text-slate-700">{t.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
