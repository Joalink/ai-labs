import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message, documentIds } = await req.json();
    const sessionId = req.headers.get("X-Session-ID");

    if (!sessionId) {
      return NextResponse.json(
        { reply: "Session ID is required" },
        { status: 400 },
      );
    }

    const url = new URL(`${process.env.BACKEND_URL}/api/v1/documents/chat`);
    url.searchParams.set("query", message);
    for (const documentId of documentIds ?? []) {
      url.searchParams.append("document_ids", documentId);
    }

    const res = await fetch(url.toString(), {
      method: "POST",
      headers: { "X-Session-ID": sessionId },
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("chat error:", error);
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    console.error("chat route error:", err);
    return NextResponse.json({ message: "Chat failed." }, { status: 500 });
  }
}
