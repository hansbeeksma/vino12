import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createServiceRoleClient();

    // Calculate metrics for yesterday
    const { error: metricsError } = await supabase.rpc(
      "calculate_daily_metrics",
    );

    if (metricsError) {
      return NextResponse.json(
        { error: "Metrics calculation failed", details: metricsError.message },
        { status: 500 },
      );
    }

    // Update cohorts
    const { error: cohortError } = await supabase.rpc("update_cohorts");

    if (cohortError) {
      return NextResponse.json(
        { error: "Cohort update failed", details: cohortError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Daily metrics and cohorts updated",
    });
  } catch {
    return NextResponse.json({ error: "Cron job failed" }, { status: 500 });
  }
}
