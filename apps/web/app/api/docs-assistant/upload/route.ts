import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 },
      );
    }

    const backendForm = new FormData();
    backendForm.append("file", file);

    const res = await fetch(`${process.env.BACKEND_URL}/api/v1/documents`, {
      method: "POST",
      body: backendForm,
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("upload error:", error);
      return NextResponse.json({ message: error }, { status: res.status });
    }

    const data = await res.json();
    console.log("Upload response:", data);
    return NextResponse.json(data);
  } catch (err) {
    console.error("upload route error:", err);
    return NextResponse.json({ message: "Upload failed." }, { status: 500 });
  }
}
