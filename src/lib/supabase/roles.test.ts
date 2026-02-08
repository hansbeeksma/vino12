import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("./server", () => ({
  createServerSupabaseClient: vi.fn(),
}));

import { getUserRole } from "./roles";
import { createServerSupabaseClient } from "./server";

const mockCreateServerSupabaseClient = createServerSupabaseClient as ReturnType<
  typeof vi.fn
>;

function mockSupabaseUser(
  user: {
    id: string;
    email?: string;
    app_metadata?: Record<string, unknown>;
  } | null,
) {
  mockCreateServerSupabaseClient.mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user },
      }),
    },
  });
}

describe("getUserRole", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns null when no user is authenticated", async () => {
    mockSupabaseUser(null);
    const result = await getUserRole();
    expect(result).toBeNull();
  });

  it("returns admin role for user with admin app_metadata", async () => {
    mockSupabaseUser({
      id: "user-1",
      email: "random@example.com",
      app_metadata: { role: "admin" },
    });

    const result = await getUserRole();
    expect(result).toEqual({
      user: { id: "user-1", email: "random@example.com" },
      role: "admin",
    });
  });

  it("returns admin role for user in ADMIN_EMAILS", async () => {
    process.env.ADMIN_EMAILS = "admin@vino12.com, BOSS@vino12.com";

    mockSupabaseUser({
      id: "user-2",
      email: "Admin@vino12.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result).toEqual({
      user: { id: "user-2", email: "Admin@vino12.com" },
      role: "admin",
    });
  });

  it("returns contributor role for user in CONTRIBUTOR_EMAILS", async () => {
    process.env.CONTRIBUTOR_EMAILS = "gabrielle@example.com";

    mockSupabaseUser({
      id: "user-3",
      email: "Gabrielle@example.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result).toEqual({
      user: { id: "user-3", email: "Gabrielle@example.com" },
      role: "contributor",
    });
  });

  it("returns customer role for unknown user", async () => {
    process.env.ADMIN_EMAILS = "admin@vino12.com";
    process.env.CONTRIBUTOR_EMAILS = "gabrielle@example.com";

    mockSupabaseUser({
      id: "user-4",
      email: "klant@gmail.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result).toEqual({
      user: { id: "user-4", email: "klant@gmail.com" },
      role: "customer",
    });
  });

  it("admin takes precedence over contributor", async () => {
    process.env.ADMIN_EMAILS = "both@vino12.com";
    process.env.CONTRIBUTOR_EMAILS = "both@vino12.com";

    mockSupabaseUser({
      id: "user-5",
      email: "both@vino12.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result?.role).toBe("admin");
  });

  it("handles empty ADMIN_EMAILS gracefully", async () => {
    process.env.ADMIN_EMAILS = "";
    process.env.CONTRIBUTOR_EMAILS = "";

    mockSupabaseUser({
      id: "user-6",
      email: "test@test.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result?.role).toBe("customer");
  });

  it("handles undefined email", async () => {
    mockSupabaseUser({
      id: "user-7",
      email: undefined,
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result?.role).toBe("customer");
  });

  it("email matching is case-insensitive", async () => {
    process.env.CONTRIBUTOR_EMAILS = "Gaby@Test.com";

    mockSupabaseUser({
      id: "user-8",
      email: "gaby@test.com",
      app_metadata: {},
    });

    const result = await getUserRole();
    expect(result?.role).toBe("contributor");
  });
});
