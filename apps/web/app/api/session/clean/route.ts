import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { sessionId } = body;

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/session/clean`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ session_id: sessionId }),
    });

    const data = await res.json().catch(() => ({ message: "Cleanup failed" }));
    if (!res.ok) {
      return NextResponse.json(
        { message: data.detail ?? data.message ?? "Cleanup failed" },
        { status: res.status },
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ message: "Cleanup failed" }, { status: 500 });
  }
}
