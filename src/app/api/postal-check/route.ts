import { NextRequest, NextResponse } from "next/server";
import { checkPostalCode } from "@/features/fulfillment/postal-restrictions";

export async function GET(req: NextRequest) {
  const postalCode = req.nextUrl.searchParams.get("code");

  if (!postalCode) {
    return NextResponse.json(
      { error: "Missing 'code' parameter" },
      { status: 400 },
    );
  }

  const result = checkPostalCode(postalCode);

  return NextResponse.json(result);
}
