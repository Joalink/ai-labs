import { apiFetch, apiStream } from "./client";
import type { DocumentResponse } from "./types";
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function uploadDocument(file: File): Promise<DocumentResponse> {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${BASE_URL}/api/docs`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
  return res.json();
}

export async function sendChat(
  question: string,
  onChunk: (text: string) => void,
): Promise<void> {
  return apiStream("/api/chat", { question }, onChunk);
}
