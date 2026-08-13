export async function GET() {
  try {
    const response = await fetch(
      `${process.env.BACKEND_URL}/api/v1/demo/receipt/image`,
    );

    return new Response(response.body, {
      status: response.status,
      headers: { "Content-Type": response.headers.get("Content-Type") ?? "image/jpeg" },
    });
  } catch {
    return new Response("Demo image is unavailable", { status: 500 });
  }
}
