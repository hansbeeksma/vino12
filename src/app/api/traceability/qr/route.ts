import { type NextRequest, NextResponse } from "next/server";
import {
  generatePassportQR,
  generatePassportQRSvg,
} from "@/lib/traceability/qr";

export async function GET(request: NextRequest) {
  const wineId = request.nextUrl.searchParams.get("wine_id");
  const format = request.nextUrl.searchParams.get("format") ?? "png";

  if (!wineId) {
    return NextResponse.json(
      { success: false, error: "wine_id parameter is required" },
      { status: 400 },
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    `${request.nextUrl.protocol}//${request.nextUrl.host}`;

  if (format === "svg") {
    const svg = await generatePassportQRSvg(wineId, baseUrl);
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  const dataUrl = await generatePassportQR(wineId, baseUrl);
  return NextResponse.json({ success: true, data: { qr_data_url: dataUrl } });
}
