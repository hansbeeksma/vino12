import type { MetadataRoute } from "next";
import { getWineSlugs } from "@/lib/api/wines";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = "https://vino12.com";
  const slugs = await getWineSlugs();

  const winePages = slugs.map(({ slug }) => ({
    url: `${base}/wijn/${slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    { url: `${base}/wijnen`, lastModified: new Date() },
    { url: `${base}/privacy`, lastModified: new Date() },
    { url: `${base}/voorwaarden`, lastModified: new Date() },
    ...winePages,
  ];
}
