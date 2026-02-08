import { describe, it, expect } from "vitest";
import { cosineSimilarity, findWineByText } from "./wine-matcher";

describe("cosineSimilarity", () => {
  it("returns 1 for identical vectors", () => {
    expect(cosineSimilarity([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 5);
  });

  it("returns 0 for orthogonal vectors", () => {
    expect(cosineSimilarity([1, 0], [0, 1])).toBeCloseTo(0, 5);
  });

  it("returns 0 for empty vectors", () => {
    expect(cosineSimilarity([], [])).toBe(0);
  });

  it("returns 0 for vectors of different lengths", () => {
    expect(cosineSimilarity([1, 2], [1, 2, 3])).toBe(0);
  });

  it("returns 0 for zero vectors", () => {
    expect(cosineSimilarity([0, 0, 0], [0, 0, 0])).toBe(0);
  });

  it("handles negative values", () => {
    const result = cosineSimilarity([1, -1], [-1, 1]);
    expect(result).toBeCloseTo(-1, 5);
  });

  it("returns high similarity for similar vectors", () => {
    const result = cosineSimilarity([1, 2, 3], [1, 2, 4]);
    expect(result).toBeGreaterThan(0.9);
  });
});

describe("findWineByText", () => {
  it("finds wine by exact name", () => {
    const results = findWineByText("Pinot Noir");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Pinot Noir");
    expect(results[0].confidence).toBe(1);
  });

  it("finds wine by case-insensitive name", () => {
    const results = findWineByText("pinot noir");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Pinot Noir");
  });

  it("finds wine by grape name", () => {
    const results = findWineByText("Gamay");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Gamay");
  });

  it("finds wine by region", () => {
    const results = findWineByText("Chablis");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Chardonnay");
  });

  it("finds wine by partial name", () => {
    const results = findWineByText("Cabernet");
    expect(results.length).toBeGreaterThan(0);
    const names = results.map((r) => r.name);
    expect(names).toContain("Cabernet Franc");
    expect(names).toContain("Cabernet Sauvignon");
  });

  it("returns empty array for non-matching query", () => {
    const results = findWineByText("xxxxzzzz");
    expect(results).toEqual([]);
  });

  it("results are sorted by confidence (descending)", () => {
    const results = findWineByText("Cabernet");
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].confidence).toBeGreaterThanOrEqual(
        results[i].confidence,
      );
    }
  });

  it("finds wine by country name", () => {
    const results = findWineByText("Argentinië");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].name).toBe("Cabernet Sauvignon");
  });
});
