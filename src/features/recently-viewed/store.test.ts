import { describe, it, expect, beforeEach } from "vitest";
import { useRecentlyViewedStore } from "./store";

describe("recently-viewed store", () => {
  beforeEach(() => {
    useRecentlyViewedStore.setState({ slugs: [] });
  });

  describe("addViewed", () => {
    it("adds a slug to the front", () => {
      useRecentlyViewedStore.getState().addViewed("pinot-noir");
      expect(useRecentlyViewedStore.getState().slugs).toEqual(["pinot-noir"]);
    });

    it("moves existing slug to front (no duplicates)", () => {
      useRecentlyViewedStore.getState().addViewed("pinot-noir");
      useRecentlyViewedStore.getState().addViewed("chardonnay");
      useRecentlyViewedStore.getState().addViewed("pinot-noir");

      const slugs = useRecentlyViewedStore.getState().slugs;
      expect(slugs).toEqual(["pinot-noir", "chardonnay"]);
    });

    it("limits to 6 entries", () => {
      const wines = [
        "wine-1",
        "wine-2",
        "wine-3",
        "wine-4",
        "wine-5",
        "wine-6",
        "wine-7",
      ];
      for (const slug of wines) {
        useRecentlyViewedStore.getState().addViewed(slug);
      }

      const slugs = useRecentlyViewedStore.getState().slugs;
      expect(slugs).toHaveLength(6);
      expect(slugs[0]).toBe("wine-7"); // most recent first
      expect(slugs).not.toContain("wine-1"); // oldest dropped
    });

    it("maintains order with most recent first", () => {
      useRecentlyViewedStore.getState().addViewed("wine-a");
      useRecentlyViewedStore.getState().addViewed("wine-b");
      useRecentlyViewedStore.getState().addViewed("wine-c");

      expect(useRecentlyViewedStore.getState().slugs).toEqual([
        "wine-c",
        "wine-b",
        "wine-a",
      ]);
    });
  });

  describe("clear", () => {
    it("removes all slugs", () => {
      useRecentlyViewedStore.getState().addViewed("pinot-noir");
      useRecentlyViewedStore.getState().addViewed("chardonnay");
      useRecentlyViewedStore.getState().clear();

      expect(useRecentlyViewedStore.getState().slugs).toEqual([]);
    });
  });
});
