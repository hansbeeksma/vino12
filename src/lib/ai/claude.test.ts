import { describe, it, expect, vi, beforeEach } from "vitest";
import { callClaude, parseJSON } from "./claude";

describe("callClaude", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.unstubAllEnvs();
  });

  it("throws when ANTHROPIC_API_KEY is not set", async () => {
    vi.stubEnv("ANTHROPIC_API_KEY", "");

    await expect(callClaude("system", "user")).rejects.toThrow(
      "ANTHROPIC_API_KEY not configured",
    );
  });

  it("sends correct request to Anthropic API", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () =>
        Promise.resolve({
          content: [{ type: "text", text: "response text" }],
        }),
    });

    const result = await callClaude(
      "sys prompt",
      "user msg",
      "claude-haiku-4-5-20251001",
      1024,
    );

    expect(global.fetch).toHaveBeenCalledWith(
      "https://api.anthropic.com/v1/messages",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          "x-api-key": "test-key",
          "anthropic-version": "2023-06-01",
        }),
      }),
    );

    const body = JSON.parse(
      (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][1].body,
    );
    expect(body.model).toBe("claude-haiku-4-5-20251001");
    expect(body.max_tokens).toBe(1024);
    expect(body.system).toBe("sys prompt");
    expect(body.messages).toEqual([{ role: "user", content: "user msg" }]);
    expect(result).toBe("response text");
  });

  it("throws on non-ok response", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 429,
      text: () => Promise.resolve("Rate limited"),
    });

    await expect(callClaude("sys", "msg")).rejects.toThrow(
      "Claude API error: 429 - Rate limited",
    );
  });

  it("returns empty string when no text block found", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ content: [] }),
    });

    const result = await callClaude("sys", "msg");
    expect(result).toBe("");
  });
});

describe("parseJSON", () => {
  it("parses plain JSON", () => {
    const result = parseJSON<{ name: string }>('{"name": "test"}');
    expect(result).toEqual({ name: "test" });
  });

  it("extracts JSON from markdown code block", () => {
    const input = 'Some text\n```json\n{"value": 42}\n```\nMore text';
    const result = parseJSON<{ value: number }>(input);
    expect(result).toEqual({ value: 42 });
  });

  it("extracts JSON from code block without language", () => {
    const input = '```\n{"key": "val"}\n```';
    const result = parseJSON<{ key: string }>(input);
    expect(result).toEqual({ key: "val" });
  });

  it("throws on invalid JSON", () => {
    expect(() => parseJSON("not json")).toThrow();
  });
});
