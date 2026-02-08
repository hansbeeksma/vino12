import { describe, it, expect } from "vitest";
import { ideaInputSchema } from "./idea-input";

describe("ideaInputSchema", () => {
  it("accepts valid web idea", () => {
    const result = ideaInputSchema.safeParse({
      message: "Een geweldig nieuw wijn idee",
      source: "web",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.message).toBe("Een geweldig nieuw wijn idee");
      expect(result.data.source).toBe("web");
    }
  });

  it("accepts valid voice idea", () => {
    const result = ideaInputSchema.safeParse({
      message: "Gedicteerd idee over branding",
      source: "voice",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("voice");
    }
  });

  it("defaults source to web", () => {
    const result = ideaInputSchema.safeParse({
      message: "Idee zonder source",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.source).toBe("web");
    }
  });

  it("rejects message shorter than 3 chars", () => {
    const result = ideaInputSchema.safeParse({
      message: "ab",
      source: "web",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message longer than 5000 chars", () => {
    const result = ideaInputSchema.safeParse({
      message: "a".repeat(5001),
      source: "web",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid source", () => {
    const result = ideaInputSchema.safeParse({
      message: "Test idee",
      source: "whatsapp",
    });
    expect(result.success).toBe(false);
  });

  it("accepts optional tags", () => {
    const result = ideaInputSchema.safeParse({
      message: "Idee met tags",
      source: "web",
      tags: ["branding", "marketing"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toEqual(["branding", "marketing"]);
    }
  });

  it("rejects more than 10 tags", () => {
    const result = ideaInputSchema.safeParse({
      message: "Te veel tags",
      source: "web",
      tags: Array.from({ length: 11 }, (_, i) => `tag${i}`),
    });
    expect(result.success).toBe(false);
  });

  it("rejects tag longer than 50 chars", () => {
    const result = ideaInputSchema.safeParse({
      message: "Lange tag",
      source: "web",
      tags: ["a".repeat(51)],
    });
    expect(result.success).toBe(false);
  });

  it("accepts missing tags field", () => {
    const result = ideaInputSchema.safeParse({
      message: "Geen tags",
      source: "web",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.tags).toBeUndefined();
    }
  });

  it("rejects missing message", () => {
    const result = ideaInputSchema.safeParse({
      source: "web",
    });
    expect(result.success).toBe(false);
  });

  it("accepts exactly 3 char message", () => {
    const result = ideaInputSchema.safeParse({
      message: "abc",
      source: "web",
    });
    expect(result.success).toBe(true);
  });

  it("accepts exactly 5000 char message", () => {
    const result = ideaInputSchema.safeParse({
      message: "a".repeat(5000),
      source: "web",
    });
    expect(result.success).toBe(true);
  });
});
