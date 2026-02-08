import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockOrder = vi.fn();
const mockEq = vi.fn();
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

describe("GET /api/creative/notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);
  });

  function setupQueryMock(data: unknown, error: unknown = null) {
    mockOrder.mockResolvedValue({ data, error });
    mockSelect.mockReturnValue({
      order: mockOrder,
      eq: vi.fn().mockReturnValue({ order: mockOrder }),
    });

    // When board_id filter is applied: select -> order is replaced by select -> eq -> order
    // We handle both paths via mockSelect returning object with both methods
    mockFrom.mockReturnValue({ select: mockSelect });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);
    const req = new NextRequest("http://localhost/api/creative/notes");

    const res = await GET(req);
    expect(res.status).toBe(403);
  });

  it("returns all notes without board_id filter", async () => {
    const notes = [
      { id: "n-1", content: "Notitie 1" },
      { id: "n-2", content: "Notitie 2" },
    ];
    setupQueryMock(notes);

    const req = new NextRequest("http://localhost/api/creative/notes");
    const res = await GET(req);

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual(notes);

    expect(mockFrom).toHaveBeenCalledWith("creative_notes");
    expect(mockSelect).toHaveBeenCalledWith("*");
  });

  it("filters by board_id when provided", async () => {
    setupQueryMock([{ id: "n-1" }]);

    const req = new NextRequest(
      "http://localhost/api/creative/notes?board_id=b-1",
    );
    await GET(req);

    expect(mockFrom).toHaveBeenCalledWith("creative_notes");
  });

  it("returns 500 on database error", async () => {
    setupQueryMock(null, { message: "Query failed" });

    const req = new NextRequest("http://localhost/api/creative/notes");
    const res = await GET(req);

    expect(res.status).toBe(500);
  });
});

describe("POST /api/creative/notes", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);

    mockSingle.mockResolvedValue({
      data: { id: "n-new", content: "Test" },
      error: null,
    });
    mockSelect.mockReturnValue({ single: mockSingle });
    mockInsert.mockReturnValue({ select: mockSelect });
    mockFrom.mockReturnValue({ insert: mockInsert });
  });

  function makeRequest(body: unknown) {
    return new NextRequest("http://localhost/api/creative/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("returns 403 when not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await POST(makeRequest({ board_id: "b-1", content: "Test" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 when board_id is missing", async () => {
    const res = await POST(makeRequest({ content: "Test" }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("board_id en content zijn verplicht");
  });

  it("returns 400 when content is missing", async () => {
    const res = await POST(makeRequest({ board_id: "b-1" }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when content is whitespace only", async () => {
    const res = await POST(makeRequest({ board_id: "b-1", content: "   " }));
    expect(res.status).toBe(400);
  });

  it("creates note with defaults", async () => {
    const res = await POST(
      makeRequest({ board_id: "b-1", content: "Mijn notitie" }),
    );
    expect(res.status).toBe(201);

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        board_id: "b-1",
        content: "Mijn notitie",
        title: null,
        note_type: "text",
        created_by: "user-1",
      }),
    );
  });

  it("trims title and content", async () => {
    await POST(
      makeRequest({
        board_id: "b-1",
        title: "  Titel  ",
        content: "  Inhoud  ",
      }),
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Titel",
        content: "Inhoud",
      }),
    );
  });

  it("accepts custom note_type", async () => {
    await POST(
      makeRequest({
        board_id: "b-1",
        content: "Voice notitie",
        note_type: "voice",
      }),
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ note_type: "voice" }),
    );
  });

  it("returns 500 on insert error", async () => {
    mockSingle.mockResolvedValue({
      data: null,
      error: { message: "Insert failed" },
    });

    const res = await POST(makeRequest({ board_id: "b-1", content: "Fout" }));
    expect(res.status).toBe(500);
  });
});
