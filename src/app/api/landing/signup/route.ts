import { NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { resend } from "@/lib/resend";
import { trackServerEvent } from "@/lib/analytics";
import { type Variant } from "@/lib/landing-variants";

const signupSchema = z.object({
  email: z.email(),
  variant: z.enum(["a", "b", "c"]),
  source: z.string().optional(),
  medium: z.string().optional(),
  campaign: z.string().optional(),
});

function hashIp(ip: string): string {
  // Simple hash for dedup — not crypto-grade, just for grouping
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return hash.toString(36);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = signupSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Ongeldig e-mailadres." },
        { status: 400 },
      );
    }

    const { email, variant, source, medium, campaign } = parsed.data;
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      "unknown";
    const userAgent = request.headers.get("user-agent") ?? undefined;
    const referrer = request.headers.get("referer") ?? undefined;

    const supabase = createServiceRoleClient();

    const { error: dbError } = await supabase.from("landing_signups").upsert(
      {
        email,
        variant,
        source: source ?? null,
        medium: medium ?? null,
        campaign: campaign ?? null,
        referrer: referrer ?? null,
        user_agent: userAgent ?? null,
        ip_hash: hashIp(ip),
      },
      { onConflict: "email" },
    );

    if (dbError) {
      console.error("Landing signup DB error:", dbError);
      return NextResponse.json(
        { error: "Er ging iets mis. Probeer het later opnieuw." },
        { status: 500 },
      );
    }

    // Send welcome email (fire-and-forget)
    sendWelcomeEmail(email, variant).catch(() => {});

    // Track event (fire-and-forget)
    trackServerEvent(
      "landing_signup" as never,
      {
        variant,
        source: source ?? "direct",
        email_domain: email.split("@")[1],
      } as never,
    ).catch(() => {});

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het later opnieuw." },
      { status: 500 },
    );
  }
}

async function sendWelcomeEmail(email: string, variant: Variant) {
  const variantNames: Record<Variant, string> = {
    a: "onze curated selectie",
    b: "persoonlijke wijnaanbevelingen",
    c: "eerlijk geprijsde premium wijnen",
  };

  await resend.emails.send({
    from: "VINO12 <hallo@vino12.com>",
    to: email,
    subject: "Welkom bij VINO12!",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h1 style="font-size: 24px; color: #722f37;">Welkom bij VINO12</h1>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Bedankt voor je interesse in ${variantNames[variant]}.
          We houden je op de hoogte zodra we live gaan.
        </p>
        <p style="font-size: 16px; color: #333; line-height: 1.6;">
          Tot snel!<br/>
          Het VINO12 team
        </p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;" />
        <p style="font-size: 12px; color: #999;">
          Je ontvangt deze mail omdat je je hebt aangemeld op vino12.com.
        </p>
      </div>
    `,
  });
}
