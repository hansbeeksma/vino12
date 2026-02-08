import { NextRequest, NextResponse } from "next/server";
import { trackConsentAwareEvent } from "@/lib/analytics";
import { analyticsEventSchema } from "@rooseveltops/analytics-layer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = analyticsEventSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid event data" },
        { status: 400 },
      );
    }

    const cookieHeader = req.headers.get("cookie") ?? "";
    const userAgent = req.headers.get("user-agent") ?? undefined;
    const referrer = req.headers.get("referer") ?? undefined;
    const country =
      req.headers.get("x-vercel-ip-country") ?? req.geo?.country ?? undefined;

    await trackConsentAwareEvent(
      parsed.data.event_name,
      parsed.data.properties as Parameters<typeof trackConsentAwareEvent>[1],
      cookieHeader,
      {
        sessionId: parsed.data.session_id ?? undefined,
        userId: parsed.data.user_id ?? undefined,
        pageUrl: parsed.data.page_url ?? undefined,
        referrer,
        userAgent,
      },
    );

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to track event" },
      { status: 500 },
    );
  }
}
