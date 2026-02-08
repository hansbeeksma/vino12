/**
 * Generate Wine Embeddings
 *
 * Run: npx tsx scripts/generate-wine-embeddings.ts
 *
 * Creates text-based feature vectors from wine metadata (grape, region, color,
 * body, tasting notes, etc.). These embeddings enable cosine-similarity matching
 * in the CV scanner — useful since VINO12 uses SVG bottle illustrations rather
 * than real label photographs.
 *
 * No extra dependencies required (no sharp, no tfjs-node).
 */

import * as fs from "fs";
import * as path from "path";

interface Wine {
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
  tastingNotes: {
    nose: string[];
    palate: string[];
    finish: string;
  };
  pairings: string[];
}

interface WineEmbedding {
  id: number;
  name: string;
  slug: string;
  embedding: number[];
}

const COLORS = ["red", "white", "rose", "sparkling", "orange", "dessert"];
const BODIES = ["Light", "Light-Medium", "Medium", "Medium-Full", "Full"];
const COUNTRIES = [
  "Frankrijk",
  "Italië",
  "Spanje",
  "Argentinië",
  "Nieuw-Zeeland",
  "Duitsland",
  "Portugal",
  "Chili",
  "Zuid-Afrika",
  "Australië",
];

const TASTING_VOCABULARY = [
  "kers",
  "aardbei",
  "framboos",
  "braam",
  "pruim",
  "zwarte bes",
  "cassis",
  "perzik",
  "abrikoos",
  "citrus",
  "citroen",
  "limoen",
  "passievrucht",
  "appel",
  "banaan",
  "tropisch",
  "chocolade",
  "vanille",
  "honing",
  "mokka",
  "cacao",
  "tabak",
  "cederhout",
  "eik",
  "kruiden",
  "peper",
  "lavendel",
  "bloemen",
  "viooltje",
  "mineraal",
  "vuursteen",
  "krijt",
  "zeezout",
  "amandel",
  "gember",
  "eucalyptus",
  "paprika",
  "grafiet",
  "petroleum",
];

function normalize(value: number, min: number, max: number): number {
  if (max === min) return 0.5;
  return (value - min) / (max - min);
}

function oneHotEncode(value: string, vocabulary: string[]): number[] {
  return vocabulary.map((v) => (v === value ? 1 : 0));
}

function tastingNoteVector(wine: Wine): number[] {
  const allNotes = [
    ...wine.tastingNotes.nose,
    ...wine.tastingNotes.palate,
    wine.tastingNotes.finish,
  ]
    .join(" ")
    .toLowerCase();

  return TASTING_VOCABULARY.map((term) => (allNotes.includes(term) ? 1 : 0));
}

function generateEmbedding(wine: Wine, allWines: Wine[]): number[] {
  const features: number[] = [];

  // Color one-hot (6 dims)
  features.push(...oneHotEncode(wine.color, COLORS));

  // Body one-hot (5 dims)
  features.push(...oneHotEncode(wine.body, BODIES));

  // Country one-hot (10 dims)
  features.push(...oneHotEncode(wine.country, COUNTRIES));

  // Price normalized (1 dim)
  const prices = allWines.map((w) => w.price);
  features.push(
    normalize(wine.price, Math.min(...prices), Math.max(...prices)),
  );

  // Year normalized (1 dim)
  const years = allWines.map((w) => w.year);
  features.push(normalize(wine.year, Math.min(...years), Math.max(...years)));

  // Alcohol normalized (1 dim)
  const alcoholNum = parseFloat(wine.alcohol.replace("%", ""));
  const alcohols = allWines.map((w) => parseFloat(w.alcohol.replace("%", "")));
  features.push(
    normalize(alcoholNum, Math.min(...alcohols), Math.max(...alcohols)),
  );

  // Tasting notes multi-hot (TASTING_VOCABULARY.length dims)
  features.push(...tastingNoteVector(wine));

  return features;
}

function main() {
  const winesPath = path.resolve(__dirname, "../data/wines.json");
  const outputPath = path.resolve(
    __dirname,
    "../public/data/wine-embeddings.json",
  );

  const wines: Wine[] = JSON.parse(fs.readFileSync(winesPath, "utf-8"));
  console.log(`Loaded ${wines.length} wines`);

  const embeddings: WineEmbedding[] = wines.map((wine) => ({
    id: wine.id,
    name: wine.name,
    slug: wine.slug,
    embedding: generateEmbedding(wine, wines),
  }));

  const dims = embeddings[0].embedding.length;
  console.log(
    `Generated ${embeddings.length} embeddings (${dims} dimensions each)`,
  );

  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, JSON.stringify(embeddings, null, 2));
  console.log(`Written to ${outputPath}`);
}

main();
