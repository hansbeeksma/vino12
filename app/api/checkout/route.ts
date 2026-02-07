import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  try {
    const { quantity } = await req.json();

    if (!quantity || quantity < 1) {
      return NextResponse.json(
        { error: "Minimaal 1 box" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "ideal"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Vino12 Box",
              description:
                "12 premium wijnen — 6 rood, 6 wit. Van licht en fris tot vol en complex.",
              images: [
                `${process.env.NEXT_PUBLIC_SITE_URL || "https://vino12.com"}/images/wines/pinot-noir-bourgogne.jpg`,
              ],
            },
            unit_amount: 17500,
          },
          quantity,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vino12.com"}/succes?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL || "https://vino12.com"}/#bestel`,
      shipping_address_collection: {
        allowed_countries: ["NL", "BE", "DE"],
      },
      locale: "nl",
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
