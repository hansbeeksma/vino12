import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IdeaInputForm } from "./IdeaInputForm";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

vi.mock("./VoiceRecorder", () => ({
  VoiceRecorder: ({
    onTranscript,
  }: {
    onTranscript: (text: string) => void;
  }) => (
    <button
      data-testid="mock-voice"
      onClick={() => onTranscript("gedicteerde tekst")}
    >
      Mock Voice
    </button>
  ),
}));

describe("IdeaInputForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
  });

  it("renders form with textarea and submit button", () => {
    render(<IdeaInputForm />);

    expect(
      screen.getByPlaceholderText(/beschrijf je idee/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Idee delen")).toBeInTheDocument();
  });

  it("submit button is disabled when message is empty", () => {
    render(<IdeaInputForm />);

    expect(screen.getByText("Idee delen")).toBeDisabled();
  });

  it("submit button becomes enabled when message is typed", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    await user.type(
      screen.getByPlaceholderText(/beschrijf je idee/i),
      "Mijn idee",
    );

    expect(screen.getByText("Idee delen")).not.toBeDisabled();
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    await user.type(screen.getByPlaceholderText(/beschrijf je idee/i), "Test");

    expect(screen.getByText(/4\/5000 tekens/)).toBeInTheDocument();
  });

  it("shows error for message shorter than 3 characters", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    await user.type(screen.getByPlaceholderText(/beschrijf je idee/i), "AB");
    await user.click(screen.getByText("Idee delen"));

    expect(
      screen.getByText("Idee moet minimaal 3 tekens bevatten"),
    ).toBeInTheDocument();
  });

  it("submits idea via fetch", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "idea-1" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<IdeaInputForm />);

    await user.type(
      screen.getByPlaceholderText(/beschrijf je idee/i),
      "Mijn geweldig idee",
    );
    await user.click(screen.getByText("Idee delen"));

    expect(mockFetch).toHaveBeenCalledWith(
      "/api/ideas/create",
      expect.objectContaining({
        method: "POST",
        body: expect.stringContaining("Mijn geweldig idee"),
      }),
    );
  });

  it("shows success message after submit", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ id: "idea-1" }),
      }),
    );

    render(<IdeaInputForm />);

    await user.type(
      screen.getByPlaceholderText(/beschrijf je idee/i),
      "Mijn idee",
    );
    await user.click(screen.getByText("Idee delen"));

    await waitFor(() => {
      expect(screen.getByText("Idee ontvangen!")).toBeInTheDocument();
    });
  });

  it("shows error message on failed submit", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: () => Promise.resolve({ error: "Server fout" }),
      }),
    );

    render(<IdeaInputForm />);

    await user.type(
      screen.getByPlaceholderText(/beschrijf je idee/i),
      "Mijn idee",
    );
    await user.click(screen.getByText("Idee delen"));

    await waitFor(() => {
      expect(screen.getByText("Server fout")).toBeInTheDocument();
    });
  });

  it("adds and removes tags", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    const tagInput = screen.getByPlaceholderText("Voeg tag toe...");
    await user.type(tagInput, "branding");
    await user.click(screen.getByText("+"));

    expect(screen.getByText("branding")).toBeInTheDocument();

    // Remove tag
    const removeButtons = screen.getAllByText("x");
    await user.click(removeButtons[0]);

    expect(screen.queryByText("branding")).not.toBeInTheDocument();
  });

  it("adds tag on Enter key", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    const tagInput = screen.getByPlaceholderText("Voeg tag toe...");
    await user.type(tagInput, "design{Enter}");

    expect(screen.getByText("design")).toBeInTheDocument();
  });

  it("does not add duplicate tags", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    const tagInput = screen.getByPlaceholderText("Voeg tag toe...");
    await user.type(tagInput, "branding{Enter}");
    await user.type(tagInput, "branding{Enter}");

    const tags = screen.getAllByText("branding");
    expect(tags).toHaveLength(1);
  });

  it("appends voice transcript to message", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    await user.click(screen.getByTestId("mock-voice"));

    expect(screen.getByPlaceholderText(/beschrijf je idee/i)).toHaveValue(
      "gedicteerde tekst",
    );
  });

  it("shows (gedicteerd) label after voice input", async () => {
    const user = userEvent.setup();
    render(<IdeaInputForm />);

    await user.click(screen.getByTestId("mock-voice"));

    expect(screen.getByText(/\(gedicteerd\)/)).toBeInTheDocument();
  });

  it("sends tags in submit body when present", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ id: "idea-1" }),
    });
    vi.stubGlobal("fetch", mockFetch);

    render(<IdeaInputForm />);

    await user.type(
      screen.getByPlaceholderText(/beschrijf je idee/i),
      "Idee met tags",
    );
    const tagInput = screen.getByPlaceholderText("Voeg tag toe...");
    await user.type(tagInput, "branding{Enter}");
    await user.click(screen.getByText("Idee delen"));

    const body = JSON.parse(mockFetch.mock.calls[0][1].body);
    expect(body.tags).toEqual(["branding"]);
  });
});
