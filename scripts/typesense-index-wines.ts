import { readFileSync } from "fs";
import { join } from "path";
import { Client } from "typesense";

const COLLECTION_NAME = "wines";

interface WineJson {
  id: number;
  name: string;
  slug: string;
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
}

interface TypesenseWineDocument {
  id: string;
  name: string;
  slug: string;
  type: string;
  body: string;
  grape: string;
  region: string;
  country: string;
  vintage: number;
  price_cents: number;
  alcohol_percentage: number;
  description: string;
  tasting_notes_nose: string[];
  tasting_notes_palate: string[];
  tasting_notes_finish: string;
  food_pairing: string[];
  is_active: boolean;
  is_featured: boolean;
}

function createClient(): Client {
  const host = process.env.TYPESENSE_HOST ?? "localhost";
  const port = parseInt(process.env.TYPESENSE_PORT ?? "8108", 10);
  const apiKey = process.env.TYPESENSE_API_KEY ?? "xyz";
  const protocol = process.env.TYPESENSE_PROTOCOL ?? "http";

  return new Client({
    nodes: [{ host, port, protocol }],
    apiKey,
    connectionTimeoutSeconds: 10,
  });
}

function mapColorToType(color: string): string {
  const mapping: Record<string, string> = {
    red: "red",
    white: "white",
    rose: "rose",
    sparkling: "sparkling",
  };
  return mapping[color] ?? color;
}

function parseAlcohol(alcohol: string): number {
  const match = alcohol.match(/([\d.]+)/);
  return match ? parseFloat(match[1]) : 0;
}

function mapWineToDocument(wine: WineJson): TypesenseWineDocument {
  return {
    id: String(wine.id),
    name: wine.name,
    slug: wine.slug,
    type: mapColorToType(wine.color),
    body: wine.body,
    grape: wine.grape,
    region: wine.region,
    country: wine.country,
    vintage: wine.year,
    price_cents: Math.round(wine.price * 100),
    alcohol_percentage: parseAlcohol(wine.alcohol),
    description: wine.description,
    tasting_notes_nose: wine.tastingNotes.nose,
    tasting_notes_palate: wine.tastingNotes.palate,
    tasting_notes_finish: wine.tastingNotes.finish,
    food_pairing: wine.pairings,
    is_active: true,
    is_featured: false,
  };
}

async function main() {
  const client = createClient();
  const isDryRun = process.argv.includes("--dry-run");

  console.log("Typesense Wine Indexer");
  console.log("=====================\n");

  try {
    await client.health.retrieve();
    console.log("[OK] Connected to Typesense\n");
  } catch (err) {
    console.error("[ERROR] Cannot connect to Typesense. Is it running?\n", err);
    process.exit(1);
  }

  const winesPath = join(__dirname, "..", "data", "wines.json");
  let wines: WineJson[];
  try {
    const raw = readFileSync(winesPath, "utf-8");
    wines = JSON.parse(raw) as WineJson[];
    console.log(`[READ] Loaded ${wines.length} wines from data/wines.json\n`);
  } catch (err) {
    console.error("[ERROR] Failed to read wines.json:", err);
    process.exit(1);
  }

  const documents = wines.map(mapWineToDocument);

  if (isDryRun) {
    console.log("[DRY RUN] Documents that would be indexed:\n");
    for (const doc of documents) {
      console.log(`  ${doc.id}: ${doc.name} (${doc.type}, ${doc.region})`);
    }
    console.log(`\nTotal: ${documents.length} documents`);
    return;
  }

  console.log(`[INDEX] Upserting ${documents.length} wines...`);

  try {
    const results = await client
      .collections(COLLECTION_NAME)
      .documents()
      .import(documents, { action: "upsert" });

    let successCount = 0;
    let errorCount = 0;

    for (const result of results) {
      if (result.success) {
        successCount++;
      } else {
        errorCount++;
        console.error(`  [ERROR] Document: ${JSON.stringify(result)}`);
      }
    }

    console.log(`\n[DONE] ${successCount} indexed, ${errorCount} errors`);
  } catch (err) {
    console.error("[ERROR] Bulk import failed:", err);
    process.exit(1);
  }

  try {
    const collection = await client.collections(COLLECTION_NAME).retrieve();
    console.log(
      `\n[INFO] Collection '${COLLECTION_NAME}' now has ${collection.num_documents} documents`,
    );
  } catch {
    // Non-critical, ignore
  }
}

main().catch((err) => {
  console.error("Indexing failed:", err);
  process.exit(1);
});
