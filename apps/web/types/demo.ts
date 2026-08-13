import { PredictionResponse } from "@/types/receipt";

export type DocumentDemo = {
  file_name: string;
  answers: Record<string, string>;
};

export type ReceiptDemo = {
  file_name: string;
  image_url: string;
  result: PredictionResponse;
};
