import { PredictionResponse } from "@/types/receipt";

export type DocumentDemo = {
  document_id: string;
  filename: string;
  answers: Record<string, string>;
};

export type ReceiptDemo = {
  filename: string;
  image_url: string;
  result: PredictionResponse;
};
