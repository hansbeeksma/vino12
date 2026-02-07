import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/server";
import { mollieClient } from "@/lib/mollie";
import { SequenceType } from "@mollie/api-client";
import { z } from "zod";

const subscribeSchema = z.object({
  plan_type: z.enum(["monthly", "bimonthly", "quarterly"]),
  preferences: z
    .object({
      preferred_types: z.array(z.string()).optional(),
      preferred_regions: z.array(z.string()).optional(),
      budget_range: z
        .object({
          min: z.number().int().min(0),
          max: z.number().int().min(0),
        })
        .optional(),
      exclude_grapes: z.array(z.string()).optional(),
    })
    .optional(),
});

const PLAN_PRICES: Record<string, { cents: number; description: string }> = {
  monthly: {
    cents: 5995,
    description: "VINO12 Wijnclub - Maandelijks (6 flessen)",
  },
  bimonthly: {
    cents: 10995,
    description: "VINO12 Wijnclub - Tweemaandelijks (12 flessen)",
  },
  quarterly: {
    cents: 9995,
    description: "VINO12 Wijnclub - Per kwartaal (12 flessen)",
  },
};

const PLAN_BOTTLES: Record<string, number> = {
  monthly: 6,
  bimonthly: 12,
  quarterly: 12,
};

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const serviceClient = createServiceRoleClient();
  const { data: subscription } = await serviceClient
    .from("wine_club_subscriptions")
    .select("*")
    .eq("customer_id", user.id)
    .neq("status", "cancelled")
    .maybeSingle();

  return NextResponse.json({ subscription });
}

export async function POST(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validatie mislukt", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { plan_type, preferences } = parsed.data;
  const plan = PLAN_PRICES[plan_type];

  if (!plan) {
    return NextResponse.json({ error: "Onbekend abonnement" }, { status: 400 });
  }

  const serviceClient = createServiceRoleClient();

  // Check existing active subscription
  const { data: existing } = await serviceClient
    .from("wine_club_subscriptions")
    .select("id")
    .eq("customer_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (existing) {
    return NextResponse.json(
      { error: "Je hebt al een actief abonnement" },
      { status: 409 },
    );
  }

  // Get or create Mollie customer
  const { data: customer } = await serviceClient
    .from("customers")
    .select("mollie_customer_id, email")
    .eq("auth_user_id", user.id)
    .single();

  let mollieCustomerId = customer?.mollie_customer_id as string | null;

  if (!mollieCustomerId) {
    const mollieCustomer = await mollieClient.customers.create({
      name: user.email ?? "VINO12 Klant",
      email: user.email ?? (customer?.email as string),
    });
    mollieCustomerId = mollieCustomer.id;

    await serviceClient
      .from("customers")
      .update({ mollie_customer_id: mollieCustomerId })
      .eq("auth_user_id", user.id);
  }

  // Create first payment (mandate creation)
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vino12.nl";
  const payment = await mollieClient.payments.create({
    amount: {
      value: (plan.cents / 100).toFixed(2),
      currency: "EUR",
    },
    description: plan.description,
    redirectUrl: `${origin}/account?subscription=active`,
    webhookUrl: `${origin}/api/webhooks/mollie`,
    customerId: mollieCustomerId,
    sequenceType: SequenceType.first,
    metadata: {
      type: "wine_club_first_payment",
      plan_type,
      user_id: user.id,
    },
  });

  // Create subscription record
  const nextShipment = new Date();
  nextShipment.setDate(nextShipment.getDate() + 7);

  await serviceClient.from("wine_club_subscriptions").insert({
    customer_id: user.id,
    plan_type,
    bottles_per_shipment: PLAN_BOTTLES[plan_type],
    price_cents: plan.cents,
    status: "active",
    preferences: preferences ?? {},
    next_shipment_date: nextShipment.toISOString().split("T")[0],
  });

  return NextResponse.json({
    checkoutUrl: payment.getCheckoutUrl(),
    plan_type,
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const serviceClient = createServiceRoleClient();

  const { data: subscription } = await serviceClient
    .from("wine_club_subscriptions")
    .select("id, mollie_subscription_id, status")
    .eq("customer_id", user.id)
    .neq("status", "cancelled")
    .single();

  if (!subscription) {
    return NextResponse.json(
      { error: "Geen actief abonnement gevonden" },
      { status: 404 },
    );
  }

  if (body.action === "pause") {
    await serviceClient
      .from("wine_club_subscriptions")
      .update({ status: "paused" })
      .eq("id", subscription.id);

    return NextResponse.json({ status: "paused" });
  }

  if (body.action === "resume") {
    await serviceClient
      .from("wine_club_subscriptions")
      .update({ status: "active" })
      .eq("id", subscription.id);

    return NextResponse.json({ status: "active" });
  }

  if (body.action === "cancel") {
    if (subscription.mollie_subscription_id) {
      const { data: customer } = await serviceClient
        .from("customers")
        .select("mollie_customer_id")
        .eq("auth_user_id", user.id)
        .single();

      if (customer?.mollie_customer_id) {
        await mollieClient.customerSubscriptions
          .cancel(subscription.mollie_subscription_id as string, {
            customerId: customer.mollie_customer_id as string,
          })
          .catch(() => {});
      }
    }

    await serviceClient
      .from("wine_club_subscriptions")
      .update({ status: "cancelled" })
      .eq("id", subscription.id);

    return NextResponse.json({ status: "cancelled" });
  }

  return NextResponse.json({ error: "Ongeldige actie" }, { status: 400 });
}
