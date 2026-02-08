import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
const mockUpdate = vi.fn();
const mockInsert = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockSingle = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: mockFrom,
  }),
}));

vi.mock("./analyze-idea", () => ({
  analyzeIdea: vi.fn(),
}));

import { processIdeaAnalysis } from "./process-idea";
import { analyzeIdea } from "./analyze-idea";

const mockAnalyzeIdea = analyzeIdea as ReturnType<typeof vi.fn>;

function setupSupabaseMock() {
  mockEq.mockReturnThis();
  mockSelect.mockReturnValue({ single: mockSingle });
  mockSingle.mockResolvedValue({ data: {}, error: null });
  mockUpdate.mockReturnValue({ eq: mockEq });
  mockInsert.mockReturnValue({ select: mockSelect });

  mockFrom.mockImplementation((table: string) => {
    if (table === "ideas") {
      return { update: mockUpdate };
    }
    if (table === "idea_analyses") {
      return { insert: mockInsert };
    }
    return {};
  });
}

describe("processIdeaAnalysis", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupSupabaseMock();
  });

  it("runs full pipeline: analyzing -> analyze -> store -> analyzed", async () => {
    mockAnalyzeIdea.mockResolvedValue({
      classifier: {
        title: "Test Idee",
        summary: "Samenvatting",
        category: "branding",
        urgency: "medium",
        complexity: "low",
      },
      research: "Research findings",
      planner: {
        feasibility_score: 8,
        swot: { strengths: [], weaknesses: [], opportunities: [], threats: [] },
        action_plan: "Actieplan",
        estimated_effort: "2 uur",
      },
    });

    await processIdeaAnalysis("idea-123", "Mijn test idee");

    // Should set status to analyzing first
    expect(mockFrom).toHaveBeenCalledWith("ideas");
    expect(mockUpdate).toHaveBeenCalledWith({ status: "analyzing" });

    // Should call analyzeIdea with message
    expect(mockAnalyzeIdea).toHaveBeenCalledWith("Mijn test idee");

    // Should insert analysis
    expect(mockFrom).toHaveBeenCalledWith("idea_analyses");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        idea_id: "idea-123",
        title: "Test Idee",
        category: "branding",
        ai_model: "claude-haiku+sonnet+perplexity",
      }),
    );

    // Should set status to analyzed
    expect(mockUpdate).toHaveBeenCalledWith({ status: "analyzed" });
  });

  it("reverts to received status on error", async () => {
    mockAnalyzeIdea.mockRejectedValue(new Error("AI service down"));

    await expect(
      processIdeaAnalysis("idea-456", "Failing idea"),
    ).rejects.toThrow("AI service down");

    // Should revert status to received
    expect(mockUpdate).toHaveBeenCalledWith({ status: "received" });
  });

  it("calls analyzeIdea with the raw message", async () => {
    mockAnalyzeIdea.mockResolvedValue({
      classifier: {
        title: "T",
        summary: "S",
        category: "c",
        urgency: "l",
        complexity: "l",
      },
      research: "",
      planner: {
        feasibility_score: 5,
        swot: {},
        action_plan: "",
        estimated_effort: "",
      },
    });

    await processIdeaAnalysis(
      "id-1",
      "Een hele lange beschrijving van het idee",
    );

    expect(mockAnalyzeIdea).toHaveBeenCalledWith(
      "Een hele lange beschrijving van het idee",
    );
  });
});
