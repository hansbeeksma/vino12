import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getResend } from "@/lib/resend";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

interface DailyMetric {
  date: string;
  metric_name: string;
  value: number;
}

async function getRecentMetrics(): Promise<{
  today: DailyMetric[];
  yesterday: DailyMetric[];
  lastWeek: DailyMetric[];
}> {
  const supabase = createServiceRoleClient();
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split("T")[0];

  const weekAgo = new Date(now);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weekAgoStr = weekAgo.toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("analytics_daily_metrics")
    .select("date, metric_name, value")
    .gte("date", weekAgoStr)
    .order("date", { ascending: false });

  if (error) throw new Error(`Metrics query failed: ${error.message}`);

  const metrics = (data ?? []) as DailyMetric[];

  return {
    today: metrics.filter((m) => m.date === todayStr),
    yesterday: metrics.filter((m) => m.date === yesterdayStr),
    lastWeek: metrics.filter((m) => m.date >= weekAgoStr),
  };
}

function formatMetricsForPrompt(metrics: {
  today: DailyMetric[];
  yesterday: DailyMetric[];
  lastWeek: DailyMetric[];
}): string {
  const formatGroup = (group: DailyMetric[]): string =>
    group.length === 0
      ? "  Geen data beschikbaar"
      : group.map((m) => `  - ${m.metric_name}: ${m.value}`).join("\n");

  return `## Vandaag
${formatGroup(metrics.today)}

## Gisteren
${formatGroup(metrics.yesterday)}

## Afgelopen 7 dagen (per dag)
${metrics.lastWeek
  .reduce(
    (acc, m) => {
      const existing = acc.find((a) => a.date === m.date);
      if (existing) {
        existing.metrics.push(m);
      } else {
        acc.push({ date: m.date, metrics: [m] });
      }
      return acc;
    },
    [] as { date: string; metrics: DailyMetric[] }[],
  )
  .map(
    (day) =>
      `### ${day.date}\n${day.metrics.map((m) => `  - ${m.metric_name}: ${m.value}`).join("\n")}`,
  )
  .join("\n")}`;
}

async function generateInsight(metricsText: string): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new Error("ANTHROPIC_API_KEY not configured");

  const client = new Anthropic({ apiKey });

  const message = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: `Je bent een data-analist voor VINO12, een Nederlandse premium wijnbox webshop.

Analyseer de volgende dagelijkse metrics en geef een beknopte samenvatting in het Nederlands.

${metricsText}

Geef:
1. **Dagelijks Overzicht** — Korte samenvatting van de belangrijkste cijfers van gisteren
2. **Trends** — Opvallende stijgingen of dalingen t.o.v. vorige dagen
3. **Anomalieën** — Ongebruikelijke patronen die aandacht nodig hebben (of "Geen anomalieën gedetecteerd")
4. **Aanbeveling** — Eén concrete actie op basis van de data

Houd het kort en actionable. Max 200 woorden.`,
      },
    ],
  });

  const textBlock = message.content.find((block) => block.type === "text");
  return textBlock?.text ?? "Geen analyse beschikbaar.";
}

async function sendInsightEmail(
  insight: string,
  metricsDate: string,
): Promise<void> {
  const resend = getResend();
  const recipients = (process.env.INSIGHT_RECIPIENTS ?? "")
    .split(",")
    .map((e) => e.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    throw new Error("INSIGHT_RECIPIENTS not configured");
  }

  const fromEmail = process.env.RESEND_FROM_EMAIL ?? "analytics@vino12.com";

  await resend.emails.send({
    from: `VINO12 Analytics <${fromEmail}>`,
    to: recipients,
    subject: `VINO12 Daily Insights — ${metricsDate}`,
    html: `
<!DOCTYPE html>
<html lang="nl">
<head><meta charset="utf-8"></head>
<body style="font-family: 'IBM Plex Mono', monospace; background: #FAFAF5; color: #1A1A1A; padding: 32px;">
  <div style="max-width: 600px; margin: 0 auto;">
    <div style="border: 2px solid #1A1A1A; padding: 24px; background: white;">
      <h1 style="font-size: 20px; margin: 0 0 4px;">VINO12 Daily Insights</h1>
      <p style="font-size: 12px; color: #666; margin: 0 0 24px;">${metricsDate}</p>
      <div style="white-space: pre-wrap; line-height: 1.6; font-size: 14px;">
${insight}
      </div>
    </div>
    <p style="font-size: 11px; color: #999; margin-top: 16px; text-align: center;">
      Gegenereerd door Claude Haiku · VINO12 Analytics
    </p>
  </div>
</body>
</html>`,
  });
}

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const metrics = await getRecentMetrics();
    const metricsText = formatMetricsForPrompt(metrics);
    const insight = await generateInsight(metricsText);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateStr = yesterday.toISOString().split("T")[0];

    await sendInsightEmail(insight, dateStr);

    return NextResponse.json({
      ok: true,
      message: `Daily insight email sent for ${dateStr}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Daily insights failed", details: message },
      { status: 500 },
    );
  }
}
