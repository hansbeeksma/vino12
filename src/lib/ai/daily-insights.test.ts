import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFrom = vi.fn();
const mockSelect = vi.fn();
const mockGte = vi.fn();
const mockLte = vi.fn();
const mockIn = vi.fn();

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({
    from: mockFrom,
  }),
}));

vi.mock("./claude", () => ({
  callClaude: vi.fn(),
  parseJSON: vi.fn(),
}));

import { fetchDailyMetrics, generateInsights } from "./daily-insights";
import type { DailyMetrics } from "./daily-insights";
import { callClaude, parseJSON } from "./claude";

const mockCallClaude = callClaude as ReturnType<typeof vi.fn>;
const mockParseJSON = parseJSON as ReturnType<typeof vi.fn>;

function setupSupabaseMock(data: unknown[], error: unknown = null) {
  mockIn.mockResolvedValue({ data, error });
  mockLte.mockReturnValue({ in: mockIn });
  mockGte.mockReturnValue({ lte: mockLte });
  mockSelect.mockReturnValue({ gte: mockGte });
  mockFrom.mockReturnValue({ select: mockSelect });
}

describe("fetchDailyMetrics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and groups metrics by date", async () => {
    const rawData = [
      { date: "2026-02-07", metric_name: "page_views", metric_value: 150 },
      { date: "2026-02-07", metric_name: "orders", metric_value: 5 },
      { date: "2026-02-07", metric_name: "revenue_cents", metric_value: 25000 },
      { date: "2026-02-07", metric_name: "unique_visitors", metric_value: 80 },
      { date: "2026-02-06", metric_name: "page_views", metric_value: 120 },
      { date: "2026-02-06", metric_name: "orders", metric_value: 3 },
      { date: "2026-02-06", metric_name: "revenue_cents", metric_value: 18000 },
      { date: "2026-02-06", metric_name: "unique_visitors", metric_value: 60 },
    ];
    setupSupabaseMock(rawData);

    const result = await fetchDailyMetrics("2026-02-07");

    expect(result.today.page_views).toBe(150);
    expect(result.today.orders).toBe(5);
    expect(result.today.revenue_cents).toBe(25000);
    expect(result.yesterday.page_views).toBe(120);
    expect(result.yesterday.orders).toBe(3);
  });

  it("throws on Supabase error", async () => {
    setupSupabaseMock([], { message: "Connection failed" });

    await expect(fetchDailyMetrics("2026-02-07")).rejects.toThrow(
      "Failed to fetch metrics: Connection failed",
    );
  });

  it("returns zeros for missing metrics", async () => {
    setupSupabaseMock([]);

    const result = await fetchDailyMetrics("2026-02-07");

    expect(result.today.page_views).toBe(0);
    expect(result.today.orders).toBe(0);
    expect(result.today.revenue_cents).toBe(0);
    expect(result.today.unique_visitors).toBe(0);
  });

  it("calculates 7-day average correctly", async () => {
    const rawData = [
      // 7 days of page_views: 100,120,80,90,110,130,70 (avg = 100)
      { date: "2026-01-31", metric_name: "page_views", metric_value: 100 },
      { date: "2026-02-01", metric_name: "page_views", metric_value: 120 },
      { date: "2026-02-02", metric_name: "page_views", metric_value: 80 },
      { date: "2026-02-03", metric_name: "page_views", metric_value: 90 },
      { date: "2026-02-04", metric_name: "page_views", metric_value: 110 },
      { date: "2026-02-05", metric_name: "page_views", metric_value: 130 },
      { date: "2026-02-06", metric_name: "page_views", metric_value: 70 },
      // target date
      { date: "2026-02-07", metric_name: "page_views", metric_value: 200 },
    ];
    setupSupabaseMock(rawData);

    const result = await fetchDailyMetrics("2026-02-07");

    // avg of days before target (2026-01-31 to 2026-02-06)
    expect(result.avg7d.page_views).toBe(100); // (100+120+80+90+110+130+70)/7 = 100
    expect(result.today.page_views).toBe(200);
  });
});

describe("generateInsights", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("calls Claude with formatted metrics and returns parsed result", async () => {
    const mockInsight = {
      summary: "Goede dag voor VINO12",
      highlights: ["Orders gestegen"],
      concerns: [],
      trends: [
        {
          metric: "orders",
          direction: "up",
          change_pct: 25,
          interpretation: "Meer verkoop",
        },
      ],
      recommendation: "Meer wijnpromoties",
    };

    mockCallClaude.mockResolvedValue("json response");
    mockParseJSON.mockReturnValue(mockInsight);

    const today: DailyMetrics = {
      date: "2026-02-07",
      page_views: 150,
      unique_visitors: 80,
      products_viewed: 60,
      add_to_cart: 15,
      checkouts_started: 10,
      orders: 5,
      revenue_cents: 25000,
      searches: 20,
    };

    const yesterday: DailyMetrics = {
      date: "2026-02-06",
      page_views: 120,
      unique_visitors: 60,
      products_viewed: 45,
      add_to_cart: 10,
      checkouts_started: 8,
      orders: 3,
      revenue_cents: 18000,
      searches: 15,
    };

    const avg7d: DailyMetrics = {
      date: "avg",
      page_views: 130,
      unique_visitors: 70,
      products_viewed: 50,
      add_to_cart: 12,
      checkouts_started: 9,
      orders: 4,
      revenue_cents: 20000,
      searches: 18,
    };

    const result = await generateInsights(today, yesterday, avg7d);

    expect(mockCallClaude).toHaveBeenCalledOnce();
    const prompt = mockCallClaude.mock.calls[0][1];
    expect(prompt).toContain("2026-02-07");
    expect(prompt).toContain("150"); // page_views
    expect(prompt).toContain("€250.00"); // revenue
    expect(prompt).toContain("6.25%"); // conversion (5/80*100)

    expect(result.summary).toBe("Goede dag voor VINO12");
    expect(result.trends).toHaveLength(1);
  });

  it("handles zero visitors without division error", async () => {
    mockCallClaude.mockResolvedValue("{}");
    mockParseJSON.mockReturnValue({
      summary: "",
      highlights: [],
      concerns: [],
      trends: [],
      recommendation: "",
    });

    const zeroMetrics: DailyMetrics = {
      date: "2026-02-07",
      page_views: 0,
      unique_visitors: 0,
      products_viewed: 0,
      add_to_cart: 0,
      checkouts_started: 0,
      orders: 0,
      revenue_cents: 0,
      searches: 0,
    };

    await expect(
      generateInsights(zeroMetrics, zeroMetrics, zeroMetrics),
    ).resolves.toBeDefined();

    const prompt = mockCallClaude.mock.calls[0][1];
    expect(prompt).toContain("Conversie: 0%");
  });
});
