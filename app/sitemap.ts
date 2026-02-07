import type { MetadataRoute } from "next";
import { wines } from "@/lib/wines";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://vino12.com";

  const winePages = wines.map((wine) => ({
    url: `${base}/wijn/${wine.slug}`,
    lastModified: new Date(),
  }));

  return [
    { url: base, lastModified: new Date() },
    ...winePages,
  ];
}
