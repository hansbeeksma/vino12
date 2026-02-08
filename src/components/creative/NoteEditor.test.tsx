import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { NoteEditor } from "./NoteEditor";

describe("NoteEditor", () => {
  it("renders with empty fields by default", () => {
    render(<NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByPlaceholderText("Titel (optioneel)")).toHaveValue("");
    expect(screen.getByPlaceholderText("Schrijf je notitie...")).toHaveValue(
      "",
    );
  });

  it("renders with initial values", () => {
    render(
      <NoteEditor
        initialTitle="Mijn titel"
        initialContent="Mijn inhoud"
        onSave={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByPlaceholderText("Titel (optioneel)")).toHaveValue(
      "Mijn titel",
    );
    expect(screen.getByPlaceholderText("Schrijf je notitie...")).toHaveValue(
      "Mijn inhoud",
    );
  });

  it("calls onSave with trimmed values on submit", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(<NoteEditor onSave={onSave} onCancel={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText("Titel (optioneel)"),
      "  Mijn Titel  ",
    );
    await user.type(
      screen.getByPlaceholderText("Schrijf je notitie..."),
      "  Notitie inhoud  ",
    );
    await user.click(screen.getByText("Opslaan"));

    expect(onSave).toHaveBeenCalledWith("Mijn Titel", "Notitie inhoud");
  });

  it("does not submit with empty content", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(<NoteEditor onSave={onSave} onCancel={vi.fn()} />);

    await user.click(screen.getByText("Opslaan"));

    expect(onSave).not.toHaveBeenCalled();
  });

  it("does not submit with whitespace-only content", async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();

    render(<NoteEditor onSave={onSave} onCancel={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText("Schrijf je notitie..."),
      "   ",
    );
    await user.click(screen.getByText("Opslaan"));

    expect(onSave).not.toHaveBeenCalled();
  });

  it("calls onCancel when cancel button clicked", async () => {
    const onCancel = vi.fn();
    const user = userEvent.setup();

    render(<NoteEditor onSave={vi.fn()} onCancel={onCancel} />);

    await user.click(screen.getByText("Annuleren"));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("submit button is disabled when content is empty", () => {
    render(<NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByText("Opslaan")).toBeDisabled();
  });

  it("submit button becomes enabled when content is typed", async () => {
    const user = userEvent.setup();

    render(<NoteEditor onSave={vi.fn()} onCancel={vi.fn()} />);

    await user.type(
      screen.getByPlaceholderText("Schrijf je notitie..."),
      "Iets",
    );

    expect(screen.getByText("Opslaan")).not.toBeDisabled();
  });
});
