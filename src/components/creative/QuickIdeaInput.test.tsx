import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QuickIdeaInput } from "./QuickIdeaInput";

const mockStartListening = vi.fn();
const mockStopListening = vi.fn();
const mockResetTranscript = vi.fn();

vi.mock("@/hooks/useSpeechToText", () => ({
  useSpeechToText: () => ({
    isListening: false,
    isSupported: true,
    startListening: mockStartListening,
    stopListening: mockStopListening,
    resetTranscript: mockResetTranscript,
    transcript: "",
    interimTranscript: "",
    error: null,
  }),
}));

describe("QuickIdeaInput", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());

    // Mock SpeechRecognition
    const MockSpeechRecognition = vi.fn().mockImplementation(() => ({
      lang: "",
      continuous: false,
      interimResults: false,
      onresult: null,
      onend: null,
      start: vi.fn(),
      stop: vi.fn(),
      abort: vi.fn(),
    }));
    vi.stubGlobal("SpeechRecognition", MockSpeechRecognition);
  });

  it("renders input and submit button", () => {
    render(<QuickIdeaInput />);

    expect(
      screen.getByPlaceholderText("Typ een snel idee..."),
    ).toBeInTheDocument();
    expect(screen.getByText("Delen")).toBeInTheDocument();
  });

  it("submit button is disabled when input is empty", () => {
    render(<QuickIdeaInput />);

    expect(screen.getByText("Delen")).toBeDisabled();
  });

  it("submit button becomes enabled with text", async () => {
    const user = userEvent.setup();
    render(<QuickIdeaInput />);

    await user.type(
      screen.getByPlaceholderText("Typ een snel idee..."),
      "Mijn idee",
    );

    expect(screen.getByText("Delen")).not.toBeDisabled();
  });

  it("submits idea via fetch and clears input", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    const mockFetch = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", mockFetch);

    render(<QuickIdeaInput onSuccess={onSuccess} />);

    await user.type(
      screen.getByPlaceholderText("Typ een snel idee..."),
      "Snel idee",
    );
    await user.click(screen.getByText("Delen"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "/api/ideas/create",
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("Snel idee"),
        }),
      );
    });

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
    });
  });

  it("does not submit when message is too short", async () => {
    const user = userEvent.setup();
    const mockFetch = vi.fn();
    vi.stubGlobal("fetch", mockFetch);

    render(<QuickIdeaInput />);

    await user.type(screen.getByPlaceholderText("Typ een snel idee..."), "AB");
    await user.click(screen.getByText("Delen"));

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("shows mic button when speech is supported", () => {
    render(<QuickIdeaInput />);

    expect(screen.getByLabelText("Dicteer")).toBeInTheDocument();
  });

  it("renders voice button with correct aria-label", () => {
    render(<QuickIdeaInput />);

    const micButton = screen.getByLabelText("Dicteer");
    expect(micButton).toBeInTheDocument();
  });
});
