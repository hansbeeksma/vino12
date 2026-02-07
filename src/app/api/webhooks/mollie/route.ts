import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  // TODO: Implement Mollie webhook handler
  // - Verify webhook signature
  // - Update order payment status
  // - Trigger fulfillment if paid
  const body = await request.text();

  if (!body) {
    return NextResponse.json(
      { error: "Missing request body" },
      { status: 400 },
    );
  }

  // Mollie sends payment ID in POST body
  // const paymentId = body // Format: "tr_xxxxxxxxxx"

  return NextResponse.json({ received: true });
}
