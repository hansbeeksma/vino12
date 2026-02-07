import { writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import mapping from "./wine-mapping.json";

const IMAGES_DIR = join(__dirname, "..", "public", "images", "wines");

async function downloadImage(url: string, filename: string): Promise<void> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  writeFileSync(join(IMAGES_DIR, filename), buffer);
}

async function main() {
  const isDryRun = process.argv.includes("--dry-run");
  const imagesOnly = process.argv.includes("--images-only");

  if (!existsSync(IMAGES_DIR)) {
    mkdirSync(IMAGES_DIR, { recursive: true });
  }

  console.log(`Wine Scraper — ${mapping.mapping.length} wines mapped`);
  console.log(`Mode: ${isDryRun ? "DRY RUN" : imagesOnly ? "IMAGES ONLY" : "FULL"}\n`);

  for (const wine of mapping.mapping) {
    const filename = `${wine.vino12Slug}.jpg`;
    const exists = existsSync(join(IMAGES_DIR, filename));

    if (isDryRun) {
      console.log(`[${exists ? "EXISTS" : "DOWNLOAD"}] ${filename}`);
      console.log(`  Source: ${wine.sourceUrl}\n`);
      continue;
    }

    if (exists && imagesOnly) {
      console.log(`[SKIP] ${filename} already exists`);
      continue;
    }

    try {
      console.log(`[DOWNLOADING] ${filename}...`);
      await downloadImage(wine.sourceUrl, filename);
      console.log(`[OK] ${filename}`);
    } catch (err) {
      console.error(`[ERROR] ${filename}: ${err}`);
    }
  }

  console.log("\nDone.");
}

main().catch(console.error);
