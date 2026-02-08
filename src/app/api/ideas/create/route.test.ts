import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const mockFrom = vi.fn();
const mockInsert = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

vi.mock("@/lib/supabase/roles", () => ({
  getUserRole: vi.fn(),
}));

vi.mock("@/lib/ai/process-idea", () => ({
  processIdeaAnalysis: vi.fn().mockResolvedValue(undefined),
}));

import { POST } from "./route";
import { getUserRole } from "@/lib/supabase/roles";
import { processIdeaAnalysis } from "@/lib/ai/process-idea";

const mockGetUserRole = getUserRole as ReturnType<typeof vi.fn>;
const mockProcessIdea = processIdeaAnalysis as ReturnType<typeof vi.fn>;

const adminUser = {
  user: { id: "user-1", email: "admin@vino12.com" },
  role: "admin" as const,
};

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/ideas/create", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function setupInsertMock(data: unknown, error: unknown = null) {
  mockSingle.mockResolvedValue({ data, error });
  mockSelect.mockReturnValue({ single: mockSingle });
  mockInsert.mockReturnValue({ select: mockSelect });
  mockFrom.mockReturnValue({ insert: mockInsert });
}

describe("POST /api/ideas/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetUserRole.mockResolvedValue(adminUser);
    setupInsertMock({ id: "idea-1" });
  });

  it("returns 403 when user is not authenticated", async () => {
    mockGetUserRole.mockResolvedValue(null);

    const res = await POST(makeRequest({ message: "Test", source: "web" }));
    expect(res.status).toBe(403);

    const json = await res.json();
    expect(json.error).toBe("Geen toegang");
  });

  it("returns 403 when user is customer", async () => {
    mockGetUserRole.mockResolvedValue({
      user: { id: "u-2", email: "klant@test.nl" },
      role: "customer",
    });

    const res = await POST(makeRequest({ message: "Test", source: "web" }));
    expect(res.status).toBe(403);
  });

  it("returns 400 for invalid input", async () => {
    const res = await POST(makeRequest({ message: "" }));
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toBe("Ongeldige invoer");
    expect(json.details).toBeDefined();
  });

  it("returns 400 for invalid source", async () => {
    const res = await POST(
      makeRequest({ message: "Test bericht", source: "sms" }),
    );
    expect(res.status).toBe(400);
  });

  it("inserts idea and returns id", async () => {
    const res = await POST(
      makeRequest({ message: "Nieuw wijn idee", source: "web" }),
    );

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ id: "idea-1", status: "received" });

    expect(mockFrom).toHaveBeenCalledWith("ideas");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        raw_message: "Nieuw wijn idee",
        source: "web",
        created_by: "user-1",
        status: "received",
      }),
    );
  });

  it("uses voice message_type for voice source", async () => {
    await POST(makeRequest({ message: "Gedicteerd idee", source: "voice" }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        source: "voice",
        message_type: "voice",
      }),
    );
  });

  it("defaults tags to empty array", async () => {
    await POST(makeRequest({ message: "Idee zonder tags", source: "web" }));

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ tags: [] }),
    );
  });

  it("passes tags when provided", async () => {
    await POST(
      makeRequest({
        message: "Idee met tags",
        source: "web",
        tags: ["branding", "label"],
      }),
    );

    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({ tags: ["branding", "label"] }),
    );
  });

  it("triggers AI analysis in background", async () => {
    await POST(makeRequest({ message: "Analyseer dit", source: "web" }));

    expect(mockProcessIdea).toHaveBeenCalledWith("idea-1", "Analyseer dit");
  });

  it("returns 500 when insert fails", async () => {
    setupInsertMock(null, { message: "DB error" });

    const res = await POST(
      makeRequest({ message: "Fout idee", source: "web" }),
    );
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe("Idee opslaan mislukt");
  });

  it("allows contributor role", async () => {
    mockGetUserRole.mockResolvedValue({
      user: { id: "u-3", email: "gabrielle@vino12.com" },
      role: "contributor",
    });

    const res = await POST(
      makeRequest({ message: "Contributor idee", source: "web" }),
    );
    expect(res.status).toBe(200);
  });
});
