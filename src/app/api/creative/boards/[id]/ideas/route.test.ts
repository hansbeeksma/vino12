import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();
const mockDelete = vi.fn();
const mockEq = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/roles", () => ({
  getUserRole: vi.fn(),
}));

import { POST, DELETE } from "./route";
import { getUserRole } from "@/lib/supabase/roles";

const mockGetUserRole = getUserRole as ReturnType<typeof vi.fn>;

const adminUser = {
  user: { id: "user-1", email: "admin@vino12.nl" },
  role: "admin" as const,
};

function makeParams(id: string) {
  return { params: Promise.resolve({ id }) };
}

describe("POST /api/creative/boards/[id]/ideas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { board_id: "b-1", idea_id: "idea-1", position: 0 },
      error: null,
    });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/creative/boards/b-1/ideas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await POST(
      makeRequest({ idea_id: "idea-1" }),
      makeParams("b-1"),
    );
    expect(res.status).toBe(403);
  });

  it("returns 400 when idea_id is missing", async () => {
    const res = await POST(makeRequest({}), makeParams("b-1"));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("idea_id is verplicht");
  });

  it("links idea to board with default position", async () => {
    const res = await POST(
      makeRequest({ idea_id: "idea-1" }),
      makeParams("b-1"),
    );
    expect(res.status).toBe(201);

    expect(mockFrom).toHaveBeenCalledWith("board_ideas");
    expect(mockInsert).toHaveBeenCalledWith({
      board_id: "b-1",
      idea_id: "idea-1",
      position: 0,
    });
  });

  it("uses custom position when provided", async () => {
    await POST(
      makeRequest({ idea_id: "idea-1", position: 5 }),
      makeParams("b-1"),
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ position: 5 }),
    );
  });

  it("returns 500 on insert error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Duplicate" },
    });

    const res = await POST(
      makeRequest({ idea_id: "idea-1" }),
      makeParams("b-1"),
    );
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/creative/boards/[id]/ideas", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    // Chain: delete -> eq(board_id) -> eq(idea_id)
    const eqIdeaId = vi.fn().mockResolvedValue({ error: null });
    mockEq.mockReturnValue({ eq: eqIdeaId });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });
  });

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);
    const req = new NextRequest(
      "http://localhost/api/creative/boards/b-1/ideas?idea_id=idea-1",
      { method: "DELETE" },
    );

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(403);
  });

  it("returns 400 when idea_id query param is missing", async () => {
    const req = new NextRequest(
      "http://localhost/api/creative/boards/b-1/ideas",
      { method: "DELETE" },
    );

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("idea_id query parameter is verplicht");
  });

  it("unlinks idea from board", async () => {
    const req = new NextRequest(
      "http://localhost/api/creative/boards/b-1/ideas?idea_id=idea-1",
      { method: "DELETE" },
    );

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual({ deleted: true });

    expect(mockFrom).toHaveBeenCalledWith("board_ideas");
    expect(mockEq).toHaveBeenCalledWith("board_id", "b-1");
  });

  it("returns 500 on delete error", async () => {
    const eqIdeaId = vi
      .fn()
      .mockResolvedValue({ error: { message: "FK error" } });
    mockEq.mockReturnValue({ eq: eqIdeaId });
    mockDelete.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ delete: mockDelete });

    const req = new NextRequest(
      "http://localhost/api/creative/boards/b-1/ideas?idea_id=idea-1",
      { method: "DELETE" },
    );

    const res = await DELETE(req, makeParams("b-1"));
    expect(res.status).toBe(500);
  });
});
