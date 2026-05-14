import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request: NextRequest) {
  try {
    const request = await fetch(`${process.env.BACKEND_URL}/api/v1/session`, {
      method: "DELETE",
    });
    const data = await request.json();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ message: "Cleanup failed" }, { status: 500 });
  }
}
