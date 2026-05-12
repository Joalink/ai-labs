import { ApiResponse, UploadResponse } from "@/types/chat";

const BASE_URL = "/api";

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}/${endpoint}`, options);
  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message ?? "Request failed");
  }
  return res.json();
}

export function uploadDocument(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return request("docs-assistant/upload", { method: "POST", body: formData });
}

export function sendChatMessage(
  message: string,
  namespace: string,
): Promise<ApiResponse> {
  return request("docs-assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, namespace }),
  });
}
