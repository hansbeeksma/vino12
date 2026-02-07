import { describe, it, expect } from "vitest";
import { wineTypeSchema, wineBodySchema, wineSchema } from "./wine";

describe("wineTypeSchema", () => {
  it("accepts all wine types", () => {
    const types = [
      "red",
      "white",
      "rose",
      "sparkling",
      "dessert",
      "fortified",
      "orange",
    ];
    for (const type of types) {
      expect(wineTypeSchema.safeParse(type).success).toBe(true);
    }
  });

  it("rejects invalid type", () => {
    expect(wineTypeSchema.safeParse("beer").success).toBe(false);
  });
});

describe("wineBodySchema", () => {
  it("accepts all body types", () => {
    const bodies = [
      "light",
      "medium_light",
      "medium",
      "medium_full",
      "full",
    ];
    for (const body of bodies) {
      expect(wineBodySchema.safeParse(body).success).toBe(true);
    }
  });

  it("rejects invalid body", () => {
    expect(wineBodySchema.safeParse("heavy").success).toBe(false);
  });
});

describe("wineSchema", () => {
  const validWine = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "Château Test",
    slug: "chateau-test",
    description: "A fine test wine",
    type: "red",
    body: "medium",
    producer_id: null,
    region_id: null,
    vintage: 2022,
    alcohol_percentage: 13.5,
    price_cents: 1499,
    compare_at_price_cents: null,
    sku: "TST-001",
    image_url: null,
    thumbnail_url: null,
    is_active: true,
    is_featured: false,
    tasting_notes: "Cherry and oak",
    food_pairing: "Red meat",
    serving_temperature: "16-18°C",
    stock_quantity: 24,
    volume_ml: 750,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
  };

  it("accepts valid wine data", () => {
    const result = wineSchema.safeParse(validWine);
    expect(result.success).toBe(true);
  });

  it("requires price_cents as integer", () => {
    const result = wineSchema.safeParse({
      ...validWine,
      price_cents: 14.99,
    });
    expect(result.success).toBe(false);
  });

  it("requires valid UUID for id", () => {
    const result = wineSchema.safeParse({ ...validWine, id: "not-a-uuid" });
    expect(result.success).toBe(false);
  });

  it("allows nullable fields", () => {
    const result = wineSchema.safeParse({
      ...validWine,
      description: null,
      body: null,
      vintage: null,
      alcohol_percentage: null,
    });
    expect(result.success).toBe(true);
  });
});
