import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { namespace } = body;

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/session/clean`, {
      method: "DELETE",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({ namespace }),
    });

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Cleanup failed" }, { status: 500 });
  }
}
