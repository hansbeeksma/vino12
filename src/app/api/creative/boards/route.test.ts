import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/roles", () => ({
  getUserRole: vi.fn(),
}));

import { GET, POST } from "./route";
import { getUserRole } from "@/lib/supabase/roles";

const mockGetUserRole = getUserRole as ReturnType<typeof vi.fn>;

const adminUser = {
  user: { id: "user-1", email: "admin@vino12.nl" },
  role: "admin" as const,
};

describe("GET /api/creative/boards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);
    mockOrder.mockResolvedValue({ data: [], error: null });
    mockEq.mockReturnValue({ order: mockOrder });
    mockSelect.mockReturnValue({ eq: mockEq });
    mockFrom.mockReturnValue({ select: mockSelect });
  });

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns 403 for customer role", async () => {
    mockGetUserRole.mockResolvedValue({
      user: { id: "u-2", email: "klant@test.nl" },
      role: "customer",
    });

    const res = await GET();
    expect(res.status).toBe(403);
  });

  it("returns boards ordered by position", async () => {
    const boards = [
      { id: "b-1", title: "Board 1", position: 0 },
      { id: "b-2", title: "Board 2", position: 1 },
    ];
    mockOrder.mockResolvedValue({ data: boards, error: null });

    const res = await GET();
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(boards);

    expect(mockFrom).toHaveBeenCalledWith("creative_boards");
    expect(mockSelect).toHaveBeenCalledWith("*");
    expect(mockEq).toHaveBeenCalledWith("is_archived", false);
    expect(mockOrder).toHaveBeenCalledWith("position", { ascending: true });
  });

  it("returns 500 on database error", async () => {
    mockOrder.mockResolvedValue({ data: null, error: { message: "DB fail" } });

    const res = await GET();
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("DB fail");
  });
});

describe("POST /api/creative/boards", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { id: "new-board", title: "Nieuw Board" },
      error: null,
    });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/creative/boards", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await POST(makeRequest({ title: "Test" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when title is missing", async () => {
    const res = await POST(makeRequest({ description: "Zonder titel" }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Titel is verplicht");
  });

  it("returns 400 when title is whitespace only", async () => {
    const res = await POST(makeRequest({ title: "   " }));
    expect(res.status).toBe(400);
  });

  it("creates board with defaults", async () => {
    const res = await POST(makeRequest({ title: "Mijn Board" }));
    expect(res.status).toBe(201);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Mijn Board",
        description: null,
        color: "#722F37",
        created_by: "user-1",
      }),
    );
  });

  it("trims title and description", async () => {
    await POST(
      makeRequest({ title: "  Board  ", description: "  Omschrijving  " }),
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Board",
        description: "Omschrijving",
      }),
    );
  });

  it("uses custom color when provided", async () => {
    await POST(makeRequest({ title: "Board", color: "#FF0000" }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ color: "#FF0000" }),
    );
  });

  it("returns 500 on insert error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });

    const res = await POST(makeRequest({ title: "Fout Board" }));
    expect(res.status).toBe(500);
  });
});
