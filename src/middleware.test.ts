import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { NextRequest } from "next/server";

const mockGetUser = vi.fn();

vi.mock("@supabase/ssr", () => ({
  createServerClient: vi.fn(() => ({
    auth: { getUser: mockGetUser },
  })),
}));

import { middleware } from "./middleware";

const BASE_URL = "http://localhost:3000";

function makeRequest(path: string, cookies?: Record<string, string>) {
  const req = new NextRequest(`${BASE_URL}${path}`);
  if (cookies) {
    for (const [name, value] of Object.entries(cookies)) {
      req.cookies.set(name, value);
    }
  }
  return req;
}

function mockUser(overrides?: Record<string, unknown>) {
  return {
    id: "user-1",
    email: "user@test.nl",
    app_metadata: {},
    ...overrides,
  };
}

describe("middleware", () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
    process.env.ADMIN_EMAILS = "admin@vino12.nl";
    process.env.CONTRIBUTOR_EMAILS = "gabrielle@vino12.nl";
    mockGetUser.mockResolvedValue({ data: { user: null } });
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  // --- Skip paths ---

  describe("skip paths", () => {
    it("skips /api/webhooks", async () => {
      const res = await middleware(makeRequest("/api/webhooks/mollie"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("skips /_next", async () => {
      const res = await middleware(makeRequest("/_next/static/chunk.js"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("skips /favicon.ico", async () => {
      const res = await middleware(makeRequest("/favicon.ico"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("skips /auth/callback", async () => {
      const res = await middleware(makeRequest("/auth/callback"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("skips /api routes", async () => {
      const res = await middleware(makeRequest("/api/products"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });
  });

  // --- Missing Supabase env ---

  describe("missing Supabase env vars", () => {
    it("skips auth when SUPABASE_URL is missing", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_URL;

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });

    it("skips auth when ANON_KEY is missing", async () => {
      delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(mockGetUser).not.toHaveBeenCalled();
    });
  });

  // --- Admin routes ---

  describe("admin routes", () => {
    it("redirects to /login when not authenticated", async () => {
      const res = await middleware(makeRequest("/admin"));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/login");
      expect(location.searchParams.get("redirect")).toBe("/admin");
    });

    it("preserves deep admin path in redirect param", async () => {
      const res = await middleware(makeRequest("/admin/creative/boards"));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.searchParams.get("redirect")).toBe(
        "/admin/creative/boards",
      );
    });

    it("rewrites to geen-toegang for non-admin non-contributor", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "klant@test.nl" }) },
      });

      const res = await middleware(makeRequest("/admin"));

      // Rewrite returns 200 but with different URL
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toContain(
        "/admin/geen-toegang",
      );
    });

    it("allows admin via app_metadata.role", async () => {
      mockGetUser.mockResolvedValue({
        data: {
          user: mockUser({
            email: "someone@test.nl",
            app_metadata: { role: "admin" },
          }),
        },
      });

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("allows admin via ADMIN_EMAILS env", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "admin@vino12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("allows admin with case-insensitive email", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "Admin@VINO12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("allows contributor to access /admin", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "gabrielle@vino12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("allows contributor to access /admin/creative", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "gabrielle@vino12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin/creative"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });
  });

  // --- Contributor blocked paths ---

  describe("contributor blocked paths", () => {
    const blockedPaths = [
      "/admin/bestellingen",
      "/admin/wijnen",
      "/admin/klanten",
      "/admin/voorraad",
      "/admin/reviews",
      "/admin/instellingen",
      "/admin/leveranciers",
    ];

    for (const path of blockedPaths) {
      it(`blocks contributor from ${path}`, async () => {
        mockGetUser.mockResolvedValue({
          data: { user: mockUser({ email: "gabrielle@vino12.nl" }) },
        });

        const res = await middleware(makeRequest(path));
        expect(res.headers.get("x-middleware-rewrite")).toContain(
          "/admin/geen-toegang",
        );
      });
    }

    it("blocks contributor from nested blocked path", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "gabrielle@vino12.nl" }) },
      });

      const res = await middleware(
        makeRequest("/admin/bestellingen/order-123"),
      );
      expect(res.headers.get("x-middleware-rewrite")).toContain(
        "/admin/geen-toegang",
      );
    });

    it("allows admin to access blocked paths", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "admin@vino12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin/bestellingen"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });

    it("allows user who is both admin and contributor", async () => {
      process.env.ADMIN_EMAILS = "gabrielle@vino12.nl";
      process.env.CONTRIBUTOR_EMAILS = "gabrielle@vino12.nl";

      mockGetUser.mockResolvedValue({
        data: { user: mockUser({ email: "gabrielle@vino12.nl" }) },
      });

      const res = await middleware(makeRequest("/admin/bestellingen"));
      expect(res.status).toBe(200);
      expect(res.headers.get("x-middleware-rewrite")).toBeNull();
    });
  });

  // --- Auth-required routes ---

  describe("auth-required routes", () => {
    it("redirects /account to /login when not authenticated", async () => {
      const res = await middleware(makeRequest("/account"));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/login");
    });

    it("allows /account when authenticated", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser() },
      });

      const res = await middleware(makeRequest("/account"));
      expect(res.status).toBe(200);
    });
  });

  // --- Login redirect ---

  describe("login redirect", () => {
    it("redirects logged-in user from /login to /account", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser() },
      });

      const res = await middleware(makeRequest("/login"));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/account");
    });

    it("redirects to custom redirect param", async () => {
      mockGetUser.mockResolvedValue({
        data: { user: mockUser() },
      });

      const res = await middleware(makeRequest("/login?redirect=/admin"));

      expect(res.status).toBe(307);
      const location = new URL(res.headers.get("location")!);
      expect(location.pathname).toBe("/admin");
      expect(location.searchParams.has("redirect")).toBe(false);
    });

    it("does not redirect anonymous user from /login", async () => {
      const res = await middleware(makeRequest("/login"));
      expect(res.status).toBe(200);
    });
  });

  // --- Age verification ---

  describe("age verification", () => {
    it("sets x-age-verified: false when cookie is missing", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const res = await middleware(makeRequest("/wijnen"));
      expect(res.headers.get("x-age-verified")).toBe("false");
    });

    it("does not set header when age cookie is present", async () => {
      mockGetUser.mockResolvedValue({ data: { user: null } });

      const res = await middleware(
        makeRequest("/wijnen", { vino12_age_verified: "true" }),
      );
      expect(res.headers.get("x-age-verified")).toBeNull();
    });
  });

  // --- Error handling ---

  describe("error handling", () => {
    it("returns next() when Supabase throws", async () => {
      mockGetUser.mockRejectedValue(new Error("Connection failed"));

      const res = await middleware(makeRequest("/admin"));
      expect(res.status).toBe(200);
    });
  });
});
