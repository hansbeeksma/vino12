import { callClaude, parseJSON } from "./claude";
import { createServiceRoleClient } from "@/lib/supabase/server";

export interface DailyMetrics {
  date: string;
  page_views: number;
  unique_visitors: number;
  products_viewed: number;
  add_to_cart: number;
  checkouts_started: number;
  orders: number;
  revenue_cents: number;
  searches: number;
}

export interface DailyInsight {
  summary: string;
  highlights: string[];
  concerns: string[];
  trends: {
    metric: string;
    direction: "up" | "down" | "stable";
    change_pct: number;
    interpretation: string;
  }[];
  recommendation: string;
}

const METRIC_NAMES = [
  "page_views",
  "unique_visitors",
  "products_viewed",
  "add_to_cart",
  "checkouts_started",
  "orders",
  "revenue_cents",
  "searches",
] as const;

const INSIGHTS_SYSTEM_PROMPT = `Je bent een data-analist voor VINO12, een Nederlandse online wijnwinkel.
Analyseer de dagelijkse metrics en geef actionable insights in het Nederlands.

Regels:
- Wees specifiek en concreet, niet vaag
- Vergelijk vandaag met gisteren EN het 7-daags gemiddelde
- Benoem anomalieën (>20% afwijking van 7-daags gemiddelde)
- Revenue in euro's (revenue_cents / 100)
- Conversion rate = orders / unique_visitors * 100
- Cart abandonment = 1 - (orders / checkouts_started) * 100
- Houd het kort en scanbaar

Antwoord ALLEEN in dit JSON formaat:
{
  "summary": "1-2 zinnen samenvatting van de dag",
  "highlights": ["positieve observaties"],
  "concerns": ["zorgpunten of dalingen"],
  "trends": [
    {
      "metric": "metric naam",
      "direction": "up|down|stable",
      "change_pct": 0.0,
      "interpretation": "wat dit betekent"
    }
  ],
  "recommendation": "1 concrete aanbeveling voor vandaag"
}`;

export async function fetchDailyMetrics(
  targetDate: string,
): Promise<{
  today: DailyMetrics;
  yesterday: DailyMetrics;
  avg7d: DailyMetrics;
}> {
  const supabase = createServiceRoleClient();

  const { data: rawMetrics, error } = await supabase
    .from("analytics_daily_metrics")
    .select("date, metric_name, metric_value")
    .gte("date", getDateOffset(targetDate, -7))
    .lte("date", targetDate)
    .in("metric_name", [...METRIC_NAMES]);

  if (error) {
    throw new Error(`Failed to fetch metrics: ${error.message}`);
  }

  const yesterday = getDateOffset(targetDate, -1);

  const today = buildMetrics(rawMetrics, targetDate);
  const yesterdayMetrics = buildMetrics(rawMetrics, yesterday);
  const avg7d = buildAverage(rawMetrics, targetDate);

  return { today, yesterday: yesterdayMetrics, avg7d };
}

function getDateOffset(date: string, days: number): string {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

interface RawMetric {
  date: string;
  metric_name: string;
  metric_value: number;
}

function buildMetrics(raw: RawMetric[], date: string): DailyMetrics {
  const dayData = raw.filter((r) => r.date === date);
  const metrics: DailyMetrics = {
    date,
    page_views: 0,
    unique_visitors: 0,
    products_viewed: 0,
    add_to_cart: 0,
    checkouts_started: 0,
    orders: 0,
    revenue_cents: 0,
    searches: 0,
  };

  for (const row of dayData) {
    if (row.metric_name in metrics) {
      (metrics as Record<string, number | string>)[row.metric_name] = Number(
        row.metric_value,
      );
    }
  }

  return metrics;
}

function buildAverage(raw: RawMetric[], targetDate: string): DailyMetrics {
  const sevenDaysAgo = getDateOffset(targetDate, -7);
  const yesterday = getDateOffset(targetDate, -1);
  const periodData = raw.filter(
    (r) => r.date >= sevenDaysAgo && r.date <= yesterday,
  );

  const sums: Record<string, number> = {};
  const counts: Record<string, number> = {};

  for (const row of periodData) {
    sums[row.metric_name] =
      (sums[row.metric_name] ?? 0) + Number(row.metric_value);
    counts[row.metric_name] = (counts[row.metric_name] ?? 0) + 1;
  }

  const avg: DailyMetrics = {
    date: `${sevenDaysAgo} - ${yesterday}`,
    page_views: 0,
    unique_visitors: 0,
    products_viewed: 0,
    add_to_cart: 0,
    checkouts_started: 0,
    orders: 0,
    revenue_cents: 0,
    searches: 0,
  };

  for (const name of METRIC_NAMES) {
    if (counts[name]) {
      (avg as Record<string, number | string>)[name] = Math.round(
        sums[name] / counts[name],
      );
    }
  }

  return avg;
}

export async function generateInsights(
  today: DailyMetrics,
  yesterday: DailyMetrics,
  avg7d: DailyMetrics,
): Promise<DailyInsight> {
  const conversionToday =
    today.unique_visitors > 0
      ? ((today.orders / today.unique_visitors) * 100).toFixed(2)
      : "0";
  const conversionYesterday =
    yesterday.unique_visitors > 0
      ? ((yesterday.orders / yesterday.unique_visitors) * 100).toFixed(2)
      : "0";

  const prompt = `Analyseer de metrics van ${today.date}:

VANDAAG:
- Paginaweergaven: ${today.page_views}
- Unieke bezoekers: ${today.unique_visitors}
- Producten bekeken: ${today.products_viewed}
- Winkelwagen: ${today.add_to_cart}
- Checkout gestart: ${today.checkouts_started}
- Bestellingen: ${today.orders}
- Omzet: €${(today.revenue_cents / 100).toFixed(2)}
- Zoekopdrachten: ${today.searches}
- Conversie: ${conversionToday}%

GISTEREN:
- Paginaweergaven: ${yesterday.page_views}
- Unieke bezoekers: ${yesterday.unique_visitors}
- Producten bekeken: ${yesterday.products_viewed}
- Winkelwagen: ${yesterday.add_to_cart}
- Checkout gestart: ${yesterday.checkouts_started}
- Bestellingen: ${yesterday.orders}
- Omzet: €${(yesterday.revenue_cents / 100).toFixed(2)}
- Zoekopdrachten: ${yesterday.searches}
- Conversie: ${conversionYesterday}%

7-DAAGS GEMIDDELDE:
- Paginaweergaven: ${avg7d.page_views}
- Unieke bezoekers: ${avg7d.unique_visitors}
- Producten bekeken: ${avg7d.products_viewed}
- Winkelwagen: ${avg7d.add_to_cart}
- Checkout gestart: ${avg7d.checkouts_started}
- Bestellingen: ${avg7d.orders}
- Omzet: €${(avg7d.revenue_cents / 100).toFixed(2)}
- Zoekopdrachten: ${avg7d.searches}`;

  const response = await callClaude(INSIGHTS_SYSTEM_PROMPT, prompt);
  return parseJSON<DailyInsight>(response);
}
