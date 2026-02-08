import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardDetail } from "./BoardDetail";

const mockFrom = vi.fn();
const mockSubscribe = vi.fn();
const mockRemoveChannel = vi.fn();
const mockGetUser = vi.fn();

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: mockFrom,
    channel: () => ({
      on: vi.fn().mockReturnThis(),
      subscribe: mockSubscribe,
    }),
    removeChannel: mockRemoveChannel,
    auth: { getUser: mockGetUser },
  }),
}));

interface MockData {
  board: unknown;
  ideas: unknown[];
  notes: unknown[];
}

function setupMocks({ board, ideas, notes }: MockData) {
  const boardQuery = {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({ data: board, error: null }),
      }),
    }),
  };

  const ideasQuery = {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: ideas, error: null }),
      }),
    }),
  };

  const notesQuery = {
    select: vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        order: vi.fn().mockResolvedValue({ data: notes, error: null }),
      }),
    }),
  };

  // Track call order to return correct mock
  let callCount = 0;
  mockFrom.mockImplementation((table: string) => {
    if (table === "creative_boards") return boardQuery;
    if (table === "board_ideas") return ideasQuery;
    if (table === "creative_notes") {
      callCount++;
      if (callCount <= 1) return notesQuery;
      // For delete operations
      return {
        select: notesQuery.select,
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      };
    }
    return { select: vi.fn() };
  });
}

describe("BoardDetail", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading state initially", () => {
    setupMocks({ board: null, ideas: [], notes: [] });
    render(<BoardDetail boardId="b-1" />);

    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });

  it("shows not found when board is null", async () => {
    setupMocks({ board: null, ideas: [], notes: [] });
    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Board niet gevonden")).toBeInTheDocument();
    });
  });

  it("renders board title and color", async () => {
    setupMocks({
      board: {
        id: "b-1",
        title: "Branding Board",
        description: null,
        color: "#722F37",
      },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Branding Board")).toBeInTheDocument();
    });
  });

  it("renders board description when present", async () => {
    setupMocks({
      board: {
        id: "b-1",
        title: "Board",
        description: "Beschrijving hier",
        color: "#722F37",
      },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Beschrijving hier")).toBeInTheDocument();
    });
  });

  it("shows empty ideas message", async () => {
    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(
        screen.getByText("Nog geen ideeën op dit board"),
      ).toBeInTheDocument();
    });
  });

  it("shows empty notes message", async () => {
    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(
        screen.getByText("Nog geen notities op dit board"),
      ).toBeInTheDocument();
    });
  });

  it("renders ideas section heading and add button", async () => {
    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Ideeën")).toBeInTheDocument();
    });

    expect(screen.getByText("+ Idee toevoegen")).toBeInTheDocument();
    expect(screen.getByText("+ Notitie")).toBeInTheDocument();
  });

  it("shows note editor when + Notitie is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Notitie")).toBeInTheDocument();
    });

    await user.click(screen.getByText("+ Notitie"));

    expect(
      screen.getByPlaceholderText("Schrijf je notitie..."),
    ).toBeInTheDocument();
  });

  it("renders ideas with analysis titles", async () => {
    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [
        {
          idea_id: "idea-1",
          position: 0,
          ideas: {
            id: "idea-1",
            raw_message: "Origineel bericht",
            status: "analyzed",
            created_at: "2026-02-08T12:00:00Z",
            idea_analyses: [
              { title: "Geanalyseerde Titel", category: "branding" },
            ],
          },
        },
      ],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Geanalyseerde Titel")).toBeInTheDocument();
    });

    expect(screen.getByText("branding")).toBeInTheDocument();
    expect(screen.getByText("analyzed")).toBeInTheDocument();
  });

  it("renders notes", async () => {
    setupMocks({
      board: { id: "b-1", title: "Board", description: null, color: "#000" },
      ideas: [],
      notes: [
        {
          id: "n-1",
          title: "Mijn Notitie",
          content: "Inhoud van notitie",
          note_type: "text",
          created_at: "2026-02-08T12:00:00Z",
          updated_at: "2026-02-08T12:00:00Z",
        },
      ],
    });

    render(<BoardDetail boardId="b-1" />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Mijn Notitie")).toBeInTheDocument();
    });

    expect(screen.getByText("Inhoud van notitie")).toBeInTheDocument();
  });

  it("subscribes to realtime channels", () => {
    setupMocks({
      board: null,
      ideas: [],
      notes: [],
    });

    render(<BoardDetail boardId="b-1" />);

    expect(mockSubscribe).toHaveBeenCalled();
  });
});
