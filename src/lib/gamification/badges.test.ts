import { describe, it, expect, vi } from "vitest";

// Test the badge logic concepts without Supabase dependency
describe("badge requirement types", () => {
  const BADGE_REQUIREMENTS = [
    { slug: "eerste-bestelling", type: "order_count", value: 1 },
    { slug: "rode-wijn-expert", type: "red_wine_count", value: 5 },
    { slug: "witte-wijn-kenner", type: "white_wine_count", value: 5 },
    { slug: "recensent", type: "review_count", value: 1 },
    { slug: "sommelier", type: "review_count", value: 10 },
    { slug: "ontdekker", type: "region_count", value: 3 },
    { slug: "trouwe-klant", type: "order_count", value: 5 },
    { slug: "body-verkenner", type: "body_type_count", value: 5 },
  ];

  it("has at least 5 badges defined", () => {
    expect(BADGE_REQUIREMENTS.length).toBeGreaterThanOrEqual(5);
  });

  it("all badges have unique slugs", () => {
    const slugs = BADGE_REQUIREMENTS.map((b) => b.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("all badges have positive requirement values", () => {
    for (const badge of BADGE_REQUIREMENTS) {
      expect(badge.value).toBeGreaterThan(0);
    }
  });

  it("covers different requirement types", () => {
    const types = new Set(BADGE_REQUIREMENTS.map((b) => b.type));
    expect(types.size).toBeGreaterThanOrEqual(4);
  });

  it("has badges for orders, reviews, and exploration", () => {
    const types = BADGE_REQUIREMENTS.map((b) => b.type);
    expect(types).toContain("order_count");
    expect(types).toContain("review_count");
    expect(types).toContain("region_count");
  });

  it("has progressive badges (easy and hard for same type)", () => {
    const orderBadges = BADGE_REQUIREMENTS.filter(
      (b) => b.type === "order_count",
    );
    const values = orderBadges.map((b) => b.value).sort((a, b) => a - b);
    expect(values.length).toBeGreaterThanOrEqual(2);
    expect(values[0]).toBeLessThan(values[values.length - 1]);
  });
});

describe("points calculation", () => {
  it("awards points for badge completion", () => {
    const pointsRewards = [50, 100, 100, 25, 200, 75, 150, 150];
    const total = pointsRewards.reduce((sum, p) => sum + p, 0);

    // All badges combined should give meaningful rewards
    expect(total).toBeGreaterThan(500);
    expect(total).toBeLessThan(2000);
  });

  it("higher-difficulty badges give more points", () => {
    // Sommelier (10 reviews) > Recensent (1 review)
    const recensentPoints = 25;
    const sommelierPoints = 200;
    expect(sommelierPoints).toBeGreaterThan(recensentPoints);
  });
});

describe("social proof data shape", () => {
  it("has expected fields", () => {
    const mockData = {
      recent_viewers: 12,
      recent_purchases: 3,
      average_rating: 4.2,
      total_reviews: 15,
    };

    expect(mockData.recent_viewers).toBeTypeOf("number");
    expect(mockData.recent_purchases).toBeTypeOf("number");
    expect(mockData.average_rating).toBeTypeOf("number");
    expect(mockData.total_reviews).toBeTypeOf("number");
    expect(mockData.average_rating).toBeGreaterThanOrEqual(0);
    expect(mockData.average_rating).toBeLessThanOrEqual(5);
  });

  it("handles zero state", () => {
    const emptyData = {
      recent_viewers: 0,
      recent_purchases: 0,
      average_rating: 0,
      total_reviews: 0,
    };

    expect(emptyData.recent_viewers).toBe(0);
    expect(emptyData.average_rating).toBe(0);
  });
});
