import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockSingle = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/roles", () => ({
  getUserRole: vi.fn(),
}));

import { GET, PATCH, DELETE } from "./route";
import { getUserRole } from "@/lib/supabase/roles";

const mockGetUserRole = getUserRole as ReturnType<typeof vi.fn>;

const adminUser = {
  user: { id: "user-1", email: "admin@vino12.nl" },
  role: "admin" as const,
};

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("GET /api/creative/boards/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { id: "b-1", title: "Board" },
      error: null,
    });
    mockEq.mockReturnValue({ single: mockSingle });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/creative/boards/b-1");

    const res = await GET(req, makeParams("b-1"));
    expect(res.status).toBe(403);
  });

  it("returns board data", async () => {
    const req = new NextRequest("http://localhost/api/creative/boards/b-1");

    const res = await GET(req, makeParams("b-1"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ id: "b-1", title: "Board" });

    expect(mockFrom).toHaveBeenCalledWith("creative_boards");
    expect(mockEq).toHaveBeenCalledWith("id", "b-1");
  });

  it("returns 404 when board not found", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
    const req = new NextRequest(
      "http://localhost/api/creative/boards/nonexistent",
    );

    const res = await GET(req, makeParams("nonexistent"));
    expect(res.status).toBe(404);

    const json = await res.json();
    expect(json.error).toBe("Board niet gevonden");
  });
});

describe("PATCH /api/creative/boards/[id]", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { id: "b-1", title: "Updated" },
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
    return new NextRequest("http://localhost/api/creative/boards/b-1", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await PATCH(makeRequest({ title: "X" }), makeParams("b-1"));
    expect(res.status).toBe(403);
  });

  it("updates board title", async () => {
    const res = await PATCH(
      makeRequest({ title: "Nieuwe Titel" }),
      makeParams("b-1"),
    );
    expect(res.status).toBe(200);

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({ title: "Nieuwe Titel" }),
    );
    expect(mockEq).toHaveBeenCalledWith("id", "b-1");
  });

  it("updates multiple fields", async () => {
    await PATCH(
      makeRequest({
        title: "Titel",
        color: "#000",
        is_archived: true,
      }),
      makeParams("b-1"),
    );

    expect(mockUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Titel",
        color: "#000",
        is_archived: true,
      }),
    );
  });

  it("returns 500 when update fails", async () => {
    mockSingle.mockResolvedValue({ data: null, error: { message: "fail" } });

    const res = await PATCH(makeRequest({ title: "X" }), makeParams("b-1"));
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Bijwerken mislukt");
  });
});

describe("DELETE /api/creative/boards/[id]", () => {
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
    const req = new NextRequest("http://localhost/api/creative/boards/b-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(403);
  });

  it("deletes board and returns success", async () => {
    const req = new NextRequest("http://localhost/api/creative/boards/b-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ deleted: true });

    expect(mockFrom).toHaveBeenCalledWith("creative_boards");
    expect(mockEq).toHaveBeenCalledWith("id", "b-1");
  });

  it("returns 500 when delete fails", async () => {
    const eqCreatedBy = vi.fn().mockResolvedValue({ error: { message: "FK" } });
    mockEq.mockReturnValue({ eq: eqCreatedBy });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });

    const req = new NextRequest("http://localhost/api/creative/boards/b-1", {
      method: "DELETE",
    });

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Verwijderen mislukt");
  });
});
