import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { BoardCard } from "./BoardCard";

// Mock next/link
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

describe("BoardCard", () => {
  const baseBoard = {
    id: "board-abc",
    title: "Branding Ideas",
    description: "Alle ideeën voor de brand",
    color: "#722F37",
    is_archived: false,
    created_at: "2026-02-07T10:00:00Z",
  };

  it("renders board title", () => {
    render(<BoardCard board={baseBoard} />);
    expect(screen.getByText("Branding Ideas")).toBeInTheDocument();
  });

  it("renders board description", () => {
    render(<BoardCard board={baseBoard} />);
    expect(screen.getByText("Alle ideeën voor de brand")).toBeInTheDocument();
  });

  it("links to board detail page", () => {
    render(<BoardCard board={baseBoard} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/admin/creative/boards/board-abc");
  });

  it("applies board color to accent bar", () => {
    const { container } = render(<BoardCard board={baseBoard} />);
    const colorBar = container.querySelector("[style]");
    expect(colorBar).toHaveStyle({ backgroundColor: "#722F37" });
  });

  it("does not render description when null", () => {
    const board = { ...baseBoard, description: null };
    render(<BoardCard board={board} />);
    expect(
      screen.queryByText("Alle ideeën voor de brand"),
    ).not.toBeInTheDocument();
  });

  it("renders formatted creation date", () => {
    render(<BoardCard board={baseBoard} />);
    // nl-NL date format
    const dateEl = screen.getByText(/2026/);
    expect(dateEl).toBeInTheDocument();
  });
});
