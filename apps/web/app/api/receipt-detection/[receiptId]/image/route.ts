import { NextRequest } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ receiptId: string }> }) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  const { receiptId } = await params;
  if (!sessionId) return new Response("Session ID is required", { status: 400 });
  const response = await fetch(`${process.env.BACKEND_URL}/api/v1/receipts/${receiptId}/image`, {
    headers: { "X-Session-ID": sessionId },
  });
  return new Response(response.body, { status: response.status, headers: { "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg" } });
}
