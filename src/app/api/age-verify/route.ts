import { NextRequest, NextResponse } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const verified = body.verified === true;

  const supabase = createServiceRoleClient();

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
  const userAgent = request.headers.get("user-agent") ?? null;

  await supabase.from("age_verifications").insert({
    method: "modal_confirm",
    verified,
    ip_address: ip,
    user_agent: userAgent,
    metadata: { source: "age_gate", timestamp: new Date().toISOString() },
  });

  return NextResponse.json({ ok: true });
}
