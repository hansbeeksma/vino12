const WINE_SVG_MAP: Record<string, string> = {
  "albarino-rias-baixas": "/images/wines/albarino-rias-baixas.svg",
  "cabernet-franc-loire": "/images/wines/cabernet-franc-loire.svg",
  "cabernet-sauvignon-mendoza": "/images/wines/cabernet-sauvignon-mendoza.svg",
  "chardonnay-chablis": "/images/wines/chardonnay-chablis.svg",
  "gamay-beaujolais": "/images/wines/gamay-beaujolais.svg",
  "grenache-cotes-du-rhone": "/images/wines/grenache-cotes-du-rhone.svg",
  "merlot-saint-emilion": "/images/wines/merlot-saint-emilion.svg",
  "pinot-noir-bourgogne": "/images/wines/pinot-noir-bourgogne.svg",
  "riesling-alsace": "/images/wines/riesling-alsace.svg",
  "sauvignon-blanc-marlborough":
    "/images/wines/sauvignon-blanc-marlborough.svg",
  "vermentino-gallura": "/images/wines/vermentino-gallura.svg",
  "viognier-condrieu": "/images/wines/viognier-condrieu.svg",
};

const FALLBACK_SVG = "/images/wines/bordeaux.svg";

export function getWineAsset(slug: string): string {
  return WINE_SVG_MAP[slug] ?? FALLBACK_SVG;
}
