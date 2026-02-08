import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteCard } from "./NoteCard";

describe("NoteCard", () => {
  const baseNote = {
    id: "note-1",
    title: "Test Notitie",
    content: "Dit is de inhoud van mijn notitie",
    note_type: "text",
    created_at: "2026-02-08T12:00:00Z",
    updated_at: "2026-02-08T14:30:00Z",
  };

  it("renders note with title", () => {
    render(<NoteCard note={baseNote} onDelete={vi.fn()} />);

    expect(screen.getByText("Test Notitie")).toBeInTheDocument();
    expect(
      screen.getByText("Dit is de inhoud van mijn notitie"),
    ).toBeInTheDocument();
  });

  it("renders fallback label when title is null", () => {
    const note = { ...baseNote, title: null };
    render(<NoteCard note={note} onDelete={vi.fn()} />);

    expect(screen.getByText("Notitie")).toBeInTheDocument();
    expect(screen.queryByText("Test Notitie")).not.toBeInTheDocument();
  });

  it("renders formatted date", () => {
    render(<NoteCard note={baseNote} onDelete={vi.fn()} />);

    // Check that a date is rendered (nl-NL format)
    const dateElement = screen.getByText(/feb/i);
    expect(dateElement).toBeInTheDocument();
  });

  it("calls onDelete with note id when delete button clicked", async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();

    render(<NoteCard note={baseNote} onDelete={onDelete} />);

    const deleteButton = screen.getByLabelText("Verwijder notitie");
    await user.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith("note-1");
    expect(onDelete).toHaveBeenCalledTimes(1);
  });

  it("preserves whitespace in content", () => {
    const note = { ...baseNote, content: "Regel 1\nRegel 2\nRegel 3" };
    render(<NoteCard note={note} onDelete={vi.fn()} />);

    const contentEl = screen.getByText(/Regel 1/);
    expect(contentEl).toHaveClass("whitespace-pre-wrap");
  });
});
