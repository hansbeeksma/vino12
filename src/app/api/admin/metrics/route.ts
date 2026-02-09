import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { MetricsClient } from "@rooseveltops/analytics-layer";

async function verifyAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const isAdmin =
    user.app_metadata?.role === "admin" ||
    (process.env.ADMIN_EMAILS ?? "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .includes(user.email?.toLowerCase() ?? "");

  return isAdmin ? user : null;
}

function getMetricsClient(): MetricsClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Supabase env vars not configured");
  }

  return new MetricsClient({
    supabaseUrl: url,
    supabaseServiceKey: key,
  });
}

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = req.nextUrl.searchParams.get("type");
  const period = req.nextUrl.searchParams.get("period") ?? "30d";
  const client = getMetricsClient();

  try {
    if (type === "aarrr") {
      const validPeriods = ["7d", "30d", "90d", "365d"] as const;
      const safePeriod = validPeriods.includes(
        period as (typeof validPeriods)[number],
      )
        ? (period as (typeof validPeriods)[number])
        : "30d";

      const metrics = await client.getAARRR(safePeriod);
      return NextResponse.json({ metrics, period: safePeriod });
    }

    if (type === "funnel") {
      const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
      const since = new Date();
      since.setDate(since.getDate() - days);
      const funnel = await client.getConversionFunnel(since.toISOString());
      return NextResponse.json({ funnel, period });
    }

    if (type === "daily") {
      const metricName = req.nextUrl.searchParams.get("metric") ?? "page_views";
      const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
      const data = await client.getDailyMetrics(metricName, days);
      return NextResponse.json({ data, metric: metricName, period });
    }

    return NextResponse.json(
      { error: "Unknown type. Use 'aarrr', 'funnel', or 'daily'" },
      { status: 400 },
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 },
    );
  }
}
