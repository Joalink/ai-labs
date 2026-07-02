import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      household_size,
      avg_temperature_c,
      has_ac,
      peak_hours_usage_kwh,
      month,
      day_of_week,
    } = body;

    if (
      typeof household_size !== "number" ||
      typeof avg_temperature_c !== "number" ||
      typeof has_ac !== "boolean" ||
      typeof peak_hours_usage_kwh !== "number" ||
      typeof month !== "number" ||
      typeof day_of_week !== "number"
    ) {
      return NextResponse.json(
        { message: "Invalid request data" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/house-energy/predict`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          household_size,
          avg_temperature_c,
          has_ac,
          peak_hours_usage_kwh,
          month,
          day_of_week,
        }),
      },
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { message: "House energy prediction failed." },
      { status: 500 },
    );
  }
}
