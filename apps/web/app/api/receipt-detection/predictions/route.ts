import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/receipts/predictions`,
      {
        method: "GET",
        cache: "no-store",
      },
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("get receipts error", err);
    return NextResponse.json(
      { message: "Failed to fetch receipts." },
      { status: 500 },
    );
  }
}
