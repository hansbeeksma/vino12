import { Client, type CollectionCreateSchema } from "typesense";

const COLLECTION_NAME = "wines";

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

const wineSchema: CollectionCreateSchema = {
  name: COLLECTION_NAME,
  fields: [
    { name: "id", type: "string" },
    { name: "name", type: "string", sort: true },
    { name: "slug", type: "string" },
    { name: "type", type: "string", facet: true },
    { name: "body", type: "string", facet: true },
    { name: "grape", type: "string", facet: true },
    { name: "region", type: "string", facet: true },
    { name: "country", type: "string", facet: true },
    { name: "vintage", type: "int32", facet: true },
    { name: "price_cents", type: "int32", sort: true },
    { name: "alcohol_percentage", type: "float" },
    { name: "description", type: "string" },
    { name: "tasting_notes_nose", type: "string[]" },
    { name: "tasting_notes_palate", type: "string[]" },
    { name: "tasting_notes_finish", type: "string" },
    { name: "food_pairing", type: "string[]" },
    { name: "is_active", type: "bool" },
    { name: "is_featured", type: "bool" },
  ],
  default_sorting_field: "name",
};

const dutchSynonyms = [
  { id: "droog-dry", synonyms: ["droog", "dry"] },
  { id: "zoet-sweet", synonyms: ["zoet", "sweet"] },
  { id: "vol-full-bodied", synonyms: ["vol", "full-bodied"] },
  { id: "licht-light-bodied", synonyms: ["licht", "light-bodied"] },
  { id: "rood-red", synonyms: ["rood", "red"] },
  { id: "wit-white", synonyms: ["wit", "white"] },
  { id: "kruidig-spicy", synonyms: ["kruidig", "spicy"] },
  { id: "fruitig-fruity", synonyms: ["fruitig", "fruity"] },
];

async function main() {
  const client = createClient();
  const dropIfExists = process.argv.includes("--drop");

  console.log("Typesense Setup");
  console.log("================\n");

  try {
    const health = await client.health.retrieve();
    console.log(`[OK] Typesense is healthy: ${JSON.stringify(health)}\n`);
  } catch (err) {
    console.error("[ERROR] Cannot connect to Typesense. Is it running?\n", err);
    process.exit(1);
  }

  if (dropIfExists) {
    try {
      await client.collections(COLLECTION_NAME).delete();
      console.log(`[DROP] Deleted existing '${COLLECTION_NAME}' collection`);
    } catch {
      console.log(`[SKIP] Collection '${COLLECTION_NAME}' does not exist yet`);
    }
  }

  try {
    const existing = await client.collections(COLLECTION_NAME).retrieve();
    console.log(
      `[EXISTS] Collection '${COLLECTION_NAME}' already exists with ${existing.num_documents} documents`,
    );
    console.log("  Use --drop flag to recreate\n");
  } catch {
    console.log(`[CREATE] Creating collection '${COLLECTION_NAME}'...`);
    await client.collections().create(wineSchema);
    console.log(`[OK] Collection '${COLLECTION_NAME}' created\n`);
  }

  console.log("[SYNONYMS] Configuring Dutch synonyms...");
  for (const synonym of dutchSynonyms) {
    try {
      await client
        .collections(COLLECTION_NAME)
        .synonyms()
        .upsert(synonym.id, { synonyms: synonym.synonyms });
      console.log(`  [OK] ${synonym.id}: ${synonym.synonyms.join(" = ")}`);
    } catch (err) {
      console.error(`  [ERROR] ${synonym.id}:`, err);
    }
  }

  console.log("\nSetup complete.");
}

main().catch((err) => {
  console.error("Setup failed:", err);
  process.exit(1);
});
