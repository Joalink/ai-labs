export interface BoundingBox {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface Detection {
  class_id: number;
  class_name: string;
  confidence: number;
  bbox: BoundingBox;
}

export interface PredictionResponse {
  success: boolean;
  total_detections: number;
  detections: Detection[];
}

export interface ReceiptRecord {
  id: number;
  filename: string;
  total_detections: number;
  detections: Detection[];
  confidence_threshold: number;
  created_at: string;
}

export interface MonthlyReceiptAnalytics {
  month: string;
  total_spend: number;
  purchase_count: number;
  average_receipt: number;
  category_totals: Record<string, number>;
  product_totals: Record<string, number>;
  product_quantities: Record<string, number>;
  purchase_days: Record<string, number>;
}
