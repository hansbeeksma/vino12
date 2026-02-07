import { describe, it, expect } from "vitest";
import {
  formatPrice,
  formatPriceShort,
  typeColorHex,
  typeLabel,
  bodyLabel,
  bodyToNumber,
  slugify,
} from "./utils";

describe("formatPrice", () => {
  it("formats cents to EUR currency", () => {
    expect(formatPrice(1499)).toBe("€\u00A014,99");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("€\u00A00,00");
  });

  it("formats large amounts", () => {
    expect(formatPrice(12500)).toBe("€\u00A0125,00");
  });
});

describe("formatPriceShort", () => {
  it("formats cents to short EUR notation", () => {
    expect(formatPriceShort(1499)).toBe("€14,99");
  });

  it("formats zero", () => {
    expect(formatPriceShort(0)).toBe("€0,00");
  });

  it("formats exact euros without trailing zeros issue", () => {
    expect(formatPriceShort(1000)).toBe("€10,00");
  });
});

describe("typeColorHex", () => {
  it("returns wine color for red", () => {
    expect(typeColorHex("red")).toBe("#722F37");
  });

  it("returns emerald for white", () => {
    expect(typeColorHex("white")).toBe("#00674F");
  });

  it("returns pink for rosé", () => {
    expect(typeColorHex("rose")).toBe("#E8A0BF");
  });

  it("returns gold for sparkling", () => {
    expect(typeColorHex("sparkling")).toBe("#D4AF37");
  });

  it("returns all defined types", () => {
    const types = [
      "red",
      "white",
      "rose",
      "sparkling",
      "dessert",
      "fortified",
      "orange",
    ] as const;
    for (const type of types) {
      expect(typeColorHex(type)).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });
});

describe("typeLabel", () => {
  it("translates red to Rood", () => {
    expect(typeLabel("red")).toBe("Rood");
  });

  it("translates white to Wit", () => {
    expect(typeLabel("white")).toBe("Wit");
  });

  it("translates rose to Rosé", () => {
    expect(typeLabel("rose")).toBe("Rosé");
  });

  it("translates sparkling to Mousseux", () => {
    expect(typeLabel("sparkling")).toBe("Mousseux");
  });

  it("translates all types", () => {
    expect(typeLabel("dessert")).toBe("Dessert");
    expect(typeLabel("fortified")).toBe("Versterkt");
    expect(typeLabel("orange")).toBe("Oranje");
  });
});

describe("bodyLabel", () => {
  it("translates body to Dutch labels", () => {
    expect(bodyLabel("light")).toBe("Licht");
    expect(bodyLabel("medium_light")).toBe("Licht-Medium");
    expect(bodyLabel("medium")).toBe("Medium");
    expect(bodyLabel("medium_full")).toBe("Medium-Vol");
    expect(bodyLabel("full")).toBe("Vol");
  });

  it("returns Medium for null", () => {
    expect(bodyLabel(null)).toBe("Medium");
  });
});

describe("bodyToNumber", () => {
  it("maps body to 1-5 scale", () => {
    expect(bodyToNumber("light")).toBe(1);
    expect(bodyToNumber("medium_light")).toBe(2);
    expect(bodyToNumber("medium")).toBe(3);
    expect(bodyToNumber("medium_full")).toBe(4);
    expect(bodyToNumber("full")).toBe(5);
  });

  it("returns 3 for null", () => {
    expect(bodyToNumber(null)).toBe(3);
  });
});

describe("slugify", () => {
  it("converts text to URL-safe slug", () => {
    expect(slugify("Château Margaux")).toBe("chateau-margaux");
  });

  it("handles accented characters", () => {
    expect(slugify("Côtes du Rhône")).toBe("cotes-du-rhone");
  });

  it("handles multiple spaces and special chars", () => {
    expect(slugify("Wijn & Kaas  Combinatie!")).toBe(
      "wijn-kaas-combinatie",
    );
  });

  it("strips leading and trailing dashes", () => {
    expect(slugify("--test--")).toBe("test");
  });

  it("handles umlauts", () => {
    expect(slugify("Über Grüner")).toBe("uber-gruner");
  });

  it("handles ñ", () => {
    expect(slugify("España")).toBe("espana");
  });
});
