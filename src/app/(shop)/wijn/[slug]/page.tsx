import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getWineBySlug } from "@/lib/api/wines";
import { WineDetail } from "@/components/wine/WineDetail";
import { ReviewSection } from "@/components/wine/ReviewSection";
import { ProductJsonLd } from "@/components/seo/JsonLd";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wine = await getWineBySlug(slug);

  if (!wine) {
    return { title: "Wijn niet gevonden | VINO12" };
  }

  return {
    title: `${wine.name} | VINO12`,
    description:
      wine.description ??
      `${wine.name} — premium wijn uit de VINO12 collectie.`,
  };
}

export default async function WineDetailPage({ params }: Props) {
  const { slug } = await params;
  const wine = await getWineBySlug(slug);

  if (!wine) {
    notFound();
  }

  return (
    <div className="bg-offwhite min-h-screen section-padding">
      <ProductJsonLd wine={wine} />
      <WineDetail wine={wine} />
      <Suspense
        fallback={
          <div className="border-t-2 border-ink mt-12 pt-12">
            <div className="container-brutal px-4 md:px-8">
              <h2 className="font-display text-display-sm text-ink mb-8">
                REVIEWS
              </h2>
              <p className="font-body text-sm text-ink/40">Laden...</p>
            </div>
          </div>
        }
      >
        <ReviewSection wineId={wine.id} slug={wine.slug} />
      </Suspense>
    </div>
  );
}
