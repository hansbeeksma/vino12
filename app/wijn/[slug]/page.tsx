import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { wines, getWineBySlug } from "@/lib/wines";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { WineDetail } from "@/components/wine/WineDetail";
import { MarqueeStrip } from "@/components/ui/MarqueeStrip";

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return wines.map((wine) => ({ slug: wine.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const wine = getWineBySlug(params.slug);
  if (!wine) return { title: "Wijn niet gevonden" };

  return {
    title: `${wine.name} — Vino12`,
    description: wine.description,
    openGraph: {
      title: `${wine.name} — Vino12`,
      description: wine.description,
      type: "website",
      locale: "nl_NL",
      siteName: "Vino12",
    },
  };
}

export default function WinePage({ params }: PageProps) {
  const wine = getWineBySlug(params.slug);
  if (!wine) notFound();

  const currentIndex = wines.findIndex((w) => w.slug === params.slug);
  const prevWine = currentIndex > 0 ? wines[currentIndex - 1] : null;
  const nextWine =
    currentIndex < wines.length - 1 ? wines[currentIndex + 1] : null;

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="container-brutal px-4 py-4 md:px-8">
          <nav className="font-accent text-xs uppercase tracking-widest text-ink/50">
            <Link href="/" className="hover:text-wine">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/#collectie" className="hover:text-wine">
              Collectie
            </Link>
            <span className="mx-2">/</span>
            <span className="text-ink">{wine.name}</span>
          </nav>
        </div>

        <WineDetail wine={wine} />

        {/* Navigation */}
        <div className="container-brutal px-4 py-8 md:px-8">
          <div className="flex justify-between items-center border-t-2 border-ink pt-6">
            {prevWine ? (
              <Link
                href={`/wijn/${prevWine.slug}`}
                className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
              >
                ← {prevWine.name}
              </Link>
            ) : (
              <div />
            )}
            <Link
              href="/#collectie"
              className="font-accent text-xs uppercase tracking-widest text-wine border-2 border-ink px-4 py-2 brutal-shadow brutal-hover"
            >
              Alle wijnen
            </Link>
            {nextWine ? (
              <Link
                href={`/wijn/${nextWine.slug}`}
                className="font-accent text-xs uppercase tracking-widest text-ink hover:text-wine"
              >
                {nextWine.name} →
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        <MarqueeStrip text="VINO12 ★ 12 PREMIUM WIJNEN ★ 6 ROOD ★ 6 WIT ★ PERFECTE BALANS" />
      </main>
      <Footer />
    </>
  );
}
