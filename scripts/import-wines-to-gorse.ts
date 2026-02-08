/**
 * Import wines from data/wines.json into Gorse recommendation engine.
 *
 * Usage:
 *   npx tsx scripts/import-wines-to-gorse.ts
 *
 * Environment:
 *   GORSE_API_URL  — Gorse master API (default: http://localhost:8088)
 *   GORSE_API_KEY  — Gorse API key (default: empty)
 */

import { readFileSync } from "fs";
import { join } from "path";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Wine {
  id: number;
  name: string;
  grape: string;
  region: string;
  country: string;
  color: string;
  body: string;
  price: number;
  year: number;
  alcohol: string;
  description: string;
  tastingNotes: {
    nose: string[];
    palate: string[];
    finish: string;
  };
  pairings: string[];
  slug: string;
}

interface GorseItem {
  ItemId: string;
  IsHidden: boolean;
  Categories: string[];
  Timestamp: string;
  Labels: string[];
  Comment: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getPriceRange(price: number): string {
  if (price < 10) return "budget";
  if (price < 15) return "value";
  if (price < 25) return "mid-range";
  if (price < 50) return "premium";
  return "luxury";
}

function wineToGorseItem(wine: Wine): GorseItem {
  const labels = [
    `grape:${wine.grape}`,
    `region:${wine.region}`,
    `country:${wine.country}`,
    `color:${wine.color}`,
    `body:${wine.body}`,
    `price:${getPriceRange(wine.price)}`,
    `year:${wine.year}`,
  ];

  return {
    ItemId: String(wine.id),
    IsHidden: false,
    Categories: [wine.color, wine.country],
    Timestamp: new Date().toISOString(),
    Labels: labels,
    Comment: `${wine.name} — ${wine.grape} (${wine.region}, ${wine.country})`,
  };
}

async function insertItem(
  baseUrl: string,
  apiKey: string,
  item: GorseItem,
): Promise<void> {
  const url = `${baseUrl}/api/item`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey ? { "X-API-Key": apiKey } : {}),
    },
    body: JSON.stringify(item),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to insert item ${item.ItemId}: ${response.status} ${body}`,
    );
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const baseUrl = process.env.GORSE_API_URL ?? "http://localhost:8088";
  const apiKey = process.env.GORSE_API_KEY ?? "";

  const winesPath = join(__dirname, "..", "data", "wines.json");
  const raw = readFileSync(winesPath, "utf-8");
  const wines: Wine[] = JSON.parse(raw);

  console.log(`Importing ${wines.length} wines into Gorse at ${baseUrl}...`);
  console.log();

  let success = 0;
  let failed = 0;

  for (const wine of wines) {
    const item = wineToGorseItem(wine);

    try {
      await insertItem(baseUrl, apiKey, item);
      console.log(`  [OK] ${item.ItemId} — ${item.Comment}`);
      success++;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error(`  [FAIL] ${item.ItemId} — ${message}`);
      failed++;
    }
  }

  console.log();
  console.log(`Done. ${success} imported, ${failed} failed.`);

  if (failed > 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
