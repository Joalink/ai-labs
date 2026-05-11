import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const res = await fetch(`${process.env.BACKEND_URL}/docs`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) throw new Error("Backend error");

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { reply: "Server error. Please try again." },
      { status: 500 },
    );
  }
}
