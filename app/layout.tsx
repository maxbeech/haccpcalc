import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: `${SITE.name} — ${SITE.tagline}`, template: `%s · ${SITE.name}` },
  description: SITE.description,
  alternates: { canonical: "/" },
  openGraph: { title: SITE.name, description: SITE.description, url: SITE.url, siteName: SITE.name, type: "website" },
  twitter: { card: "summary_large_image", title: SITE.name, description: SITE.description },
};

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur print:hidden">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="flex items-center gap-2 font-bold text-slate-900">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-emerald-600 text-sm text-white">H</span>
          HACCP<span className="text-emerald-600">Calc</span>
        </Link>
        <nav className="flex items-center gap-4 text-sm text-slate-600 sm:gap-5">
          <Link href="/#builder" className="hover:text-slate-900">Plan builder</Link>
          <Link href="/cooking-temperatures" className="hover:text-slate-900">Temperatures</Link>
          <Link href="/states" className="hidden hover:text-slate-900 sm:inline">States</Link>
          <Link href="/guides" className="hidden hover:text-slate-900 sm:inline">Guides</Link>
          <Link href="/pricing" className="rounded-lg bg-slate-900 px-3 py-1.5 font-medium text-white hover:bg-slate-700">Pro</Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-50 print:hidden">
      <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-slate-500">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/" className="hover:text-slate-900">HACCP plan builder</Link>
          <Link href="/cooking-temperatures" className="hover:text-slate-900">Cooking temperatures</Link>
          <Link href="/haccp-plan-template/chicken" className="hover:text-slate-900">Chicken HACCP plan</Link>
          <Link href="/states" className="hover:text-slate-900">By state</Link>
          <Link href="/guides" className="hover:text-slate-900">Guides</Link>
          <Link href="/methodology" className="hover:text-slate-900">Methodology</Link>
          <Link href="/pricing" className="hover:text-slate-900">Pro / PDF</Link>
        </div>
        <p className="mt-4 max-w-3xl text-xs text-slate-400">
          {SITE.name} produces planning drafts using the FDA Food Code 2022 model code. States and
          local jurisdictions adopt the Food Code with amendments — always confirm your HACCP plan,
          critical limits and permit requirements with your local regulatory authority and a certified
          food protection manager. © {new Date().getFullYear()} {SITE.name}.
        </p>
      </div>
    </footer>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <Header />
        <main className="mx-auto max-w-5xl px-5 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
