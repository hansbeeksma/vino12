import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockGte = vi.fn();
const mockOrder = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: mockSelect,
    }),
  }),
}));

const mockMessagesCreate = vi.fn();
vi.mock("@anthropic-ai/sdk", () => {
  return {
    default: class MockAnthropic {
      messages = { create: mockMessagesCreate };
    },
  };
});

const mockSend = vi.fn();
vi.mock("@/lib/resend", () => ({
  getResend: () => ({
    emails: { send: mockSend },
  }),
}));

import { GET } from "./route";

function makeRequest(headers: Record<string, string> = {}): Request {
  return new Request("http://localhost:3000/api/cron/daily-insights", {
    headers,
  });
}

function setupSupabaseMock(
  data: unknown[] | null = [],
  error: { message: string } | null = null,
) {
  mockOrder.mockResolvedValue({ data, error });
  mockGte.mockReturnValue({ order: mockOrder });
  mockSelect.mockReturnValue({ gte: mockGte });
}

describe("GET /api/cron/daily-insights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("CRON_SECRET", "test-secret");
    vi.stubEnv("INSIGHT_RECIPIENTS", "admin@vino12.com,team@vino12.com");
    vi.stubEnv("RESEND_FROM_EMAIL", "test@vino12.com");
    vi.stubEnv("ANTHROPIC_API_KEY", "test-key");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("returns 401 without valid auth header", async () => {
    const res = await GET(makeRequest() as never);
    expect(res.status).toBe(401);
  });

  it("returns 401 with wrong secret", async () => {
    const res = await GET(
      makeRequest({ authorization: "Bearer wrong-secret" }) as never,
    );
    expect(res.status).toBe(401);
  });

  it("returns 500 when metrics query fails", async () => {
    setupSupabaseMock(null, { message: "Connection failed" });

    const res = await GET(
      makeRequest({ authorization: "Bearer test-secret" }) as never,
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.details).toContain("Connection failed");
  });

  it("returns 500 when INSIGHT_RECIPIENTS is not set", async () => {
    vi.stubEnv("INSIGHT_RECIPIENTS", "");
    setupSupabaseMock([]);
    mockMessagesCreate.mockResolvedValue({
      content: [{ type: "text", text: "Insight text" }],
    });

    const res = await GET(
      makeRequest({ authorization: "Bearer test-secret" }) as never,
    );
    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.details).toContain("INSIGHT_RECIPIENTS not configured");
  });

  it("fetches metrics, generates insight, and sends email", async () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    setupSupabaseMock([
      { date: yesterdayStr, metric_name: "page_views", value: 150 },
      { date: yesterdayStr, metric_name: "orders", value: 5 },
    ]);

    mockMessagesCreate.mockResolvedValue({
      content: [{ type: "text", text: "Goede dag voor verkoop." }],
    });
    mockSend.mockResolvedValue({ id: "email-123" });

    const res = await GET(
      makeRequest({ authorization: "Bearer test-secret" }) as never,
    );

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.message).toContain("Daily insight email sent");

    // Verify Anthropic SDK was called
    expect(mockMessagesCreate).toHaveBeenCalledOnce();
    const claudeArgs = mockMessagesCreate.mock.calls[0][0];
    expect(claudeArgs.model).toBe("claude-haiku-4-5-20251001");
    expect(claudeArgs.max_tokens).toBe(1024);

    // Verify email was sent
    expect(mockSend).toHaveBeenCalledOnce();
    const emailArgs = mockSend.mock.calls[0][0];
    expect(emailArgs.to).toEqual(["admin@vino12.com", "team@vino12.com"]);
    expect(emailArgs.subject).toContain("VINO12 Daily Insights");
    expect(emailArgs.html).toContain("VINO12 Daily Insights");
  });

  it("returns 500 on Claude API failure", async () => {
    setupSupabaseMock([]);
    mockMessagesCreate.mockRejectedValue(new Error("Rate limited"));

    const res = await GET(
      makeRequest({ authorization: "Bearer test-secret" }) as never,
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.details).toBe("Rate limited");
  });

  it("returns 500 on email send failure", async () => {
    setupSupabaseMock([]);
    mockMessagesCreate.mockResolvedValue({
      content: [{ type: "text", text: "Test insight" }],
    });
    mockSend.mockRejectedValue(new Error("Resend quota exceeded"));

    const res = await GET(
      makeRequest({ authorization: "Bearer test-secret" }) as never,
    );

    expect(res.status).toBe(500);
    const body = await res.json();
    expect(body.details).toBe("Resend quota exceeded");
  });
});
