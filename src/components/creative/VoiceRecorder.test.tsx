import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { VoiceRecorder } from "./VoiceRecorder";

class MockSpeechRecognition {
  lang = "";
  continuous = false;
  interimResults = false;
  maxAlternatives = 1;
  onresult: ((event: unknown) => void) | null = null;
  onerror: ((event: unknown) => void) | null = null;
  onend: (() => void) | null = null;
  onstart: (() => void) | null = null;

  start() {
    this.onstart?.();
  }

  stop() {
    this.onend?.();
  }

  abort() {
    this.onend?.();
  }
}

describe("VoiceRecorder", () => {
  beforeEach(() => {
    (window as Record<string, unknown>).SpeechRecognition =
      MockSpeechRecognition;
  });

  afterEach(() => {
    delete (window as Record<string, unknown>).SpeechRecognition;
  });

  it("renders mic button when speech is supported", () => {
    render(<VoiceRecorder onTranscript={vi.fn()} />);
    expect(screen.getByLabelText("Start opname")).toBeInTheDocument();
  });

  it("shows unsupported message when API not available", () => {
    delete (window as Record<string, unknown>).SpeechRecognition;

    render(<VoiceRecorder onTranscript={vi.fn()} />);
    expect(
      screen.getByText(/niet ondersteund in deze browser/),
    ).toBeInTheDocument();
  });

  it("shows 'Klik om te dicteren' initially", () => {
    render(<VoiceRecorder onTranscript={vi.fn()} />);
    expect(screen.getByText("Klik om te dicteren")).toBeInTheDocument();
  });

  it("toggles to listening state on click", async () => {
    const user = userEvent.setup();
    render(<VoiceRecorder onTranscript={vi.fn()} />);

    await user.click(screen.getByLabelText("Start opname"));

    expect(screen.getByText("Aan het luisteren...")).toBeInTheDocument();
    expect(screen.getByLabelText("Stop opname")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <VoiceRecorder onTranscript={vi.fn()} className="mt-4" />,
    );
    expect(container.firstChild).toHaveClass("mt-4");
  });
});
