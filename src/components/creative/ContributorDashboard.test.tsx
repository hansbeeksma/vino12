import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ContributorDashboard } from "./ContributorDashboard";

const mockSelect = vi.fn();
const mockEq = vi.fn();
const mockOrder = vi.fn();
const mockLimit = vi.fn();

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
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

function setupMock(data: unknown[]) {
  mockLimit.mockResolvedValue({ data, error: null });
  mockOrder.mockReturnValue({ limit: mockLimit });
  mockEq.mockReturnValue({ order: mockOrder });
  mockSelect.mockReturnValue({ eq: mockEq });
}

describe("ContributorDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    setupMock([]);
    render(<ContributorDashboard userId="user-1" />);

    expect(screen.getByText("Laden...")).toBeInTheDocument();
  });

  it("shows empty state when no ideas", async () => {
    setupMock([]);
    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(screen.getByText("Nog geen ideeën")).toBeInTheDocument();
    });
  });

  it("renders dashboard title", async () => {
    setupMock([]);
    render(<ContributorDashboard userId="user-1" />);

    expect(screen.getByText("CREATIEF DASHBOARD")).toBeInTheDocument();
  });

  it("renders nieuw idee link", () => {
    setupMock([]);
    render(<ContributorDashboard userId="user-1" />);

    const link = screen.getByText("+ Nieuw idee");
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "/admin/creative/nieuw-idee",
    );
  });

  it("displays stats from ideas data", async () => {
    setupMock([
      {
        id: "1",
        raw_message: "Idee 1",
        status: "analyzed",
        source: "web",
        created_at: "2026-02-08T12:00:00Z",
        idea_analyses: [{ title: "Titel 1", category: "branding" }],
      },
      {
        id: "2",
        raw_message: "Idee 2",
        status: "received",
        source: "voice",
        created_at: "2026-02-08T13:00:00Z",
        idea_analyses: [],
      },
      {
        id: "3",
        raw_message: "Idee 3",
        status: "analyzing",
        source: "web",
        created_at: "2026-02-08T14:00:00Z",
        idea_analyses: [],
      },
    ]);

    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(screen.getByText("3")).toBeInTheDocument(); // Totaal
    });

    expect(screen.getByText("Totaal ideeën")).toBeInTheDocument();
    expect(screen.getByText("Geanalyseerd")).toBeInTheDocument();
    expect(screen.getByText("In analyse")).toBeInTheDocument();
    expect(screen.getByText("Nieuw")).toBeInTheDocument();
  });

  it("renders idea list with analysis title", async () => {
    setupMock([
      {
        id: "1",
        raw_message: "Origineel bericht",
        status: "analyzed",
        source: "web",
        created_at: "2026-02-08T12:00:00Z",
        idea_analyses: [{ title: "AI Analyse Titel", category: "marketing" }],
      },
    ]);

    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(screen.getByText("AI Analyse Titel")).toBeInTheDocument();
    });

    expect(screen.getByText("marketing")).toBeInTheDocument();
  });

  it("falls back to raw_message when no analysis", async () => {
    setupMock([
      {
        id: "1",
        raw_message: "Kort bericht zonder analyse",
        status: "received",
        source: "web",
        created_at: "2026-02-08T12:00:00Z",
        idea_analyses: [],
      },
    ]);

    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(
        screen.getByText("Kort bericht zonder analyse"),
      ).toBeInTheDocument();
    });
  });

  it("renders quick action links", async () => {
    setupMock([]);
    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(screen.getByText("Creatief Werkruimte")).toBeInTheDocument();
    });

    expect(screen.getByText("Nieuw Idee Delen")).toBeInTheDocument();

    const workspaceLink = screen.getByText("Open werkruimte →").closest("a");
    expect(workspaceLink).toHaveAttribute("href", "/admin/creative");
  });

  it("shows source label for ideas", async () => {
    setupMock([
      {
        id: "1",
        raw_message: "WhatsApp idee",
        status: "received",
        source: null,
        created_at: "2026-02-08T12:00:00Z",
        idea_analyses: [],
      },
    ]);

    render(<ContributorDashboard userId="user-1" />);

    await waitFor(() => {
      expect(screen.getByText("whatsapp")).toBeInTheDocument();
    });
  });
});
