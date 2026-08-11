import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No image provided" },
        { status: 400 },
      );
    }

    const res = await fetch(
      `${process.env.BACKEND_URL}/api/v1/receipts/predict`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (!res.ok) {
      const error = await res.text();
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { message: "Upload image failed." },
      { status: 500 },
    );
  }
}
