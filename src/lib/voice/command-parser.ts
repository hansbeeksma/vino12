import wines from "@/data/wines.json";

export type VoiceCommand =
  | { type: "search"; query: string }
  | { type: "navigate"; target: string }
  | { type: "filter"; filter: string }
  | { type: "addToCart"; wineName: string }
  | { type: "unknown"; raw: string };

interface ParseResult {
  command: VoiceCommand;
  confidence: number;
}

const WINE_NAMES = wines.map((w) => w.name.toLowerCase());

// Simple string distance for fuzzy matching
function similarity(a: string, b: string): number {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  if (aLower === bLower) return 1;
  if (aLower.includes(bLower) || bLower.includes(aLower)) return 0.8;

  let matches = 0;
  const words = aLower.split(/\s+/);
  for (const word of words) {
    if (bLower.includes(word)) matches++;
  }
  return words.length > 0 ? matches / words.length : 0;
}

function findClosestWine(
  input: string,
): { name: string; score: number } | null {
  let bestMatch: { name: string; score: number } | null = null;

  for (const wineName of WINE_NAMES) {
    const score = similarity(input, wineName);
    if (score > 0.4 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { name: wineName, score };
    }
  }

  return bestMatch;
}

export function parseCommand(transcript: string): ParseResult {
  const text = transcript.toLowerCase().trim();

  // Search commands: "zoek [query]", "zoeken naar [query]", "vind [query]"
  const searchPatterns = [
    /^zoek(?:en)?\s+(?:naar\s+)?(.+)/,
    /^vind\s+(.+)/,
    /^search\s+(.+)/,
  ];
  for (const pattern of searchPatterns) {
    const match = text.match(pattern);
    if (match) {
      return { command: { type: "search", query: match[1] }, confidence: 0.9 };
    }
  }

  // Navigation: "ga naar [target]", "open [target]"
  const navMap: Record<string, string> = {
    winkelwagen: "/winkelwagen",
    winkelmand: "/winkelwagen",
    cart: "/winkelwagen",
    collectie: "/wijnen",
    wijnen: "/wijnen",
    home: "/",
    account: "/account",
    afrekenen: "/afrekenen",
    betalen: "/afrekenen",
    "ar scanner": "/ar",
    scanner: "/scan",
    scan: "/scan",
  };

  const navPatterns = [
    /^(?:ga\s+naar|open|toon|laat\s+.+\s+zien)\s+(?:de\s+|het\s+|mijn\s+)?(.+)/,
    /^naar\s+(?:de\s+|het\s+)?(.+)/,
  ];
  for (const pattern of navPatterns) {
    const match = text.match(pattern);
    if (match) {
      const target = match[1].trim();
      const path = navMap[target];
      if (path) {
        return {
          command: { type: "navigate", target: path },
          confidence: 0.9,
        };
      }
    }
  }

  // Filter: "toon rode wijnen", "laat witte wijnen zien", "filter op rood"
  const filterMap: Record<string, string> = {
    rood: "red",
    rode: "red",
    wit: "white",
    witte: "white",
    rosé: "rose",
    rose: "rose",
    mousseux: "sparkling",
    mousserend: "sparkling",
    bubbels: "sparkling",
    dessert: "dessert",
    oranje: "orange",
  };

  const filterPatterns = [
    /(?:toon|filter|laat\s+.+\s+zien)\s+(?:op\s+)?(\w+)\s+wijn/,
    /(\w+)\s+wijnen/,
  ];
  for (const pattern of filterPatterns) {
    const match = text.match(pattern);
    if (match) {
      const filterType = filterMap[match[1]];
      if (filterType) {
        return {
          command: { type: "filter", filter: filterType },
          confidence: 0.85,
        };
      }
    }
  }

  // Add to cart: "voeg [wijn] toe", "bestel [wijn]"
  const addPatterns = [
    /^voeg\s+(.+?)(?:\s+toe)?$/,
    /^bestel\s+(.+)/,
    /^(?:een|twee|drie)?\s*(.+?)\s+(?:in\s+de\s+)?(?:winkelwagen|winkelmand)/,
  ];
  for (const pattern of addPatterns) {
    const match = text.match(pattern);
    if (match) {
      const wineInput = match[1].trim();
      const wineMatch = findClosestWine(wineInput);
      if (wineMatch) {
        return {
          command: { type: "addToCart", wineName: wineMatch.name },
          confidence: wineMatch.score,
        };
      }
    }
  }

  // Direct wine name detection (if just a wine name is spoken)
  const wineMatch = findClosestWine(text);
  if (wineMatch && wineMatch.score > 0.7) {
    return {
      command: { type: "search", query: wineMatch.name },
      confidence: wineMatch.score,
    };
  }

  return { command: { type: "unknown", raw: text }, confidence: 0 };
}
