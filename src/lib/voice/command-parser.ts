import wines from "@/data/wines.json";

export type VoiceCommand =
  | { type: "search"; query: string }
  | { type: "navigate"; target: string }
  | { type: "filter"; filter: string }
  | { type: "addToCart"; wineName: string }
  | { type: "recommend" }
  | { type: "pair"; dish: string }
  | { type: "surprise" }
  | { type: "info"; wineName: string }
  | { type: "unknown"; raw: string };

export interface ParseResult {
  command: VoiceCommand;
  confidence: number;
  spokenResponse?: string;
}

const WINE_NAMES = wines.map((w) => w.name.toLowerCase());

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

function findWineByPairing(dish: string): (typeof wines)[number] | null {
  const dishLower = dish.toLowerCase();

  for (const wine of wines) {
    for (const pairing of wine.pairings) {
      if (
        pairing.toLowerCase().includes(dishLower) ||
        dishLower.includes(pairing.toLowerCase())
      ) {
        return wine;
      }
    }
  }

  // Fuzzy fallback: check word overlap
  for (const wine of wines) {
    const dishWords = dishLower.split(/\s+/);
    for (const pairing of wine.pairings) {
      const pairingLower = pairing.toLowerCase();
      for (const word of dishWords) {
        if (word.length > 3 && pairingLower.includes(word)) {
          return wine;
        }
      }
    }
  }

  return null;
}

export function parseCommand(transcript: string): ParseResult {
  const text = transcript.toLowerCase().trim();

  // Recommend: "wat raad je aan", "aanbeveling", "suggestie"
  const recommendPatterns = [
    /(?:wat\s+)?raad\s+je\s+aan/,
    /aanbeveling/,
    /suggestie/,
    /(?:geef|doe)\s+(?:me\s+)?(?:een\s+)?aanbeveling/,
    /wat\s+is\s+(?:er\s+)?(?:lekker|goed|populair)/,
  ];
  for (const pattern of recommendPatterns) {
    if (pattern.test(text)) {
      return {
        command: { type: "recommend" },
        confidence: 0.9,
        spokenResponse: "Ik zoek een aanbeveling voor je...",
      };
    }
  }

  // Pair: "wat past bij [gerecht]", "bij carbonara", "combineer met"
  const pairPatterns = [
    /(?:wat\s+)?past\s+(?:er\s+)?bij\s+(.+)/,
    /(?:wat\s+)?drink\s+(?:je\s+)?bij\s+(.+)/,
    /(?:wijn\s+)?bij\s+(.+)/,
    /combineer\s+(?:met\s+)?(.+)/,
    /(?:welke\s+wijn\s+)?(?:hoort|past)\s+bij\s+(.+)/,
  ];
  for (const pattern of pairPatterns) {
    const match = text.match(pattern);
    if (match) {
      const dish = match[1].trim();
      return {
        command: { type: "pair", dish },
        confidence: 0.9,
        spokenResponse: `Ik zoek een wijn bij ${dish} voor je...`,
      };
    }
  }

  // Surprise: "verras me", "iets nieuws", "buiten comfort zone"
  const surprisePatterns = [
    /verras\s+me/,
    /iets\s+(?:nieuws|anders|verrassends)/,
    /buiten\s+(?:mijn\s+)?comfort\s*zone/,
    /random\s+wijn/,
    /kies\s+(?:maar\s+)?(?:voor\s+me|iets)/,
  ];
  for (const pattern of surprisePatterns) {
    if (pattern.test(text)) {
      return {
        command: { type: "surprise" },
        confidence: 0.9,
        spokenResponse: "Ik verras je met een bijzondere wijn!",
      };
    }
  }

  // Info: "vertel over [wijn]", "info over [wijn]", "wat weet je van"
  const infoPatterns = [
    /(?:vertel|meer)\s+(?:me\s+)?(?:over|van)\s+(.+)/,
    /info(?:rmatie)?\s+(?:over|van)\s+(.+)/,
    /wat\s+(?:weet|kun)\s+je\s+(?:over|van)\s+(.+)/,
    /(?:beschrijf|uitleg)\s+(.+)/,
  ];
  for (const pattern of infoPatterns) {
    const match = text.match(pattern);
    if (match) {
      const wineInput = match[1].trim();
      const wineMatch = findClosestWine(wineInput);
      if (wineMatch) {
        return {
          command: { type: "info", wineName: wineMatch.name },
          confidence: wineMatch.score,
          spokenResponse: `Ik zoek informatie over ${wineMatch.name}...`,
        };
      }
    }
  }

  // Search commands: "zoek [query]", "zoeken naar [query]", "vind [query]"
  const searchPatterns = [
    /^zoek(?:en)?\s+(?:naar\s+)?(.+)/,
    /^vind\s+(.+)/,
    /^search\s+(.+)/,
  ];
  for (const pattern of searchPatterns) {
    const match = text.match(pattern);
    if (match) {
      return {
        command: { type: "search", query: match[1] },
        confidence: 0.9,
        spokenResponse: `Ik zoek ${match[1]} voor je...`,
      };
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

  // Add to cart / reorder: "voeg [wijn] toe", "bestel [wijn]", "bestel opnieuw"
  const reorderPatterns = [
    /bestel\s+opnieuw/,
    /dezelfde\s+als\s+(?:vorige|laatste)\s+keer/,
    /nogmaals\s+bestellen/,
  ];
  for (const pattern of reorderPatterns) {
    if (pattern.test(text)) {
      return {
        command: { type: "addToCart", wineName: "" },
        confidence: 0.85,
        spokenResponse: "Ik voeg je vorige bestelling toe...",
      };
    }
  }

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
          spokenResponse: `Ik voeg ${wineMatch.name} toe aan je winkelwagen...`,
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
      spokenResponse: `Ik zoek ${wineMatch.name} voor je...`,
    };
  }

  return { command: { type: "unknown", raw: text }, confidence: 0 };
}

export { findWineByPairing };
