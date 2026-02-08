import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceRoleClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const SUPPORTED_METHODS = [
  "ideal",
  "creditcard",
  "bancontact",
  "paypal",
] as const;

const checkoutRequestSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  shippingAddress: z.object({
    street: z.string().min(1),
    houseNumber: z.string().min(1),
    houseNumberAddition: z.string().optional(),
    postalCode: z.string().regex(/^\d{4}\s?[A-Z]{2}$/),
    city: z.string().min(1),
    country: z.string().default("NL"),
  }),
  ageVerified: z.literal(true),
  notes: z.string().optional(),
  paymentMethod: z.enum(SUPPORTED_METHODS).optional(),
  idempotencyKey: z.string().uuid().optional(),
  items: z.array(
    z.object({
      wine_id: z.string().uuid(),
      name: z.string(),
      vintage: z.number().nullable(),
      price_cents: z.number().int().positive(),
      quantity: z.number().int().positive(),
    }),
  ),
  subtotal_cents: z.number().int(),
  shipping_cents: z.number().int(),
  total_cents: z.number().int(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = checkoutRequestSchema.parse(body);

    const supabase = createServiceRoleClient();

    // 1. Find or create customer
    const { data: customer, error: customerError } = await supabase
      .from("customers")
      .upsert(
        {
          email: data.email,
          first_name: data.firstName,
          last_name: data.lastName,
          phone: data.phone ?? null,
        },
        { onConflict: "email" },
      )
      .select("id")
      .single();

    if (customerError) {
      return NextResponse.json(
        { error: "Klantgegevens konden niet worden opgeslagen" },
        { status: 500 },
      );
    }

    // 2. Save shipping address to addresses table
    const addr = data.shippingAddress;
    await supabase.from("addresses").insert({
      customer_id: customer.id,
      street: addr.street,
      house_number: addr.houseNumber,
      house_number_addition: addr.houseNumberAddition ?? null,
      postal_code: addr.postalCode,
      city: addr.city,
      country: addr.country,
      is_default: true,
    });

    // 3. Create order with inline address fields
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customer.id,
        email: data.email,
        status: "pending",
        payment_status: "pending",
        subtotal_cents: data.subtotal_cents,
        shipping_cents: data.shipping_cents,
        discount_cents: 0,
        total_cents: data.total_cents,
        shipping_address_street: addr.street,
        shipping_address_house_number: addr.houseNumber,
        shipping_address_house_number_addition:
          addr.houseNumberAddition ?? null,
        shipping_address_postal_code: addr.postalCode,
        shipping_address_city: addr.city,
        shipping_address_country: addr.country,
        age_verified: true,
        notes: data.notes ?? null,
      })
      .select("id, order_number, mollie_payment_id")
      .single();

    if (orderError) {
      return NextResponse.json(
        { error: "Bestelling kon niet worden aangemaakt" },
        { status: 500 },
      );
    }

    // 4. Create order items
    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      wine_id: item.wine_id,
      wine_name: item.name,
      wine_vintage: item.vintage,
      quantity: item.quantity,
      unit_price_cents: item.price_cents,
      total_cents: item.price_cents * item.quantity,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      return NextResponse.json(
        { error: "Bestelitems konden niet worden opgeslagen" },
        { status: 500 },
      );
    }

    // 5. Idempotency: check if order already has an open Mollie payment
    const { mollieClient } = await import("@/lib/mollie");
    const { PaymentMethod } = await import("@mollie/api-client");
    const totalEur = (data.total_cents / 100).toFixed(2);
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://vino12.com";

    if (order.mollie_payment_id) {
      const existingPayment = await mollieClient.payments.get(
        order.mollie_payment_id,
      );
      const openStatuses = ["open", "pending"];
      if (openStatuses.includes(existingPayment.status)) {
        return NextResponse.json({
          success: true,
          checkoutUrl: existingPayment.getCheckoutUrl(),
          orderNumber: order.order_number,
        });
      }
    }

    // 6. Create Mollie payment
    const methodMap: Record<
      string,
      (typeof PaymentMethod)[keyof typeof PaymentMethod]
    > = {
      ideal: PaymentMethod.ideal,
      creditcard: PaymentMethod.creditcard,
      bancontact: PaymentMethod.bancontact,
      paypal: PaymentMethod.paypal,
    };

    const payment = await mollieClient.payments.create({
      amount: { currency: "EUR", value: totalEur },
      description: `VINO12 Bestelling ${order.order_number}`,
      redirectUrl: `${baseUrl}/succes?order=${order.order_number}`,
      webhookUrl: `${baseUrl}/api/webhooks/mollie`,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      ...(data.paymentMethod && methodMap[data.paymentMethod]
        ? { method: methodMap[data.paymentMethod] }
        : {}),
    });

    // 7. Store Mollie payment ID on order
    await supabase
      .from("orders")
      .update({ mollie_payment_id: payment.id })
      .eq("id", order.id);

    // 8. Log order event
    await supabase.from("order_events").insert({
      order_id: order.id,
      event_type: "created",
      data: { payment_id: payment.id, method: "mollie" },
    });

    return NextResponse.json({
      success: true,
      checkoutUrl: payment.getCheckoutUrl(),
      orderNumber: order.order_number,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ongeldige gegevens", details: error.issues },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: "Er ging iets mis bij het afrekenen" },
      { status: 500 },
    );
  }
}
