import { describe, it, expect } from "vitest";
import { blogPosts, getBlogPostBySlug, blogCategories } from "./blog-posts";

describe("blogPosts", () => {
  it("has at least one post", () => {
    expect(blogPosts.length).toBeGreaterThan(0);
  });

  it("each post has required fields", () => {
    for (const post of blogPosts) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.excerpt).toBeTruthy();
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(post.readTime).toBeGreaterThan(0);
      expect(post.content).toBeTruthy();
      expect(Object.keys(blogCategories)).toContain(post.category);
    }
  });

  it("has unique slugs", () => {
    const slugs = blogPosts.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("getBlogPostBySlug", () => {
  it("returns post for valid slug", () => {
    const post = getBlogPostBySlug("perfecte-wijn-kaas-combinatie");
    expect(post).toBeDefined();
    expect(post?.title).toBe("De Perfecte Wijn & Kaas Combinatie");
  });

  it("returns undefined for invalid slug", () => {
    expect(getBlogPostBySlug("non-existing")).toBeUndefined();
  });
});

describe("blogCategories", () => {
  it("has Dutch labels for all categories", () => {
    expect(blogCategories["wijn-101"]).toBe("Wijn 101");
    expect(blogCategories["food-pairing"]).toBe("Food Pairing");
    expect(blogCategories.regio).toBe("Wijnregio's");
    expect(blogCategories.seizoen).toBe("Seizoen");
  });
});
