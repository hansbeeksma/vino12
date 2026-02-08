import { describe, it, expect } from "vitest";
import { parseCommand, findWineByPairing } from "./command-parser";

describe("parseCommand", () => {
  describe("search", () => {
    it('parses "zoek pinot noir"', () => {
      const result = parseCommand("zoek pinot noir");
      expect(result.command.type).toBe("search");
      if (result.command.type === "search") {
        expect(result.command.query).toBe("pinot noir");
      }
      expect(result.confidence).toBe(0.9);
    });

    it('parses "zoeken naar riesling"', () => {
      const result = parseCommand("zoeken naar riesling");
      expect(result.command.type).toBe("search");
      if (result.command.type === "search") {
        expect(result.command.query).toBe("riesling");
      }
    });

    it('parses "vind merlot"', () => {
      const result = parseCommand("vind merlot");
      expect(result.command.type).toBe("search");
    });
  });

  describe("navigate", () => {
    it('parses "ga naar winkelwagen"', () => {
      const result = parseCommand("ga naar winkelwagen");
      expect(result.command.type).toBe("navigate");
      if (result.command.type === "navigate") {
        expect(result.command.target).toBe("/winkelwagen");
      }
    });

    it('parses "open de collectie"', () => {
      const result = parseCommand("open de collectie");
      expect(result.command.type).toBe("navigate");
      if (result.command.type === "navigate") {
        expect(result.command.target).toBe("/wijnen");
      }
    });
  });

  describe("filter", () => {
    it('parses "rode wijnen"', () => {
      const result = parseCommand("rode wijnen");
      expect(result.command.type).toBe("filter");
      if (result.command.type === "filter") {
        expect(result.command.filter).toBe("red");
      }
    });

    it('parses "witte wijnen"', () => {
      const result = parseCommand("witte wijnen");
      expect(result.command.type).toBe("filter");
      if (result.command.type === "filter") {
        expect(result.command.filter).toBe("white");
      }
    });
  });

  describe("recommend", () => {
    it('parses "wat raad je aan"', () => {
      const result = parseCommand("wat raad je aan");
      expect(result.command.type).toBe("recommend");
      expect(result.confidence).toBe(0.9);
      expect(result.spokenResponse).toBeTruthy();
    });

    it('parses "aanbeveling"', () => {
      const result = parseCommand("aanbeveling");
      expect(result.command.type).toBe("recommend");
    });

    it('parses "suggestie"', () => {
      const result = parseCommand("suggestie");
      expect(result.command.type).toBe("recommend");
    });

    it('parses "geef me een aanbeveling"', () => {
      const result = parseCommand("geef me een aanbeveling");
      expect(result.command.type).toBe("recommend");
    });

    it('parses "wat is er lekker"', () => {
      const result = parseCommand("wat is er lekker");
      expect(result.command.type).toBe("recommend");
    });
  });

  describe("pair", () => {
    it('parses "wat past bij steak"', () => {
      const result = parseCommand("wat past bij steak");
      expect(result.command.type).toBe("pair");
      if (result.command.type === "pair") {
        expect(result.command.dish).toBe("steak");
      }
      expect(result.spokenResponse).toContain("steak");
    });

    it('parses "wat drink je bij pasta"', () => {
      const result = parseCommand("wat drink je bij pasta");
      expect(result.command.type).toBe("pair");
      if (result.command.type === "pair") {
        expect(result.command.dish).toBe("pasta");
      }
    });

    it('parses "bij carbonara"', () => {
      const result = parseCommand("bij carbonara");
      expect(result.command.type).toBe("pair");
      if (result.command.type === "pair") {
        expect(result.command.dish).toBe("carbonara");
      }
    });

    it('parses "combineer met vis"', () => {
      const result = parseCommand("combineer met vis");
      expect(result.command.type).toBe("pair");
      if (result.command.type === "pair") {
        expect(result.command.dish).toBe("vis");
      }
    });
  });

  describe("surprise", () => {
    it('parses "verras me"', () => {
      const result = parseCommand("verras me");
      expect(result.command.type).toBe("surprise");
      expect(result.confidence).toBe(0.9);
      expect(result.spokenResponse).toBeTruthy();
    });

    it('parses "iets nieuws"', () => {
      const result = parseCommand("iets nieuws");
      expect(result.command.type).toBe("surprise");
    });

    it('parses "iets anders"', () => {
      const result = parseCommand("iets anders");
      expect(result.command.type).toBe("surprise");
    });

    it('parses "buiten mijn comfort zone"', () => {
      const result = parseCommand("buiten mijn comfort zone");
      expect(result.command.type).toBe("surprise");
    });
  });

  describe("info", () => {
    it('parses "vertel over merlot"', () => {
      const result = parseCommand("vertel over merlot");
      expect(result.command.type).toBe("info");
      if (result.command.type === "info") {
        expect(result.command.wineName).toBe("merlot");
      }
    });

    it('parses "info over chardonnay"', () => {
      const result = parseCommand("info over chardonnay");
      expect(result.command.type).toBe("info");
      if (result.command.type === "info") {
        expect(result.command.wineName).toBe("chardonnay");
      }
    });

    it('parses "wat weet je van riesling"', () => {
      const result = parseCommand("wat weet je van riesling");
      expect(result.command.type).toBe("info");
      if (result.command.type === "info") {
        expect(result.command.wineName).toBe("riesling");
      }
    });
  });

  describe("addToCart / reorder", () => {
    it('parses "bestel opnieuw"', () => {
      const result = parseCommand("bestel opnieuw");
      expect(result.command.type).toBe("addToCart");
    });

    it('parses "voeg merlot toe"', () => {
      const result = parseCommand("voeg merlot toe");
      expect(result.command.type).toBe("addToCart");
      if (result.command.type === "addToCart") {
        expect(result.command.wineName).toBe("merlot");
      }
    });
  });

  describe("unknown", () => {
    it("returns unknown for gibberish", () => {
      const result = parseCommand("blablabla xxxxzzzz");
      expect(result.command.type).toBe("unknown");
      expect(result.confidence).toBe(0);
    });
  });

  describe("case insensitivity", () => {
    it("handles uppercase input", () => {
      const result = parseCommand("ZOEK PINOT NOIR");
      expect(result.command.type).toBe("search");
    });

    it("handles mixed case", () => {
      const result = parseCommand("Wat Raad Je Aan");
      expect(result.command.type).toBe("recommend");
    });
  });
});

describe("findWineByPairing", () => {
  it("finds wine by exact pairing", () => {
    const wine = findWineByPairing("Gegrilde zalm");
    expect(wine).not.toBeNull();
    expect(wine!.name).toBe("Pinot Noir");
  });

  it("finds wine by partial pairing", () => {
    const wine = findWineByPairing("zalm");
    expect(wine).not.toBeNull();
    expect(wine!.name).toBe("Pinot Noir");
  });

  it("finds wine for steak pairing", () => {
    const wine = findWineByPairing("steak");
    expect(wine).not.toBeNull();
    expect(wine!.name).toBe("Cabernet Sauvignon");
  });

  it("finds wine for sushi pairing", () => {
    const wine = findWineByPairing("Sushi");
    expect(wine).not.toBeNull();
    expect(wine!.name).toBe("Sauvignon Blanc");
  });

  it("returns null for unknown dish", () => {
    const wine = findWineByPairing("xxxxzzzz");
    expect(wine).toBeNull();
  });
});
