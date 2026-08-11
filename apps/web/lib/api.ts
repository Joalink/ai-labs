import { ApiResponse, UploadResponse } from "@/types/chat";
import {
  HouseEnergyPredictRequest,
  HouseEnergyPredictResponse,
} from "@/types/house-energy";
import { MeetingResult } from "@/types/meeting";
import { PredictionResponse, ReceiptRecord } from "@/types/receipt";

export type DocumentDemo = {
  file_name: string;
  answers: Record<string, string>;
};

export type ReceiptDemo = {
  file_name: string;
  image_url: string;
  result: PredictionResponse;
};

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
  return request("docs-assistant/upload", {
    method: "POST",
    body: formData,
  });
}

export function sendChatMessage(message: string): Promise<ApiResponse> {
  return request("docs-assistant/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });
}

export function uploadReceipt(file: File): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);
  return request("receipt-detection/predict", {
    method: "POST",
    body: formData,
  });
}

export function getReceiptHistory(): Promise<ReceiptRecord[]> {
  return request("receipt-detection/predictions");
}

export function getDocumentDemo(): Promise<DocumentDemo> {
  return request("demo/docs");
}

export function getMeetingDemo(): Promise<MeetingResult> {
  return request("demo/meeting");
}

export function getReceiptDemo(): Promise<ReceiptDemo> {
  return request("demo/receipt");
}

export function HouseEnergyConsumption(
  data: HouseEnergyPredictRequest,
): Promise<HouseEnergyPredictResponse> {
  return request("house-energy", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}
