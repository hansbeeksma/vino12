import { NextResponse } from "next/server";

export async function POST() {
  // TODO: Implement checkout with Mollie payment creation
  return NextResponse.json(
    {
      success: false,
      error: "Checkout not yet implemented",
    },
    { status: 501 },
  );
}
