import wines from "@/data/wines.json";

interface WineEmbedding {
  id: number;
  name: string;
  slug: string;
  embedding: number[];
}

export interface MatchResult {
  wineId: number;
  name: string;
  slug: string;
  confidence: number;
}

let embeddingsCache: WineEmbedding[] | null = null;

export async function loadEmbeddings(): Promise<WineEmbedding[]> {
  if (embeddingsCache) return embeddingsCache;

  try {
    const response = await fetch("/data/wine-embeddings.json");
    if (!response.ok) {
      return wines.map((w) => ({
        id: w.id,
        name: w.name,
        slug: w.slug,
        embedding: [],
      }));
    }
    embeddingsCache = await response.json();
    return embeddingsCache!;
  } catch {
    return wines.map((w) => ({
      id: w.id,
      name: w.name,
      slug: w.slug,
      embedding: [],
    }));
  }
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  if (denominator === 0) return 0;

  return dotProduct / denominator;
}

function textSimilarity(a: string, b: string): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (aLower === bLower) return 1;
  if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.8;

  const aWords = aLower.split(/\s+/);
  const bWords = bLower.split(/\s+/);
  let matches = 0;
  for (const word of aWords) {
    if (bWords.some((bw) => bw.includes(word) || word.includes(bw))) matches++;
  }
  return aWords.length > 0
    ? matches / Math.max(aWords.length, bWords.length)
    : 0;
}

export function findWineByText(query: string): MatchResult[] {
  const results: MatchResult[] = [];

  for (const wine of wines) {
    const nameScore = textSimilarity(query, wine.name);
    const grapeScore = textSimilarity(query, wine.grape);
    const regionScore = textSimilarity(query, wine.region) * 0.8;
    const countryScore = textSimilarity(query, wine.country) * 0.6;

    const bestScore = Math.max(
      nameScore,
      grapeScore,
      regionScore,
      countryScore,
    );

    if (bestScore > 0.3) {
      results.push({
        wineId: wine.id,
        name: wine.name,
        slug: wine.slug,
        confidence: Math.min(1, bestScore),
      });
    }
  }

  return results.sort((a, b) => b.confidence - a.confidence);
}

export async function extractFeatures(imageData: ImageData): Promise<number[]> {
  const tf = await import("@tensorflow/tfjs");
  const mobilenet = await import("@tensorflow-models/mobilenet");

  const model = await mobilenet.load({ version: 2, alpha: 0.5 });

  const tensor = tf.browser
    .fromPixels(imageData)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat()
    .div(255);

  const features = model.infer(tensor, true);
  const featureData = await (
    features as { data: () => Promise<Float32Array> }
  ).data();
  const featureArray = Array.from(featureData);

  tensor.dispose();
  (features as { dispose: () => void }).dispose();

  return featureArray;
}

export async function findClosestWines(
  features: number[],
  count: number = 3,
): Promise<MatchResult[]> {
  const embeddings = await loadEmbeddings();

  if (embeddings.length === 0) return [];

  const hasEmbeddings = embeddings[0].embedding.length > 0;

  if (!hasEmbeddings) {
    // No embeddings: return random wines with low confidence
    const shuffled = [...embeddings].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map((w, i) => ({
      wineId: w.id,
      name: w.name,
      slug: w.slug,
      confidence: Math.max(0.1, 0.3 - i * 0.05),
    }));
  }

  const scored = embeddings.map((entry) => ({
    wineId: entry.id,
    name: entry.name,
    slug: entry.slug,
    confidence: Math.max(
      0,
      Math.min(1, cosineSimilarity(features, entry.embedding)),
    ),
  }));

  return scored.sort((a, b) => b.confidence - a.confidence).slice(0, count);
}

export async function findClosestWine(
  features: number[],
): Promise<MatchResult | null> {
  const results = await findClosestWines(features, 1);
  return results[0] ?? null;
}
