import { describe, it, expect, beforeEach } from "vitest";
import { useWishlistStore } from "./store";

describe("wishlist store", () => {
  beforeEach(() => {
    useWishlistStore.setState({ ids: [] });
  });

  describe("toggle", () => {
    it("adds an id when not present", () => {
      useWishlistStore.getState().toggle("wine-1");
      expect(useWishlistStore.getState().ids).toEqual(["wine-1"]);
    });

    it("removes an id when already present", () => {
      useWishlistStore.setState({ ids: ["wine-1", "wine-2"] });
      useWishlistStore.getState().toggle("wine-1");
      expect(useWishlistStore.getState().ids).toEqual(["wine-2"]);
    });

    it("can toggle multiple ids", () => {
      useWishlistStore.getState().toggle("wine-1");
      useWishlistStore.getState().toggle("wine-2");
      useWishlistStore.getState().toggle("wine-3");
      expect(useWishlistStore.getState().ids).toEqual([
        "wine-1",
        "wine-2",
        "wine-3",
      ]);
    });
  });

  describe("has", () => {
    it("returns true for existing id", () => {
      useWishlistStore.setState({ ids: ["wine-1"] });
      expect(useWishlistStore.getState().has("wine-1")).toBe(true);
    });

    it("returns false for non-existing id", () => {
      expect(useWishlistStore.getState().has("wine-1")).toBe(false);
    });
  });

  describe("clear", () => {
    it("removes all ids", () => {
      useWishlistStore.setState({ ids: ["wine-1", "wine-2"] });
      useWishlistStore.getState().clear();
      expect(useWishlistStore.getState().ids).toEqual([]);
    });
  });
});
