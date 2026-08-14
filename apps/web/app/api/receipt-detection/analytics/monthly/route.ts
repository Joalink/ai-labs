import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const month = req.nextUrl.searchParams.get("month");
  if (!month) {
    return NextResponse.json({ message: "Month is required" }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/receipts/analytics/monthly?month=${encodeURIComponent(month)}`,
      { cache: "no-store" },
    );
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ message: "Analytics are unavailable" }, { status: 500 });
  }
}
