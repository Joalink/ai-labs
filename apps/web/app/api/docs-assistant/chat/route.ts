import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    const url = new URL(`${process.env.BACKEND_URL}/api/v1/chat`);
    url.searchParams.set("query", message);

    const res = await fetch(url.toString(), {
      method: "POST",
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("chat error:", error);
      return NextResponse.json({ reply: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("chat route error:", err);
    return NextResponse.json({ reply: "Chat failed." }, { status: 500 });
  }
}
