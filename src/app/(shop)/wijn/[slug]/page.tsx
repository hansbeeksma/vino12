import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getWineBySlug } from "@/lib/api/wines";
import { WineDetail } from "@/components/wine/WineDetail";
import { TrackView } from "@/components/wine/TrackView";
import { RecentlyViewed } from "@/components/wine/RecentlyViewed";
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
      <TrackView slug={slug} />
      <ProductJsonLd wine={wine} />
      <WineDetail wine={wine} />
      <RecentlyViewed excludeSlug={slug} />
    </div>
  );
}
