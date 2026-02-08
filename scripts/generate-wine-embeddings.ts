/**
 * Generate Wine Embeddings
 *
 * Run: npx tsx scripts/generate-wine-embeddings.ts
 *
 * This script:
 * 1. Loads MobileNet model via TensorFlow.js (Node.js)
 * 2. Converts wine SVG images to PNG
 * 3. Extracts feature embeddings for each wine
 * 4. Saves to public/data/wine-embeddings.json
 *
 * Prerequisites:
 *   npm install @tensorflow/tfjs-node @tensorflow-models/mobilenet sharp
 *
 * Note: This is an offline script. The generated embeddings file should be
 * committed to the repo so the app doesn't need TF.js at build time.
 */

import * as fs from "fs";
import * as path from "path";

interface WineData {
  id: number;
  name: string;
  slug: string;
  image: string;
}

interface WineEmbedding {
  id: number;
  name: string;
  slug: string;
  embedding: number[];
}

async function main() {
  // Dynamic imports for Node.js TF
  const tf = await import("@tensorflow/tfjs-node");
  const mobilenet = await import("@tensorflow-models/mobilenet");
  const sharp = (await import("sharp")).default;

  const winesPath = path.resolve(__dirname, "../data/wines.json");
  const wines: WineData[] = JSON.parse(fs.readFileSync(winesPath, "utf-8"));
  const outputPath = path.resolve(
    __dirname,
    "../public/data/wine-embeddings.json",
  );

  console.log(`Loading MobileNet model...`);
  const model = await mobilenet.load({ version: 2, alpha: 0.5 });
  console.log(`Model loaded.`);

  const embeddings: WineEmbedding[] = [];

  for (const wine of wines) {
    const imagePath = path.resolve(__dirname, "..", "public", wine.image);

    if (!fs.existsSync(imagePath)) {
      console.warn(`Image not found: ${imagePath}, skipping ${wine.name}`);
      embeddings.push({
        id: wine.id,
        name: wine.name,
        slug: wine.slug,
        embedding: [],
      });
      continue;
    }

    try {
      // Convert SVG/any format to PNG buffer at 224x224
      const pngBuffer = await sharp(imagePath)
        .resize(224, 224, {
          fit: "contain",
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        })
        .png()
        .toBuffer();

      // Decode PNG to tensor
      const tensor = tf.node
        .decodePng(pngBuffer, 3)
        .expandDims(0)
        .toFloat()
        .div(255);

      // Extract features (penultimate layer)
      const features = model.infer(tensor, true) as tf.Tensor;
      const featureArray = Array.from(await features.data());

      embeddings.push({
        id: wine.id,
        name: wine.name,
        slug: wine.slug,
        embedding: featureArray,
      });

      // Cleanup
      tensor.dispose();
      features.dispose();

      console.log(`✓ ${wine.name} → ${featureArray.length} features`);
    } catch (err) {
      console.error(`✗ ${wine.name}: ${err}`);
      embeddings.push({
        id: wine.id,
        name: wine.name,
        slug: wine.slug,
        embedding: [],
      });
    }
  }

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));
  console.log(`\nEmbeddings saved to ${outputPath}`);
  console.log(
    `Total: ${embeddings.length} wines, ${embeddings.filter((e) => e.embedding.length > 0).length} with embeddings`,
  );
}

main().catch(console.error);
