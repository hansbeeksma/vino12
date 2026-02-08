import wines from "@/data/wines.json";

interface WineEmbedding {
  id: number;
  name: string;
  slug: string;
  embedding: number[];
}

interface MatchResult {
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
      // Fallback: return wine data without embeddings for graceful degradation
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

function cosineSimilarity(a: number[], b: number[]): number {
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

export async function extractFeatures(imageData: ImageData): Promise<number[]> {
  // Dynamic import TensorFlow.js + MobileNet only when needed
  const tf = await import("@tensorflow/tfjs");
  const mobilenet = await import("@tensorflow-models/mobilenet");

  const model = await mobilenet.load({ version: 2, alpha: 0.5 });

  // Convert ImageData to tensor
  const tensor = tf.browser
    .fromPixels(imageData)
    .resizeBilinear([224, 224])
    .expandDims(0)
    .toFloat()
    .div(255);

  // Get infer (feature vector) — penultimate layer
  const features = model.infer(tensor, true);
  const featureData = await (
    features as { data: () => Promise<Float32Array> }
  ).data();
  const featureArray = Array.from(featureData);

  // Cleanup
  tensor.dispose();
  (features as { dispose: () => void }).dispose();

  return featureArray;
}

export async function findClosestWine(
  features: number[],
): Promise<MatchResult | null> {
  const embeddings = await loadEmbeddings();

  if (embeddings.length === 0) return null;

  // If no pre-computed embeddings, return closest by random
  const hasEmbeddings = embeddings[0].embedding.length > 0;

  if (!hasEmbeddings) {
    // Fallback: no embeddings available, return random match with low confidence
    const randomWine =
      embeddings[Math.floor(Math.random() * embeddings.length)];
    return {
      wineId: randomWine.id,
      name: randomWine.name,
      slug: randomWine.slug,
      confidence: 0.3,
    };
  }

  let bestMatch: MatchResult | null = null;
  let bestScore = -1;

  for (const entry of embeddings) {
    const score = cosineSimilarity(features, entry.embedding);
    if (score > bestScore) {
      bestScore = score;
      bestMatch = {
        wineId: entry.id,
        name: entry.name,
        slug: entry.slug,
        confidence: Math.max(0, Math.min(1, score)),
      };
    }
  }

  return bestMatch;
}
