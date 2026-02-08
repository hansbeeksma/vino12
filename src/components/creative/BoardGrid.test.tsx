import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BoardGrid } from "./BoardGrid";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockInsert = vi.fn();
const mockGetUser = vi.fn();
const mockSubscribe = vi.fn();
const mockRemoveChannel = vi.fn();

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/supabase/client", () => ({
  createClient: () => ({
    from: (table: string) => {
      if (table === "creative_boards") {
        return {
          select: mockSelect,
          insert: mockInsert,
        };
      }
      return {};
    },
    channel: () => ({
      on: vi.fn().mockReturnThis(),
      subscribe: mockSubscribe,
    }),
    removeChannel: mockRemoveChannel,
    auth: { getUser: mockGetUser },
  }),
}));

function setupBoardsMock(boards: unknown[]) {
  mockOrder.mockResolvedValue({ data: boards, error: null });
  mockEq.mockReturnValue({ order: mockOrder });
  mockSelect.mockReturnValue({ eq: mockEq });
}

describe("BoardGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers({ shouldAdvanceTime: true });
    setupBoardsMock([]);
    mockGetUser.mockResolvedValue({
      data: { user: { id: "user-1" } },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows loading state initially", () => {
    render(<BoardGrid />);
    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });

  it("shows new board button after loading", async () => {
    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Nieuw board")).toBeInTheDocument();
    });
  });

  it("renders boards after loading", async () => {
    setupBoardsMock([
      {
        id: "b-1",
        title: "Branding",
        description: "Brand ideeën",
        color: "#722F37",
        is_archived: false,
        position: 0,
        created_at: "2026-02-08T10:00:00Z",
      },
    ]);

    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("Branding")).toBeInTheDocument();
    });
  });

  it("shows create form when + Nieuw board is clicked", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Nieuw board")).toBeInTheDocument();
    });

    await user.click(screen.getByText("+ Nieuw board"));

    expect(screen.getByPlaceholderText("Board naam...")).toBeInTheDocument();
    expect(screen.getByText("Aanmaken")).toBeInTheDocument();
    expect(screen.getByText("Annuleren")).toBeInTheDocument();
  });

  it("hides create form on Annuleren click", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Nieuw board")).toBeInTheDocument();
    });

    await user.click(screen.getByText("+ Nieuw board"));
    await user.click(screen.getByText("Annuleren"));

    expect(
      screen.queryByPlaceholderText("Board naam..."),
    ).not.toBeInTheDocument();
  });

  it("disables Aanmaken button when title is empty", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Nieuw board")).toBeInTheDocument();
    });

    await user.click(screen.getByText("+ Nieuw board"));

    expect(screen.getByText("Aanmaken")).toBeDisabled();
  });

  it("renders 6 color swatches", async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    render(<BoardGrid />);

    await vi.advanceTimersByTimeAsync(10);

    await waitFor(() => {
      expect(screen.getByText("+ Nieuw board")).toBeInTheDocument();
    });

    await user.click(screen.getByText("+ Nieuw board"));

    const colorButtons = screen.getAllByLabelText(/Kleur #/);
    expect(colorButtons).toHaveLength(6);
  });

  it("subscribes to realtime channel", () => {
    render(<BoardGrid />);
    expect(mockSubscribe).toHaveBeenCalled();
  });
});
