import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/roles", () => ({
  getUserRole: vi.fn(),
}));

import { PATCH, DELETE } from "./route";
import { getUserRole } from "@/lib/supabase/roles";

const mockGetUserRole = getUserRole as ReturnType<typeof vi.fn>;

const adminUser = {
  user: { id: "user-1", email: "admin@vino12.nl" },
  role: "admin" as const,
};

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("PATCH /api/creative/notes/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { id: "n-1", content: "Updated" },
      error: null,
    });
    mockSelect.mockReturnValue({ single: mockSingle });

    // Chain: update -> eq(id) -> eq(created_by) -> select -> single
    const eqCreatedBy = vi.fn().mockReturnValue({ select: mockSelect });
    mockEq.mockReturnValue({ eq: eqCreatedBy });
    mockUpdate.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ update: mockUpdate });
  });

  function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/creative/notes/n-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await PATCH(
      makeRequest({ content: "Test" }),
      makeParams("n-1"),
    );
    expect(res.status).toBe(403);
  });

  it("returns 403 for customer role", async () => {
    mockGetUserRole.mockResolvedValue({
      user: { id: "u-2", email: "klant@test.nl" },
      role: "customer",
    });

    const res = await PATCH(
      makeRequest({ content: "Test" }),
      makeParams("n-1"),
    );
    expect(res.status).toBe(403);
  });

  it("updates note content", async () => {
    const res = await PATCH(
      makeRequest({ content: "Nieuwe inhoud" }),
      makeParams("n-1"),
    );
    expect(res.status).toBe(200);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ content: "Nieuwe inhoud" }),
    );
    expect(mockEq).toHaveBeenCalledWith("id", "n-1");
  });

  it("updates note title", async () => {
    await PATCH(makeRequest({ title: "Nieuwe Titel" }), makeParams("n-1"));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Nieuwe Titel" }),
    );
  });

  it("sets title to null for empty string", async () => {
    await PATCH(makeRequest({ title: "" }), makeParams("n-1"));

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: null }),
    );
  });

  it("trims content and title", async () => {
    await PATCH(
      makeRequest({ title: "  Titel  ", content: "  Inhoud  " }),
      makeParams("n-1"),
    );

    expect(mockUpdate).toHaveBeenCalledWith({
      title: "Titel",
      content: "Inhoud",
    });
  });

  it("returns 500 when update fails", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: "fail" } });

    const res = await PATCH(makeRequest({ content: "X" }), makeParams("n-1"));
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Bijwerken mislukt");
  });
});

describe("DELETE /api/creative/notes/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    // Chain: delete -> eq(id) -> eq(created_by)
    const eqCreatedBy = vi.fn().mockResolvedValue({ error: null });
    mockEq.mockReturnValue({ eq: eqCreatedBy });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });
  });

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/creative/notes/n-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("n-1"));
    expect(res.status).toBe(403);
  });

  it("deletes note and returns success", async () => {
    const req = new NextRequest("http://localhost/api/creative/notes/n-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("n-1"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ deleted: true });

    expect(mockFrom).toHaveBeenCalledWith("creative_notes");
    expect(mockEq).toHaveBeenCalledWith("id", "n-1");
  });

  it("returns 500 when delete fails", async () => {
    const eqCreatedBy = vi
      .fn()
      .mockResolvedValue({ error: { message: "FK constraint" } });
    mockEq.mockReturnValue({ eq: eqCreatedBy });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });

    const req = new NextRequest("http://localhost/api/creative/notes/n-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("n-1"));
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Verwijderen mislukt");
  });
});
